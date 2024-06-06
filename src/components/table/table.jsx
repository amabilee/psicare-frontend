import React, { useState } from "react";
import VisualizarSecretario from "../visualizar/secretario";
import Excluir from "../excluir/excluir";
import Editar from "../editar/editar";
import editar from "../../assets/editar-icon.svg";
import excluir from "../../assets/excluir-icon.svg";
import "./style.css";

export default function Table() {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});

  const handleVisualizarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsVisualizarOpen(true);
  };

  const handleCloseVisualizar = () => {
    setIsVisualizarOpen(false);
  };

  const handleExcluirClick = () => {
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

let dadosSecretario = [
  {id:1, nome:"Guilherme Poloniato Salomão", cpf:"0000000000-00", turno:"Noturno", telefone:"(62)9 9999-9999", email:"Gui@gmail.com"},
  {id:2, nome:"Luciano Morais", cpf:"0000000000-00", turno:"Noturno", telefone:"(62)9 9999-9999", email:"LULU@gmail.com"}
];



  return (
    <>
      <table>
        <thead>
          {" "}
          {/* cabeçalho */}
          <tr>
            {" "}
            {/* começar uma linha */}
            <th>
              <input
                type="checkbox"
                className="checkbox-header"
                id="checkbox-table"
              />
            </th>
            <th>Id</th> {/* celula do cabeçalho */}
            <th>Nome</th>
            <th>CPF</th>
            <th>Turno</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {" "}
          {/* conteudo da tabela */}
          {dadosSecretario.map((dados, index) => (
            <tr key={index}>
              <td className="checkbox-conteudo">
                <input type="checkbox" className="checkbox" id="checkbox" />
              </td>
                <td className="conteudo" id="idSecretario" onClick={() => handleVisualizarClick(dados)}>{dados.id}</td> {/* celula do conteudo */}
                <td className="conteudo" id="nomeSecretario" onClick={() => handleVisualizarClick(dados)}>{dados.nome}</td>
                <td className="conteudo" id="cpfSecretario" onClick={() => handleVisualizarClick(dados)}>{dados.cpf}</td>
                <td className="conteudo" id="turnoSecretario" onClick={() => handleVisualizarClick(dados)}>{dados.turno}</td> 
                <td className="icones-acao">
                  <img src={editar} alt="editar" id="icon-acao" onClick={() => handleEditarClick(dados)} />
                  <img src={excluir} alt="excluir" id="icon-acao" onClick={handleExcluirClick}/>
                </td>   
            </tr>
          ))}
          
        </tbody>
        <caption>{dadosSecretario.length}/100</caption>
      </table>
      {isVisualizarOpen && (
        <VisualizarSecretario handleCloseVisualizar={handleCloseVisualizar} dadosSecretario={usuarioClick} />
      )}
      {isExcluirOpen && (<Excluir handleExcluirClose={handleExcluirClose} dadosSecretario={usuarioClick}  />)}
      {isEditarOpen && (<Editar handleEditarClose={handleEditarClose} dadosSecretario={usuarioClick} />)}
    </>
  );
}
