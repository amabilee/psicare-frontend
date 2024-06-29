import React, { useState, useEffect } from "react";
import { FaRegCalendar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiContactsBookLine } from "react-icons/ri";
import { SlNote } from "react-icons/sl";
import { Link, useLocation } from "react-router-dom";
import logoh from "../../assets/logo-h.svg";
import iconeSair from "../../assets/sair-icone.svg";
import "./style.css";

export default function SideBar() {
    const location = useLocation();
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("");

    useEffect(() => {
        handleItemClick();
    }, []);

    const handleItemClick = (item) => {
        //location fornecido por useLocation do React Router é a localização atual (rota) da aplicação
    
        //abre o menu de cadastro
        if (location.pathname.includes("/secretarios") || 
            location.pathname.includes("/professores") || 
            location.pathname.includes("/alunos") || 
            location.pathname.includes("/pacientes")) {//verifica se o caminho atual é qualquer uma dessas strings
            setIsCadastroOpen(true);// se alguma dessas for verdadeira, abre o menu de cadastro
        }

        //definindo a classa de item-menu-ativo
        if (location.pathname === "/secretarios") {
            setActiveItem("secretarios");
        } else if (location.pathname === "/professores") {
            setActiveItem("professores");
        } else if (location.pathname === "/alunos") {
            setActiveItem("alunos");
        } else if (location.pathname === "/pacientes") {
            setActiveItem("pacientes");
        } else {
            setActiveItem(item);
        }
    }

    const toggleCadastro = () => {
        setIsCadastroOpen(!isCadastroOpen);
    };

    return (
        <div className="body_sidebar">
            <div className="barraLateral">
                <div className="logo-sidebar">
                    <img src={logoh} alt="logo" className="img_logo" id="img_logo" />
                </div>
                <nav className="conteudo-sideBar">
                    <ul>
                        <li className={`item-menu ${location.pathname === "/agenda" ? "item-menu-ativo" : ""}`}>
                            <Link to="/agenda" className="link-nav">
                                <span className="icon"><FaRegCalendar className="icon" /></span>
                                <span className="texto-link">Agenda</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="caixa-cadastro">
                        <ul>
                            <li className="item-menu-cadastro" onClick={toggleCadastro}>
                                <Link to="#" className="link-nav">
                                    <span className="icon"><RiContactsBookLine className="icon" /></span>
                                    <span className="texto-link">Cadastro</span>
                                    <span className="icon-seta">
                                        {isCadastroOpen ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                        {isCadastroOpen && (
                            <ul>
                                <li className={`item-menu ${activeItem === "secretarios" ? "item-menu-ativo" : ""}`}>
                                    <Link to="/secretarios" className="link-nav">
                                        <span className="texto-link-cadastro">Secretários</span>
                                    </Link>
                                </li>
                                <li className={`item-menu ${activeItem === "professores" ? "item-menu-ativo" : ""}`}>
                                    <Link to="/professores" className="link-nav">
                                        <span className="texto-link-cadastro">Professores</span>
                                    </Link>
                                </li>
                                <li className={`item-menu ${activeItem === "alunos" ? "item-menu-ativo" : ""}`}>
                                    <Link to="/alunos" className="link-nav">
                                        <span className="texto-link-cadastro">Alunos</span>
                                    </Link>
                                </li>
                                <li className={`item-menu ${activeItem === "pacientes" ? "item-menu-ativo" : ""}`}>
                                    <Link to="/pacientes" className="link-nav">
                                        <span className="texto-link-cadastro">Pacientes</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <ul>
                        <li className={`item-menu ${location.pathname === "/relatorios" ? "item-menu-ativo" : ""}`}>
                            <Link to="/relatorios" className="link-nav">
                                <span className="icon"><SlNote className="icon" /></span>
                                <span className="texto-link">Relatórios</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="button-sidebar">
                    <Link to="/entrar" className="link-sair">
                        <img src={iconeSair} alt="icone de sair" className="img-sair" />
                        <p>Sair</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
