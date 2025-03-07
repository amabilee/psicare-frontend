import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import TablePacienteArquivado from "../../components/table/pacienteArquivado";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import filtragem from "../../assets/filtragem.svg";
import { IMaskInput } from "react-imask";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

import Loader from '../../components/loader/index';
import Select from 'react-select'

export default function PacienteArquivado({ handleCloseModal }) {
    const [loading, setLoading] = useState(true)
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

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if (isFiltragemOpen) {
            setIsFiltragemOpen(false)
        }
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

    const sexOptions = [
        { value: "Masculino", label: "Masculino" },
        { value: "Feminino", label: "Feminino" },
        { value: "prefiro nao informar", label: "Prefiro não informar" },
    ]

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
                <h1 className="h1">Pacientes</h1>
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
                        <div className="modal-content-filtragem modal-content-filtragem-paciente">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo</label>
                                <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nome: e.target.value })} maxLength={50} />
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
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador</label>
                                <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                    value={filtrarPesquisa.encaminhador}
                                    onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, encaminhador: e.target.value })}
                                    maxLength={50}
                                />
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
                                <Select
                                    className="paciente-select"
                                    options={tratamentoOptions}
                                    value={tratamentoOptions.find(option => option.value === filtrarPesquisa.tipoDeTratamento) || null}
                                    onChange={(selectedOption) => {
                                        setFiltrarPesquisa({ ...filtrarPesquisa, tipoDeTratamento: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                                <label htmlFor="sexo">Sexo</label>
                                <Select
                                    className="paciente-select"
                                    options={sexOptions}
                                    value={sexOptions.find(option => option.value === filtrarPesquisa.sexo) || null}
                                    onChange={(selectedOption) => {
                                        setFiltrarPesquisa({ ...filtrarPesquisa, sexo: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />

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
                    <TablePacienteArquivado renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                )}
            </div>
        </>
    )
}