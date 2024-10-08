import React, { useState, useEffect } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import icon_pesquisa from "../../assets/pesquisa.svg";
import filtragem from "../../assets/filtragem.svg";
import SideBar from "../../components/SideBar/sidebar";

import { IMaskInput } from "react-imask";
import { DatePicker } from 'rsuite';


export default function Relatorio() {
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isArquivadosOpen, setIsArquivadosOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);

    const [enviarFiltragem, setEnviarFiltragem] = useState({
        aluno: "",
        paciente: "",
        tipoDeTratamento: "",
        dataCriacao: "",
        encaminhador: ""
    })

    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        aluno: "",
        paciente: "",
        tipoDeTratamento: "",
        dataCriacao: "",
        encaminhador: ""
    })

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value);
    }

    const handleFiltrarPesquisa = () => {
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setEnviarFiltragem(filtrarPesquisa)
        setFiltrarPesquisa({
            aluno: "",
            paciente: "",
            tipoDeTratamento: "",
            dataCriacao: "",
            encaminhador: ""
        })
        console.log(filtrarPesquisa)
    };

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleArquivados = () => {
        setIsArquivadosOpen(true);
    }

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if (isFiltragemOpen) {
            setIsFiltragemOpen(false)
            setFiltrarPesquisa({
                aluno: "",
                paciente: "",
                tipoDeTratamento: "",
                dataCriacao: "",
                encaminhador: ""
            })
        }
    }


    return (
        <>
            <SideBar />
            {!isArquivadosOpen && (
                <div className="body_admin">
                    <h1 className="h1">Relatórios</h1>
                    <div className={(userLevel === '2' || userLevel === '3') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                        {(userLevel === '0' || userLevel === '1') && (
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
                        <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick} />
                        <div className="container">
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
                                    <label htmlFor="Nome">Aluno</label>
                                    <input type="text" id="nome" value={filtrarPesquisa.aluno} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, aluno: e.target.value })} />
                                    <label htmlFor="labelEncaminhador">Paciente</label>
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                        value={filtrarPesquisa.paciente}
                                        onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, paciente: e.target.value })}
                                    />
                                    <label htmlFor="tratamento">Tipo de tratamento</label>
                                    <select className="tratamento" name="tratamento" id="tratamento" value={filtrarPesquisa.tipoDeTratamento} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, tipoDeTratamento: e.target.value })}>
                                        <option value="">Nenhum</option>
                                        <option value="psicoterapia">Psicoterapia</option>
                                        <option value="plantao">Plantão</option>
                                        <option value="psicodiagnostico">Psicodiagnóstico</option>
                                        <option value="avaliacao diagnostica">Avaliação diagnóstica</option>
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
                    {/* <TableSecretario renderFormTable={renderFormTable} pesquisar={pesquisaUsuario}/>
                {isCadastroOpen && (<CadastrarSecretario handleCloseModal={handleCloseModal} renderForm={renderProps}/>)} */}
                </div>
            )}
        </>
    )
}