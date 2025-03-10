import { useState, useEffect } from "react";
import icon_pesquisa from "../../assets/pesquisa.svg";
import filtragem from "../../assets/filtragem.svg";
import SideBar from "../../components/SideBar/sidebar";

import { DatePicker } from 'rsuite';
import Loader from '../../components/loader/index';

import TableRelatorioArquivado from "../../components/table/relatorioArquivado";
import Select from 'react-select'

export default function RelatorioArquivado({ handleCloseModal }) {
    const [loading, setLoading] = useState(true)
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [renderFormTable, setRenderFormTable] = useState();
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);

    const [enviarFiltragem, setEnviarFiltragem] = useState({
        aluno: "",
        paciente: "",
        tipoTratamento: "",
        dataCriacao: "",
        encaminhador: ""
    })

    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        aluno: "",
        paciente: "",
        tipoTratamento: "",
        dataCriacao: "",
        encaminhador: ""
    })

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value.replace(/[^\w\s]/gi, ''));
    }

    const handleFiltrarPesquisa = () => {
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setEnviarFiltragem(filtrarPesquisa)
    };

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if (isFiltragemOpen) {
            setIsFiltragemOpen(false)
        }
    }

    useEffect(() => {
        if (isFiltragemOpen) {
            setEnviarFiltragem({
                aluno: "",
                paciente: "",
                tipoTratamento: "",
                dataCriacao: "",
                encaminhador: ""
            }), setFiltrarPesquisa({
                aluno: "",
                paciente: "",
                tipoTratamento: "",
                dataCriacao: "",
                encaminhador: ""
            });
        }
    }, [isFiltragemOpen]);

    const detectarLoading = (childData) => {
        setLoading(childData);
    }

    useEffect(() => {
        detectarLoading()
    }, [])

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

    const tratamentoOptions = [
        { value: "Psicoterapia", label: "Psicoterapia" },
        { value: "Plantão", label: "Plantão" },
        { value: "Psicodiagnóstico", label: "Psicodiagnóstico" },
        { value: "Avaliação Diagnóstica", label: "Avaliação diagnóstica" }
    ]

    return (
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Relatórios</h1>
                <div className="barra_pesquisa">
                    <button className="button_ativos"
                        onClick={handleCloseModal}
                    >
                        Visualizar Ativos
                    </button>
                    <div className="container">
                        <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick} />
                        <input type="text" value={pesquisaUsuario} onChange={(e) => handlePesquisar(e)} className="pesquisar" placeholder="Escreva aqui para pesquisar..." />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div>
                </div>
                {isFiltragemOpen && (
                    <div className="modal-filtragem" onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            modalFiltragemClick();
                        }
                    }}>
                        <div className="modal-content-filtragem modal-content-filtragem-relatorio">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                {userLevel !== '3' && (
                                    <>
                                        <label htmlFor="Nome">Aluno</label>
                                        <input type="text" id="nome" value={filtrarPesquisa.aluno} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, aluno: e.target.value.replace(/[^\p{L}\s]/gu, '')})} maxLength={50} />
                                    </>
                                )}
                                <label htmlFor="labelEncaminhador">Paciente</label>
                                <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                    value={filtrarPesquisa.paciente}
                                    onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, paciente: e.target.value.replace(/[^\p{L}\s]/gu, '')})}
                                    maxLength={50}
                                />
                                <label htmlFor="tratamento">Tipo de tratamento</label>
                                <Select
                                    className="tratamento-select"
                                    options={tratamentoOptions}
                                    value={tratamentoOptions.find(option => option.value === filtrarPesquisa.tipoTratamento) || null}
                                    onChange={(selectedOption) => {
                                        setFiltrarPesquisa({ ...filtrarPesquisa, tipoTratamento: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="top"
                                />

                                <div className="div-dataNascimento">
                                    <label htmlFor="data-nascimento">Data de criação</label>
                                    <DatePicker
                                        className="data-nascimento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, dataCriacao: e })}
                                    />
                                </div>

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
                    <TableRelatorioArquivado renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                )
                }


                {/* {isCadastroOpen && (<CadastrarSecretario handleCloseModal={handleCloseModal} renderForm={renderProps}/>)} */}
            </div>
        </>
    )
}