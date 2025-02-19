import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import TablePaciente from "../../components/table/paciente";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import CadastrarPaciente from "../../components/cadastrar/paciente";
import PacienteArquivado from "./pacienteArquivado";
import filtragem from "../../assets/filtragem.svg";
import { IMaskInput } from "react-imask";
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

import Loader from '../../components/loader/index';

export default function Paciente() {
    const [loading, setLoading] = useState(true)
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isArquivadosOpen, setIsArquivadosOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        encaminhador: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        tipoDeTratamento: "",
        sexo: ""
    })
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        encaminhador: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        tipoDeTratamento: "",
        sexo: ""
    })

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

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

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value.replace(/[^\w\s]/gi, ''));
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
                dataNascimento: "",
                encaminhador: "",
                dataInicioTratamento: "",
                dataTerminoTratamento: "",
                tipoDeTratamento: "",
                sexo: ""
            }), setFiltrarPesquisa({
                nome: "",
                cpf: "",
                dataNascimento: "",
                encaminhador: "",
                dataInicioTratamento: "",
                dataTerminoTratamento: "",
                tipoDeTratamento: "",
                sexo: ""
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
                    <h1 className="h1">Pacientes</h1>
                    <div className={(userLevel === '2' || userLevel === '3') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                        {(userLevel === '0' || userLevel === '1') && (
                            <>
                                <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                                    <IoMdPersonAdd className="icon_cadastro" />
                                    Novo Cadastro
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
                            <div className="modal-content-filtragem modal-content-filtragem-paciente">
                                <h1>Filtrar por</h1>
                                <hr />
                                <div className="formulario">
                                    <label htmlFor="Nome">Nome Completo</label>
                                    <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nome: e.target.value.replace(/[^\w\s]/gi, '') })} />
                                    <div className="coluna1">
                                        <div className="div-CPF">
                                            <label htmlFor="CPF">CPF</label>
                                            <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={filtrarPesquisa.cpf} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, cpf: e.target.value })} />
                                        </div>
                                        <div className="div-dataNascimento">
                                            <label htmlFor="data-nascimento">Data de nascimento</label>
                                            <DatePicker
                                                className="data-nascimento"
                                                format="dd/MM/yyyy"
                                                placeholder="dd/mm/aaaa"
                                                onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, dataNascimento: e })}
                                            />
                                        </div>
                                    </div>
                                    {userLevel !== '3' && (
                                        <>
                                            <label htmlFor="labelEncaminhador">Nome do Encaminhador</label>
                                            <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                                value={filtrarPesquisa.encaminhador}
                                                onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, encaminhador: e.target.value.replace(/[^\w\s]/gi, '') })}
                                            />
                                        </>
                                    )}
                                    <div className="coluna2">
                                        <div className="div-inicioTratamento">
                                            <label htmlFor="inicio-tratamento">Início do Tratamento</label>
                                            <DatePicker
                                                className="inicio-tratamento"
                                                format="dd/MM/yyyy"
                                                placeholder="dd/mm/aaaa"
                                                onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, dataInicioTratamento: e })}
                                            />
                                        </div>
                                        <div className="div-terminoTratamento">
                                            <label htmlFor="termino-tratamento">Término do tratamento</label>
                                            <DatePicker
                                                className="termino-tratamento"
                                                format="dd/MM/yyyy"
                                                placeholder="dd/mm/aaaa"
                                                onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, dataTerminoTratamento: e })}
                                            />
                                        </div>
                                    </div>
                                    <label htmlFor="tratamento">Tipo de tratamento</label>
                                    <select className="tratamento" name="tratamento" id="tratamento" value={filtrarPesquisa.tipoDeTratamento} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, tipoDeTratamento: e.target.value })}>
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Psicoterapia">Psicoterapia</option>
                                        <option value="Plantão">Plantão</option>
                                        <option value="Psicodiagnóstico">Psicodiagnóstico</option>
                                        <option value="Avaliação Diagnóstica">Avaliação diagnóstica</option>
                                    </select>
                                    <label htmlFor="sexo">Sexo</label>
                                    <select className="sexo" name="sexo" id="sexo"
                                        value={filtrarPesquisa.sexo} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, sexo: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="prefiro nao informar">Prefiro não informar</option>
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
                        <TablePaciente renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                    )}
                    {isCadastroOpen && (<CadastrarPaciente handleCloseModal={handleCloseModal} renderForm={renderProps} />)}

                </div>
            )}
            {isArquivadosOpen && (<PacienteArquivado handleCloseModal={handleCloseModal} />)}
        </>
    )
}


// alunoUnieva
// : 
// true
// assinatura
// : 
// "/relatorio/download/6702baa84a978ae3043c8531"
// ativoRelatorio
// : 
// true
// conteudo
// : 
// "teste pdf"
// dataCriacao
// : 
// "2024-10-06T16:28:24.945Z"
// dataInicioTratamento
// : 
// "2024-08-22T00:00:00.000Z"
// dataNascimentoPaciente
// : 
// "2005-08-19T00:00:00.000Z"
// dataTerminoTratamento
// : 
// "2024-08-28T00:00:00.000Z"
// funcionarioUnieva
// : 
// false
// id_aluno
// : 
// "66c32d2c146ac2115eb54dc6"
// id_paciente
// : 
// "66c5fd6d489d14c42982a6fa"
// nomeAluno
// : 
// "maria carla"
// nomePaciente
// : 
// "Gabriela Mendes"
// prontuario
// : 
// "/relatorio/download/6702baa84a978ae3043c8530"
// tipoTratamento
// : 
// "psicodiagnostico"
// ultimaAtualizacao
// : 
// "2024-10-06T16:28:24.945Z"
// __v
// : 
// 0
// _id
// : 
// "6702baa84a978ae3043c8536"