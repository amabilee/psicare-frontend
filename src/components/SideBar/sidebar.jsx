import React, {useState} from "react";
import { FaRegCalendar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiContactsBookLine } from "react-icons/ri";
import logoh from "../../assets/logo-h.svg";
import iconeSair from "../../assets/sair-icone.svg";
import { SlNote } from "react-icons/sl";
import "./style.css"

export default function SideBar(){
    const [showCadastro, setShowCadastro] = useState(false);

    const toggleCadastro = () => {
        setShowCadastro(!showCadastro);
    }
    
    return(
        <div className="body_sidebar">
            <div className="lateral">
                <div className="barraLateral">
                    <div className="conteudo-sideBar">
                        <div className="usuario">
                            <img src={logoh} alt="logo" className="img_logo" id="img_logo" />
                        </div>
                        <ul className="estilo_respiro" id="estilo_respiro">
                            <FaRegCalendar className="icon"/>
                            <li>Agenda</li>
                        </ul>
                        <div className="caixa-cadastro" onClick={toggleCadastro}>
                            <ul className="estilo_respiro" id="estilo_respiro">
                                <RiContactsBookLine className="icon"/>
                                <li>Cadastros</li>
                                {showCadastro ? <FaChevronUp className="icon-seta"/> : <FaChevronDown className="icon-seta"/>}
                            </ul>
                            {showCadastro && (
                            <ul className="caixa_cadastro">
                                <ul className="estilo_respiro2" id="estilo_respiro2">
                                    <li>Secretários</li>
                                </ul>
                                <ul className="estilo_respiro2" id="estilo_respiro2">
                                    <li>Alunos</li>
                                </ul>
                                <ul className="estilo_respiro2" id="estilo_respiro2">
                                    <li>Professores</li>
                                </ul>
                                <ul className="estilo_respiro2" id="estilo_respiro2">
                                    <li>Pacientes</li>
                                </ul>
                            </ul>
                            )}
                        </div>
                        <ul className="estilo_respiro" id="estilo_respiro">
                            <SlNote className="icon"/>
                            <li>Relatórios</li>
                        </ul>
                        
                    </div>
                    <div className="button-sidebar">
                        <img src={iconeSair} alt="icone de sair" className="img-sair" />
                        <p>Sair</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
