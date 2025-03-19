import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UseAuth } from "../../hooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";
import { useLocation } from "react-router-dom";

import { api } from "../../services/server";

export default function Login() {
    const { signIn, error, userId } = UseAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [message, setMessage] = useState("");
    const [isShowingTerm, setIsShowingTerm] = useState(false)
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const location = useLocation();

    useEffect(() => {
        if (location.state?.mensagem && location.state.mensagem == "") {
            setMessage(location.state.mensagem);
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
        }
    }, [location.state]);

    const { vertical, horizontal, open } = state;

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const sucesso = await signIn(email, senha);
            if (sucesso) {
                const userLevel = localStorage.getItem('user_level');
                const firstAccessiblePage = getFirstAccessiblePage(userLevel);
                if (Number(sucesso.data.userLevelAccess) == 3 && !sucesso.data.termo) {
                    setIsShowingTerm(true)
                    setTimeout(() => {
                        const termoBox = document.getElementById("blocker-box");
                        if (termoBox) termoBox.scrollTop = 0;
                    }, 0);
                    return;
                } else {
                    navigate(firstAccessiblePage);
                    return;
                }
            }
        } catch (e) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Algo inesperado aconteceu.");
        }
    };

    const getFirstAccessiblePage = (userLevel) => {
        const accessMap = {
            '0': '/agenda',
            '1': '/agenda',
            '2': '/pacientes',
            '3': '/agenda',
        };
        return accessMap[userLevel] || '/entrar';
    };

    useEffect(() => {
        const handleKeyPress = async (event) => {
            if (event.key === 'Enter') {
                try {
                    const sucesso = await signIn(email, senha);
                    if (sucesso) {
                        const userLevel = localStorage.getItem('user_level');
                        const firstAccessiblePage = getFirstAccessiblePage(userLevel);
                        if (Number(sucesso.data.userLevelAccess) == 3 && !sucesso.data.termo) {
                            setIsShowingTerm(true)
                            setTimeout(() => {
                                const termoBox = document.getElementById("blocker-box");
                                if (termoBox) termoBox.scrollTop = 0;
                            }, 0);
                            return;
                        } else {
                            navigate(firstAccessiblePage);
                            return;
                        }
                    }
                } catch (e) {
                    setState({ vertical: 'bottom', horizontal: 'center', open: true });
                    setMessage("Algo inesperado aconteceu.");
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [email, senha, navigate, signIn, setState, setMessage]);

    const handleMensagem = (newState) => () => {
        setState({ ...newState, open: true });
        setMessage("Não possui acesso? Entre em contato com o administrador do sistema.");
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleTermDecision = async (decision) => {
        if (decision) {
            const userLevel = localStorage.getItem('user_level');
            const token = localStorage.getItem("user_token")
            try {
                const response = await api.patch(`/aluno/alterar/eu`, { termo: true }, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
                const firstAccessiblePage = getFirstAccessiblePage(userLevel);
                setIsShowingTerm(false)
                navigate(firstAccessiblePage);
            } catch (e) {
                setState({ ...state, open: true });
                setMessage("Erro ao aceitar termo");
            }
        } else {
            setIsShowingTerm(false)
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Para acessar o sistema, o termo de ciência e responsabilidade deve ser aceito.");
        }
    }

    return (
        <div className="body">
            <div className="box" style={{ display: `${isShowingTerm ? "none" : ""}` }}>
                <div className="form">
                    <img src={logo} alt="psicare" />
                    <input
                        type="email"
                        id="email"
                        className="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="senha-container">
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            id="senha"
                            className="senha"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-senha"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        id="button-login"
                        className="button-login"
                        onClick={handleSubmit}
                    >
                        Entrar
                    </button>
                    <p className="error-message-login">{error}</p>
                    <div className="mensagem_alerta">
                        <h3 onClick={handleMensagem({ vertical: 'bottom', horizontal: 'center' })}>
                            Não possui cadastro?
                        </h3>
                    </div>
                </div>
            </div>
            <div className="blocker-box" id="blocker-box" style={{ display: `${!isShowingTerm ? "none" : ""}` }}>
                <h1>TERMO DE CIÊNCIA E RESPONSABILIDADE PARA TRATAMENTO DE DADOS PESSOAIS E CONDUTA PROFISSIONAL DO PSICÓLOGO</h1>
                <h2>Ao aceitar esse documento, DECLARO ciência e concordância inequívoca quanto aos termos que seguem abaixo: </h2>
                <div className="term-box">
                    <p>Disposição</p>
                    <p>
                        A Lei Geral de Proteção de Dados (nº 13.709/2018) que dispõe sobre o tratamento de dados pessoais (físicos ou digitais) é de sujeição de qualquer pessoa física ou jurídica com o objetivo de proteger os direitos fundamentais e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.
                        <br />
                        <br />
                        De forma geral, o Código de Ética do Psicólogo trata o sigilo profissional da seguinte forma: Art. 9º - É dever do psicólogo respeitar o sigilo profissional a fim de proteger, por meio da confidencialidade, a intimidade das pessoas, grupos ou organizações, a que tenha acesso no exercício profissional.
                        <br />
                        <br />
                        Reconheço que em caso de acesso a informações pessoais, sensíveis, confidenciais ou não, devo pautar-me de responsabilidade diariamente na proteção destas.
                        <br />
                        <br />
                        Com a referida Lei, deverão ser adotadas práticas em relação ao exercício de meu cargo/função para tratamento de dados pessoais em formato de documentos físicos e/ou digitais dos quais tenho acesso, ainda que eventualmente, não sejam disseminados ou utilizados de maneira não ética.
                        <br />
                        <br />
                        Tenho ciência de que as credenciais de acesso (login e senha) são de uso pessoal e intransferível. É de minha inteira responsabilidade todo e qualquer prejuízo causado pelo fornecimento de minha senha pessoal a terceiros, independente do motivo.
                        <br />
                        <br />
                        Tenho ciência de que, com o término do meu vínculo legal, jurídico e/ou contratual com a UniEvangélica, serão cessadas as minhas permissões de uso dos sistemas que contém dados pessoais.
                        <br />
                        <br />
                        Por meio deste documento, comprometo-me ainda a:
                        <br />
                        <span>a)</span> Não efetuar gravação ou cópia da documentação sigilosa ou pessoal a que tiver acesso para fins diversos não relativos à função ou cargo;
                        <br />
                        <span>b)</span> Manter a necessária cautela quando da exibição de dados em tela, impressora ou na gravação em meios eletrônicos, a fim de evitar o conhecimento desses por pessoas não autorizadas;
                        <br />
                        <span>c)</span> Ao me ausentar da estação de trabalho encerrar a sessão de uso do navegador, bloquear estação de trabalho, garantindo assim a impossibilidade de acesso indevido por terceiros;
                        <br />
                        <span>d)</span> Alterar senhas de acesso regularmente, sempre que for requisitado ou que tenha suspeição de descoberta por terceiros, não usando combinações simples que possam ser facilmente descobertas;
                        <br />
                        <span>e)</span> Não navegar em sites pornográficos, defensores do uso de drogas, de pedofilia ou sites de cunho racista e similares ou realizar qualquer atividade tipificada como crime, bem como não fazer download de material protegido por direitos autorais ou com conteúdo impróprio;
                        <br />
                        <span>f)</span> Realizar o armazenamento e descarte de documentos físicos e mídias, como CDs, pendrives, etc., de acordo com as políticas definidas pela UniEvangélica.
                        <br />
                        <span>g)</span> Adotar quaisquer outras medidas necessárias ao efetivo uso e proteção de dados de modo seguro e com as finalidades específicas pelas quais foram fornecidos.
                        <br />
                        <br />
                        Entendo que posso responder em âmbito administrativo e judicial pelas consequências das ações ou omissões de minha parte que possam pôr em risco ou comprometer privacidade, segurança e liberdade dos titulares dos dados confiados à Universidade Evangélica de Goiás.
                        <br />
                        <br />
                        Respeitarei as normas de segurança dispostas na <span>LGPD</span>, na <span>Política de Privacidade e Proteção de Dados Pessoais (Política de Privacidade de Dados Pessoais)</span>, na <span>Política de Tratamento de Dados Pessoais da UniEvangélica (Política de Tratamento de Dados Pessoais)</span>, e outras impostas por políticas de segurança implantadas na Universidade.
                        <br />
                        <br />
                        Em caso de dúvida, ameaça ou possibilidade de violação aos dados pessoais/dados pessoais sensíveis, deverei comunicar ao Encarregado pelo Tratamento de Dados Pessoais da Universidade.
                    </p>
                    <p>Reiterando a ciência e concordância com todos os itens acima, bem como da responsabilidade exigida com a LGPD, a Política de Privacidade de Dados Pessoais e a Política de Tratamento de Dados Pessoais e Código de Ética Profissional do Psicólogo, firmo o presente.</p>
                    <div className="term-buttons">
                        <button onClick={() => handleTermDecision(false)}>Recusar</button>
                        <button onClick={() => handleTermDecision(true)}>Aceitar</button>
                    </div>
                </div>
            </div>
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity="warning" onClose={handleClose} action="">
                    {typeof message === 'string' ? message : ''}
                </Alert>
            </Snackbar>
        </div>
    );
}
