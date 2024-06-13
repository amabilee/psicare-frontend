import React, {useState} from "react";
import SideBar from "../../components/SideBar/sidebar";
import Table from "../../components/table/table";
import Cadastrar from "../../components/cadastrar/secretario"
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Secretario(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }


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
                    <div className="container">
                        <input type="text" name="pesquisar" id="pesquisar" className="pesquisar" />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div>
                    
                </div>
                <Table renderFormTable={renderFormTable}/>
                {isCadastroOpen && (<Cadastrar handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}   