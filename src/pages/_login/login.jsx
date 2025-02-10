import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UseAuth } from "../../hooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

export default function Login() {
    const { signIn, error } = UseAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [message, setMessage] = useState("");
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const sucesso = await signIn(email, senha);
            if (sucesso) {
                const userLevel = localStorage.getItem('user_level');
                const firstAccessiblePage = getFirstAccessiblePage(userLevel);
                navigate(firstAccessiblePage);
                return;
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
                        navigate(firstAccessiblePage);
                        return;
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

    return (
        <div className="body">
            <div className="box">
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
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2500}
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
