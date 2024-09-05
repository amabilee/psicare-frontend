import React, {useState} from "react";
import SideBar from "../../components/SideBar/sidebar";
import TableProfessor from "../../components/table/professor";
import CadastrarProfessor from "../../components/cadastrar/professor";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";


export default function Professor(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
    }

    const modalFiltragemClose = () => {
        setIsFiltragemOpen(false);
    }

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value);
    }
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
                <TableProfessor renderFormTable={renderFormTable} pesquisar={pesquisaUsuario}/>
                {isCadastroOpen && (<CadastrarProfessor handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
                {isFiltragemOpen && (
                    <div className="modal-filtragem">
                        <div className="modal-content-filtragem">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo*</label>
                                <input type="text" id="nome"  />
                                <div className="coluna1">
                                    <div className="div-CPF">
                                        <label htmlFor="CPF">CPF*</label>
                                        <input type="text" className="CPF" id="CPF"  />
                                    </div>
                                    <div className="div-telefone">
                                        <label htmlFor="Telefone">Telefone*</label>
                                        <input type="text" className="telefone" id="telefone" />
                                    </div>
                                </div>
                                <label htmlFor="Email">Email*</label>
                                <input type="email" name="email" id="email" />
                                <label htmlFor="disciplina">Disciplina*</label>
                                <input type="text" className="disciplina"/>
                                <button className="button-filtro" id="filtro" onClick={modalFiltragemClose}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}