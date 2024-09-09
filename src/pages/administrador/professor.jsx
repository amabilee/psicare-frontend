import React, {useState, useEffect} from "react";
import SideBar from "../../components/SideBar/sidebar";
import TableProfessor from "../../components/table/professor";
import CadastrarProfessor from "../../components/cadastrar/professor";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import {IMaskInput} from "react-imask";

import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";


export default function Professor(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        disciplina: ""
    })
    const [filtrarPesquisaTemp, setFiltrarPesquisaTemp] = useState({
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
    }

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value);
    }

    const handleFiltrarPesquisa = () => {   
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setFiltrarPesquisa(filtrarPesquisaTemp)
    };

    useEffect(() => {
        if (isFiltragemOpen) {
            setFiltrarPesquisa({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                disciplina: ""
            }), setFiltrarPesquisaTemp({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                disciplina: ""
            });
        }
    }, [isFiltragemOpen]);

    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Professores</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                        <IoMdPersonAdd className="icon_cadastro"/>
                        Novo Cadastro 
                    </button>
                    <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick}/>
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={handlePesquisar} className="pesquisar" />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div> 
                </div>
                
                {isFiltragemOpen && (
                    <div className="modal-filtragem">
                        <div className="modal-content-filtragem">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo*</label>
                                <input type="text" id="nome" value={filtrarPesquisaTemp.nome} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, nome: e.target.value})}/>
                                <div className="coluna1">
                                    <div className="div-CPF">
                                        <label htmlFor="CPF">CPF*</label>
                                        <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={filtrarPesquisaTemp.cpf} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, cpf: e.target.value})}/>
                                    </div>
                                    <div className="div-telefone">
                                        <label htmlFor="Telefone">Telefone*</label>
                                        <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={filtrarPesquisaTemp.telefone} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, telefone: e.target.value})}/>
                                    </div>
                                </div>
                                <label htmlFor="Email">Email*</label>
                                <input type="email" name="email" id="email" value={filtrarPesquisaTemp.email} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, email: e.target.value})}/>
                                <label htmlFor="disciplina">Disciplina*</label>
                                <input type="text" className="disciplina" value={filtrarPesquisaTemp.disciplina} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, disciplina: e.target.value})}/>
                                <button className="button-filtro" id="filtro" onClick={handleFiltrarPesquisa}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
                <TableProfessor renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={filtrarPesquisa}/>
                {isCadastroOpen && (<CadastrarProfessor handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}