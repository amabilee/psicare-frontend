import { useState, useEffect } from "react";
import { FaRegCalendar, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiContactsBookLine } from "react-icons/ri";
import { SlNote } from "react-icons/sl";
import { BsGear } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import logoh from "../../assets/logo-h.svg";
import iconeSair from "../../assets/sair-icone.svg";
import { UseAuth } from '../../hooks';
import "./style.css";

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = UseAuth();

    const [isCadastroOpen, setIsCadastroOpen] = useState(() => {
        return location.pathname.includes("/secretarios") ||
            location.pathname.includes("/professores") ||
            location.pathname.includes("/alunos") ||
            location.pathname.includes("/pacientes");
    });
    const [itemAtivo, setItemAtivo] = useState(location.pathname);

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

    const handleItemClick = (path) => {
        navigate(path);

        if (path.includes("/secretarios") ||
            path.includes("/professores") ||
            path.includes("/alunos") ||
            path.includes("/pacientes")) {
            setIsCadastroOpen(true);
        }

        setItemAtivo(path);
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
                    {(userLevel === '0' || userLevel === '1' || userLevel === '3') && (
                        <ul>
                            <li className={`item-menu ${itemAtivo === "/agenda" ? "item-menu-ativo" : ""}`}>
                                <button className="link-nav" onClick={() => handleItemClick('/agenda')}>
                                    <span className="icon"><FaRegCalendar className="icon" /></span>
                                    <span className="texto-link">Agenda</span>
                                </button>
                            </li>
                        </ul>
                    )}
                    <div className="caixa-cadastro">
                        {(userLevel === '0' || userLevel === '1' || userLevel === '2' || userLevel === '3') && (
                            <ul>
                                <li className="item-menu-cadastro" onClick={toggleCadastro}>
                                    <button className="cadastro">
                                        <span className="icon"><RiContactsBookLine className="icon" /></span>
                                        <span className="texto-button">Pessoas</span>
                                        <span className="icon-seta">
                                            {isCadastroOpen ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        )}
                        {isCadastroOpen && (
                            <ul className="item-cadastro">
                                {(userLevel === '0') && (
                                    <li className={`item-menu ${itemAtivo === "/secretarios" ? "item-menu-ativo" : ""}`}>
                                        <button className="link-nav" onClick={() => handleItemClick('/secretarios')}>
                                            <span className="texto-link-cadastro">Secretários</span>
                                        </button>
                                    </li>
                                )}
                                {(userLevel === '0') && (
                                    <li className={`item-menu ${itemAtivo === "/professores" ? "item-menu-ativo" : ""}`}>
                                        <button className="link-nav" onClick={() => handleItemClick('/professores')}>
                                            <span className="texto-link-cadastro">Professores</span>
                                        </button>
                                    </li>
                                )}
                                {(userLevel != '3') && (
                                    <li className={`item-menu ${itemAtivo === "/alunos" ? "item-menu-ativo" : ""}`}>
                                        <button className="link-nav" onClick={() => handleItemClick('/alunos')}>
                                            <span className="texto-link-cadastro">Alunos</span>
                                        </button>
                                    </li>
                                )}
                                {(userLevel === '0' || userLevel === '1' || userLevel === '2' || userLevel === '3') && (
                                    <li className={`item-menu ${itemAtivo === "/pacientes" ? "item-menu-ativo" : ""}`}>
                                        <button className="link-nav" onClick={() => handleItemClick('/pacientes')}>
                                            <span className="texto-link-cadastro">Pacientes</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                    <ul>
                        {(userLevel === '0' || userLevel === '2' || userLevel === '3') && (
                            <li className={`item-menu ${itemAtivo === "/relatorios" ? "item-menu-ativo" : ""}`}>
                                <button className="link-nav" onClick={() => handleItemClick('/relatorios')}>
                                    <span className="icon"><SlNote className="icon" /></span>
                                    <span className="texto-link">Relatórios</span>
                                </button>
                            </li>
                        )}
                    </ul>
                    <ul>
                        {userLevel === '0' && (
                            <li className={`item-menu ${itemAtivo === "/gerencia" ? "item-menu-ativo" : ""}`}>
                                <button className="link-nav" onClick={() => handleItemClick('/gerencia')}>
                                    <span className="icon"><BsGear className="icon" /></span>
                                    <span className="texto-link">Gerência</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
                <div className="button-sidebar">
                    <button className="button-sair" onClick={() => {
                        signOut();
                        navigate('/entrar');
                    }}>
                        <img src={iconeSair} alt="icone de sair" className="img-sair" />
                        <p>Sair</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
