import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import { api } from "../../services/server";
import TableAluno from "../../components/table/aluno";
import CadastrarAluno from "../../components/cadastrar/aluno";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { IMaskInput } from "react-imask";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { UseAuth } from '../../hooks';

import Loader from '../../components/loader/index';

export default function Aluno() {
    const { signOut } = UseAuth();
    const [loading, setLoading] = useState(true)
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [professoresNome, setProfessoresNome] = useState({ professores: [] });
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        matricula: "",
        periodo: "",
        nomeProfessor: ""
    })
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        matricula: "",
        periodo: "",
        nomeProfessor: ""
    })

    const [userLevel, setUserLevel] = useState(null);

    const [message, setMessage] = useState("");
    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    }, []);
    const { vertical, horizontal, open } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
        buscarProfessores();
    }, []);

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if (isFiltragemOpen) {
            setIsFiltragemOpen(false)
        }
    }

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    // const handlePesquisar = (e) => {
    //     setPesquisaUsuario(e.target.value);
    // }

    const handleFiltrarPesquisa = () => {
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setEnviarFiltragem(filtrarPesquisa)
    };

    useEffect(() => {
        if (isFiltragemOpen) {
            setEnviarFiltragem({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                matricula: "",
                periodo: "",
                nomeProfessor: ""
            }), setFiltrarPesquisa({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                matricula: "",
                periodo: "",
                nomeProfessor: ""
            });
        }
    }, [isFiltragemOpen]);

    const buscarProfessores = async () => {
        const token = localStorage.getItem("user_token")

        try {
            const selectProfessores = await api.get(`/professor`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setProfessoresNome(selectProfessores.data);
        } catch (e) {
            if (e.response.status == 401) {
                signOut()
            } else {
                setState({ ...state, open: true });
                setMessage("Ocorreu um erro ao buscar professores");
            }
        }
    }

    const detectarLoading = (childData) => {
        setLoading(childData);
    }

    useEffect(() => {
        detectarLoading()
    }, [])

    return (
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Alunos</h1>
                <div className={(userLevel === '2' || userLevel === '3') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                    {(userLevel === '0' || userLevel === '1') && (
                        <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                            <IoMdPersonAdd className="icon_cadastro" />
                            Novo Cadastro
                        </button>
                    )}
                    <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick} />
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={(e) => setPesquisaUsuario(e.target.value)} className="pesquisar" placeholder="Escreva aqui para pesquisar..." />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div>
                </div>
                {isFiltragemOpen && (
                    <div className="modal-filtragem" onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            modalFiltragemClick();
                        }
                    }}>
                        <div className="modal-content-filtragem modal-content-filtragem-aluno">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo</label>
                                <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nome: e.target.value })} />
                                <div className="coluna1">
                                    <div className="div-CPF">
                                        <label htmlFor="CPF">CPF</label>
                                        <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={filtrarPesquisa.cpf} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, cpf: e.target.value })} />
                                    </div>
                                    <div className="div-telefone">
                                        <label htmlFor="Telefone">Telefone</label>
                                        <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={filtrarPesquisa.telefone} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, telefone: e.target.value })} />
                                    </div>
                                </div>
                                <label htmlFor="Email">Email</label>
                                <input type="email" name="email" id="email" value={filtrarPesquisa.email} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, email: e.target.value })} />
                                <div className="coluna2">
                                    <div className="div-matricula">
                                        <label htmlFor="matricula">Matrícula</label>
                                        <input type="text" className="matricula" id="matricula" value={filtrarPesquisa.matricula} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, matricula: e.target.value })} />
                                    </div>
                                    <div className="div-periodo">
                                        <label htmlFor="periodo">Período</label>
                                        <select className="periodo" id="periodo" value={filtrarPesquisa.periodo} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, periodo: e.target.value })} required>
                                            <option value="" disabled>Selecione</option>
                                            <option value="1">1°</option>
                                            <option value="2">2°</option>
                                            <option value="3">3°</option>
                                            <option value="4">4°</option>
                                            <option value="5">5°</option>
                                            <option value="6">6°</option>
                                            <option value="7">7°</option>
                                            <option value="8">8°</option>
                                            <option value="9">9°</option>
                                            <option value="10">10°</option>
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="professorResponsavel">Professor</label>
                                <select className="professorNome" id="professorNome"
                                    value={filtrarPesquisa.nomeProfessor}
                                    onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nomeProfessor: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione uma opção</option>
                                    {professoresNome.professores.map(professor => (
                                        <option key={professor.nome} value={professor.nome}>
                                            {professor.nome}
                                        </option>
                                    ))}
                                </select>
                                <button className="button-filtro" id="filtro" onClick={handleFiltrarPesquisa}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
                {loading ? (
                    <div className="loading-container">
                        <Loader />
                    </div>
                ) : (
                    <TableAluno renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                )}
                {isCadastroOpen && (<CadastrarAluno handleCloseModal={handleCloseModal} renderForm={renderProps} />)}
            </div>
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity="error" onClose={handleClose} action="">
                    {typeof message === 'string' ? message : ''}
                </Alert>

            </Snackbar>
        </>
    )
}