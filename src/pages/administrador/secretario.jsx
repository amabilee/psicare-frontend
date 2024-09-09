import React, {useState, useEffect} from "react";
import SideBar from "../../components/SideBar/sidebar";
import TableSecretario from "../../components/table/secretario";
import CadastrarSecretario from "../../components/cadastrar/secretario";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import {IMaskInput} from "react-imask";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Secretario(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        turno: ""
    }
    )
    const [filtrarPesquisaTemp, setFiltrarPesquisaTemp] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        turno: ""
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
        setRenderFormTable(codigo)
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
                turno: ""
            }), setFiltrarPesquisaTemp({
                nome: "",
                cpf: "",
                telefone: "",
                email: "",
                turno: ""
            });
        }
    }, [isFiltragemOpen]);


    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Secretários</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                        <IoMdPersonAdd className="icon_cadastro"/>
                        Novo Cadastro 
                    </button>
                    
                    <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick}/>
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={(e) => setPesquisaUsuario(e.target.value)} className="pesquisar" />
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
                                <label htmlFor="turno">Turno*</label>
                                <select className="turno" id="turno" value={filtrarPesquisaTemp.turno} onChange={(e) => setFiltrarPesquisaTemp({...filtrarPesquisaTemp, turno: e.target.value})}>
                                    <option value="" disabled>Selecione</option>
                                    <option value="matutino">Matutino</option>
                                    <option value="vespertino">Vespertino</option>
                                    <option value="noturno">Noturno</option>
                                </select>
                                <button className="button-filtro" id="filtro" onClick={handleFiltrarPesquisa}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
                <TableSecretario renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={filtrarPesquisa}/>
                {isCadastroOpen && (<CadastrarSecretario handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}   