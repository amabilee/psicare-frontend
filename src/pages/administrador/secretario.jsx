import React from "react";
import SideBar from "../../components/SideBar/sidebar";
import Table from "../../components/table/table";
import novoCadastro from "../../assets/novo_cadastro.svg";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Secretario(){
    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1>Secretários</h1>
                <div className="barra_pesquisa">
                    <button id="button_cadastro">
                        <img src={novoCadastro} alt="img_cadastro" id="img_cadastro" />
                        Novo Cadastro 
                    </button>
                    <input type="text" name="pesquisar" id="pesquisar" /><img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" />
                </div>
                <Table />
            </div>
        </>
    )
}