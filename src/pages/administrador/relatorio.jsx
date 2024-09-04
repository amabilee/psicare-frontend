import React, { useState } from "react";
import { TbReportAnalytics } from "react-icons/tb";
import icon_pesquisa from "../../assets/pesquisa.svg";
import SideBar from "../../components/SideBar/sidebar";


export default function Relatorio(){
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
 
    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value);
    }


    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Relatórios</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro"
                    //  onClick={handleNovoCadastroClick}
                      >
                        <TbReportAnalytics className="icon_cadastro"/>
                        Novo Relatório 
                    </button>
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={handlePesquisar} className="pesquisar" />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div>
                    
                </div>
                {/* <TableSecretario renderFormTable={renderFormTable} pesquisar={pesquisaUsuario}/>
                {isCadastroOpen && (<CadastrarSecretario handleCloseModal={handleCloseModal} renderForm={renderProps}/>)} */}
            </div>
        </>
    )
}