import React, {useState} from "react";
import SideBar from "../../components/SideBar/sidebar";
// import TableAluno from "../../components/table/aluno";
import CadastrarPaciente from "../../components/cadastrar/paciente";
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Paciente(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

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
                <h1 className="h1">Pacientes</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                        <IoMdPersonAdd className="icon_cadastro"/>
                        Novo Cadastro 
                    </button>
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={handlePesquisar} className="pesquisar" />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div> 
                </div>
                {/* <TableAluno renderFormTable={renderFormTable} pesquisar={pesquisaUsuario}/> */}
                {isCadastroOpen && (<CadastrarPaciente handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}