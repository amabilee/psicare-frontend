import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import paginacaoVoltar from "../../assets/paginacao-voltar.svg";
import paginacaoPassar from "../../assets/paginacao-passar.svg";
import VisualizarSecretario from "../visualizar/secretario";
import Excluir from "../excluir/excluir";
import Editar from "../editar/editar";
import editar from "../../assets/editar-icon.svg";
import excluir from "../../assets/excluir-icon.svg";
import "./style.css";


export default function Table({renderFormTable}) {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [clickCheckbox, setClickcheckbox] = useState(false);
  const [dadosSecretario, setDadosSecretario] = useState([]); //utilizar [] por se tratar de uma array para armazenar os itens

  useEffect(() => {
    receberDadosSecretario();
  }, [renderFormTable]); // utilizei para chamar o receberDadosSecretario quando o componente for montado, para os dados serem renderizados quando a tabela for montada

  const receberDadosSecretario = async() => {
    try {
      var receberDados = await api.get("/secretario/paginado?page=1"); 
      var dados = receberDados.data;
      console.log(dados)
      setDadosSecretario(dados);
    } catch (e) {
      console.log("erro", e)
    }
  }

  const handleVisualizarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsVisualizarOpen(true);
  };

  const handleCloseVisualizar = () => {
    setIsVisualizarOpen(false);
  };

  const handleExcluirClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsExcluirOpen(true);
  };

  const handleExcluirClose = () => {
    setIsExcluirOpen(false);
  };

  const handleEditarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsEditarOpen(true);
}

const handleEditarClose = () => {
    setIsEditarOpen(false);
}


  return (
    <>
      <table className="table-secretario">
        <thead>
          <tr className="tr-body">
            <th>
              <input type="checkbox" className="checkbox"/>
            </th>
            {/* <th>Id</th> */}
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Turno</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="body-table-secretario">
          {Array.isArray(dadosSecretario.secretarios) && dadosSecretario.secretarios.map((dados, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" className="checkbox"/>
              </td>
              {/* <td id="idSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.id}</td> */}
              <td id="nomeSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.nome}</td>
              <td id="telefoneSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.telefone}</td>
              <td id="emailSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.email}</td>
              <td id="cpfSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.cpf}</td>
              <td id="turnoSecretario" className="body-table" onClick={() => handleVisualizarClick(dados)}>{dados.turno}</td> 
              <td>
                <img src={editar} alt="editar" className="icon-editar" onClick={() => handleEditarClick(dados)} />
                <img src={excluir} alt="excluir" className="icon-excluir" onClick={() => handleExcluirClick(dados)}/>
              </td>   
            </tr>
          ))}
        </tbody>
      </table>
      <div className="quantidade-secretario">{Array.isArray(dadosSecretario.secretarios) &&dadosSecretario.length}/100</div>
      <div className="paginacao-table">
        <button className="voltar-pagina"><img src={paginacaoVoltar} alt="icone-paginacao" className="img_paginacao"/></button>
        <button className="passar-pagina"><img src={paginacaoPassar} alt="icone-paginacao" className="img_paginacao" /></button>
      </div>

      {isVisualizarOpen && (<VisualizarSecretario handleCloseVisualizar={handleCloseVisualizar} dadosSecretario={usuarioClick} />)}
      {isExcluirOpen && (<Excluir handleExcluirClose={handleExcluirClose} dadosSecretario={usuarioClick}  />)}
      {isEditarOpen && (<Editar handleEditarClose={handleEditarClose} dadosSecretario={usuarioClick} />)}
    </>
  );
}
