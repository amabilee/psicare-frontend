import { useState, useEffect } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import icon_pesquisa from "../../assets/pesquisa.svg";
import filtragem from "../../assets/filtragem.svg";
import SideBar from "../../components/SideBar/sidebar";

import { DatePicker } from 'rsuite';
import Loader from '../../components/loader/index';

import TableRelatorio from "../../components/table/relatorio";
import RelatorioArquivado from "./relatorioArquivado";
import CadastrarRelatorio from '../../components/cadastrar/relatorio'


export default function Relatorio() {
    const [loading, setLoading] = useState(true)
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [renderFormTable, setRenderFormTable] = useState();
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isArquivadosOpen, setIsArquivadosOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);

    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nomeAluno: "",
        nomePaciente: "",
        tipoTratamento: "",
        dataCriacao: ""
    })

    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nomeAluno: "",
        nomePaciente: "",
        tipoTratamento: "",
        dataCriacao: ""
    })

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value.replace(/[^\w\s]/gi, ''));
    }

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const handleFiltrarPesquisa = () => {
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setEnviarFiltragem(filtrarPesquisa)
    };

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
        setIsArquivadosOpen(false)
    };

    const handleArquivados = () => {
        setIsArquivadosOpen(true);
    }

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if (isFiltragemOpen) {
            setIsFiltragemOpen(false)
        }
    }

    useEffect(() => {
        if (isFiltragemOpen) {
            setEnviarFiltragem({
                nomeAluno: "",
                nomePaciente: "",
                tipoTratamento: "",
                dataCriacao: ""
            }), setFiltrarPesquisa({
                nomeAluno: "",
                nomePaciente: "",
                tipoTratamento: "",
                dataCriacao: ""
            });
        }
    }, [isFiltragemOpen]);

    const detectarLoading = (childData) => {
        setLoading(childData);
    }

    useEffect(() => {
        detectarLoading()
    }, [])

    return (
        <>
            <SideBar />
            {!isArquivadosOpen && (
                <div className="body_admin">
                    <h1 className="h1">Relatórios</h1>
                    <div className={(userLevel === '1' || userLevel === '2') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                        {(userLevel === '0' || userLevel === '3') && (
                            <>
                                <button className="button_cadastro" onClick={handleNovoCadastroClick}>
                                    <TbReportAnalytics className="icon_cadastro" />
                                    Novo Relatório
                                </button>

                                <button className="button_arquivados" onClick={handleArquivados} >
                                    Visualizar Arquivados
                                </button>
                            </>
                        )}
                        <div className="container">
                            <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick} />
                            <input type="text" value={pesquisaUsuario} onChange={handlePesquisar} className="pesquisar" placeholder="Escreva aqui para pesquisar..." />
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
                                            <input type="text" id="nome" value={filtrarPesquisa.nomeAluno.replace(/[^\w\s]/gi, '')} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nomeAluno: e.target.value })} />
                                        </>
                                    )}
                                    <label htmlFor="labelEncaminhador">Paciente</label>
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                        value={filtrarPesquisa.nomePaciente.replace(/[^\w\s]/gi, '')}
                                        onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nomePaciente: e.target.value })}
                                    />
                                    <label htmlFor="tratamento">Tipo de tratamento</label>
                                    <select className="tratamento" name="tratamento" id="tratamento" value={filtrarPesquisa.tipoTratamento} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, tipoTratamento: e.target.value })}>
                                        <option value="">Nenhum</option>
                                        <option value="Psicoterapia">Psicoterapia</option>
                                        <option value="Plant">Plantão</option>
                                        <option value="Psicodiagn">Psicodiagnóstico</option>
                                        <option value="Avalia">Avaliação diagnóstica</option>
                                    </select>
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
                        <TableRelatorio renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                    )
                    }


                    {isCadastroOpen && (<CadastrarRelatorio handleCloseModal={handleCloseModal} renderForm={renderProps} />)}
                </div>
            )}
            {isArquivadosOpen && (<RelatorioArquivado handleCloseModal={handleCloseModal} />)}
        </>
    )
}