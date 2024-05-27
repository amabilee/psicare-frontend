import React, {useState} from "react";
import { FaRegCalendar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiContactsBookLine } from "react-icons/ri";
import logoh from "../../assets/logo-h.svg";
import { SlNote } from "react-icons/sl";
import "./style.css"

export default function SideBar(){
    const [showCadastro, setShowCadastro] = useState(false);

    const toggleCadastro = () => {
        setShowCadastro(!showCadastro);
    }
    return(
        <>
            <div className="lateral">
                <div className="barraLateral">
                    <div className="conteudo">
                        <div className="usuario">
                            <span>A</span>
                            <p>Olá, Admin</p>
                        </div>
                        <div className="agenda" id="estilo_respiro">
                            <FaRegCalendar className="icon"/>
                            <p>Agenda</p>
                        </div>
                        <div className="caixa-cadastro" onClick={toggleCadastro}>
                            <div className="cadastro" id="estilo_respiro">
                                <RiContactsBookLine className="icon"/>
                                <p>Cadastro</p>
                                {showCadastro ? <FaChevronUp className="icon-seta"/> : <FaChevronDown className="icon-seta"/>}
                            </div>
                            {showCadastro && (
                            <div className="caixa_cadastro">
                                <div className="secretarios" id="estilo_respiro2">
                                    <p>Secretários</p>
                                </div>
                                <div className="alunos" id="estilo_respiro2">
                                    <p>Alunos</p>
                                </div>
                                <div className="professores" id="estilo_respiro2">
                                    <p>Professores</p>
                                </div>
                                <div className="pacientes" id="estilo_respiro2">
                                    <p>Pacientes</p>
                                </div>
                            </div>
                            )}
                        </div>
                        <div className="relatorio" id="estilo_respiro">
                            <SlNote className="icon"/>
                            <p>Relatórios</p>
                        </div>
                    </div>
                </div>
                <div className="header">
                    <img src={logoh} alt="logo" />
                    <button id="button-header">Sair</button>
                </div>
            </div>
        </>
    )
}