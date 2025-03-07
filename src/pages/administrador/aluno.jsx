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
import Select from 'react-select'

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
            } else if (!e.response.data.message.incluide("Acesso negado")) {
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

    const periodoOptions = [
        { value: "1", label: "1°" },
        { value: "2", label: "2°" },
        { value: "3", label: "3°" },
        { value: "4", label: "4°" },
        { value: "5", label: "5°" },
        { value: "6", label: "6°" },
        { value: "7", label: "7°" },
        { value: "8", label: "8°" },
        { value: "9", label: "9°" },
        { value: "10", label: "10°" }
    ]

    const professorOptions = professoresNome.professores.map((professor) => ({
        value: professor._id,
        label: professor.nome,
    }));

    return (
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Alunos</h1>
                <div className={userLevel != '0' ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                    {userLevel === '0' && (
                        <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                            <IoMdPersonAdd className="icon_cadastro" />
                            Novo Cadastro
                        </button>
                    )}
                    <div className="container">
                        <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick} />
                        <input type="text" value={pesquisaUsuario} onChange={(e) => setPesquisaUsuario(e.target.value.replace(/[^\w\s]/gi, ''))} className="pesquisar" placeholder="Escreva aqui para pesquisar..." />
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
                                <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nome: e.target.value.replace(/[^\w\s]/gi, '') })} maxLength={50} />
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
                                <input type="email" name="email" id="email" value={filtrarPesquisa.email} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, email: e.target.value })} maxLength={50}/>
                                <div className="coluna2">
                                    <div className="div-matricula">
                                        <label htmlFor="matricula">Matrícula</label>
                                        <input type="text" className="matricula" id="matricula" value={filtrarPesquisa.matricula} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, matricula: e.target.value })} maxLength={10}/>
                                    </div>
                                    <div className="div-periodo">
                                        <label htmlFor="periodo">Período</label>
                                        <Select
                                            className="periodo-select"
                                            options={periodoOptions}
                                            value={periodoOptions.find(option => option.value === filtrarPesquisa.periodo) || null}
                                            onChange={(selectedOption) => {
                                                setFiltrarPesquisa({ ...filtrarPesquisa, periodo: selectedOption.value });
                                            }}
                                            placeholder="Selecione"
                                            menuPlacement="auto"
                                        />
                                    </div>
                                </div>
                                {userLevel === '0' && (
                                    <>
                                        <label htmlFor="professorResponsavel">Professor</label>
                                        <Select
                                            className="paciente-select"
                                            options={professorOptions}
                                            value={professorOptions.find(option => option.value === filtrarPesquisa.nomeProfessor) || null}
                                            onChange={(selectedOption) => {
                                                setFiltrarPesquisa({ ...filtrarPesquisa, nomeProfessor: selectedOption.value });
                                            }}
                                            placeholder="Selecione uma opção"
                                            menuPlacement="auto"
                                        />
                                    </>
                                )}
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