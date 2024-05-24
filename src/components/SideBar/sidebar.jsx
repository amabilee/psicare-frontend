import React from "react";
import { FaRegCalendar } from "react-icons/fa";
import { RiContactsBookLine } from "react-icons/ri";
import { SlNote } from "react-icons/sl";
import "./style.css"

export default function SideBar(){
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
                        <div className="cadastro" id="estilo_respiro">
                            <RiContactsBookLine className="icon"/>
                            <p>Cadastro</p>
                            {/* <div className="caixa_cadastro">
                                <p>Secretário</p>
                                <p>Alunos</p>
                                <p>Professores</p>
                                <p>Pacientes</p>
                            </div> */}
                        </div>
                        <div className="relatorio" id="estilo_respiro">
                            <SlNote className="icon"/>
                            <p>Relatórios</p>
                        </div>
                    </div>
                </div>
                <div className="header">
                    <img src="./logo-icon.png" alt="logo" />
                    <button>Sair</button>
                </div>
            </div>
        </>
    )
}