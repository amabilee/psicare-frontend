import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import TableProfessor from "../../components/table/professor";
import CadastrarProfessor from "../../components/cadastrar/professor";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { IMaskInput } from "react-imask";

import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";
import Loader from '../../components/loader/index';

export default function Professor() {
    const [loading, setLoading] = useState(true)
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        disciplina: ""
    })
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        disciplina: ""
    })

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

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
                telefone: "",
                email: "",
                disciplina: ""
            }), setFiltrarPesquisa({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                disciplina: ""
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
            <div className="body_admin">
                <h1 className="h1">Professores</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                        <IoMdPersonAdd className="icon_cadastro" />
                        Novo Cadastro
                    </button>
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
                        <div className="modal-content-filtragem">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo</label>
                                <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, nome: e.target.value.replace(/[^\p{L}\s]/gu, '')})} maxLength={50}/>
                                <div className="coluna1">
                                    <div className="div-CPF">
                                        <label htmlFor="CPF">CPF</label>
                                        <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={filtrarPesquisa.cpf} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, cpf: e.target.value })} />
                                    </div>
                                    <div className="div-telefone">
                                        <label htmlFor="Telefone">Telefone</label>
                                        <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={filtrarPesquisa.telefone} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, telefone: e.target.value })} />
                                    </div>
                                </div>
                                <label htmlFor="Email">Email</label>
                                <input type="email" name="email" id="email" value={filtrarPesquisa.email} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, email: e.target.value })} maxLength={50}/>
                                <label htmlFor="disciplina">Disciplina</label>
                                <input type="text" className="disciplina" value={filtrarPesquisa.disciplina} onChange={(e) => setFiltrarPesquisa({ ...filtrarPesquisa, disciplina: e.target.value.replace(/[^\p{L}\s]/gu, '')})} maxLength={50}/>
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
                    < TableProfessor renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem} loadingStatus={detectarLoading} />
                )}
                {isCadastroOpen && (<CadastrarProfessor handleCloseModal={handleCloseModal} renderForm={renderProps} />)}
            </div>
        </>
    )
}