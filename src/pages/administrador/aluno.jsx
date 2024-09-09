import React, {useState, useEffect} from "react";
import SideBar from "../../components/SideBar/sidebar";
import TableAluno from "../../components/table/aluno";
import CadastrarAluno from "../../components/cadastrar/aluno";
import filtragem from "../../assets/filtragem.svg";
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Aluno(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [professoresNome, setProfessoresNome] = useState({professores: []});
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        matricula: "",
        periodo: "",
        professoresNome: ""
    })
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        matricula: "",
        periodo: "",
        professoresNome: ""
    })

    useEffect(() => {
        buscarProfessores();
      }, []);

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

    // const handlePesquisar = (e) => {
    //     setPesquisaUsuario(e.target.value);
    // }

    const buscarProfessores = async() => {
        const token = localStorage.getItem("user_token")
  
        try {
            const selectProfessores = await api.get(`/professor`, {
              headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
              }
            });
            setProfessoresNome(selectProfessores.data);
        } catch (e) {
            console.log("Erro ao buscar professores: ", e)
        }
    }

    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Alunos</h1>
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
                                <div className="coluna2">
                                    <div className="div-matricula">
                                        <label htmlFor="matricula">Matrícula*</label>
                                        <input type="text" className="matricula" id="matricula"/>
                                    </div>
                                    <div className="div-periodo">
                                        <label htmlFor="periodo">Período*</label>
                                        <select className="periodo" id="periodo" required>
                                            <option value="#" disabled>Selecione uma opção</option>
                                            <option value="1°">1°</option>
                                            <option value="2°">2°</option>
                                            <option value="3°">3°</option>
                                            <option value="4°">4°</option>
                                            <option value="5°">5°</option>
                                            <option value="6°">6°</option>
                                            <option value="7°">7°</option>
                                            <option value="8°">8°</option>
                                            <option value="9°">9°</option>
                                            <option value="10°">10°</option>
                                        </select>
                                    </div>
                                </div>
                                <label htmlFor="professorResponsavel">Professor*</label>
                                    <select className="professorNome" id="professorNome" 
                                    value={filtrarPesquisa.professorId || "0"}
                                    onChange={(e) =>  id_professor(e)}
                                    required
                                    >
                                        <option value="0" disabled>Selecione uma opção</option>
                                        {professoresNome.professores.map(professor => (
                                        <option key={professor._id} value={professor._id}>
                                            {professor.nome}
                                        </option>
                                    ))}
                                    </select>


                                <button className="button-filtro" id="filtro" onClick={modalFiltragemClose}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
                <TableAluno renderFormTable={renderFormTable} pesquisar={pesquisaUsuario}/>
                {isCadastroOpen && (<CadastrarAluno handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}