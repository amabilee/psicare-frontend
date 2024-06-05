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

  const handleVisualizarClick = () => {
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

  const handleEditarClick = () => {
    setIsEditarOpen(true);
}

const handleEditarClose = () => {
    setIsEditarOpen(false);
}

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
          <tr>
            <td className="checkbox-conteudo">
              <input type="checkbox" className="checkbox" id="checkbox" />
            </td>
              <td className="conteudo" onClick={handleVisualizarClick}>001</td> {/* celula do conteudo */}
              <td className="conteudo" onClick={handleVisualizarClick}>Guilherme Poloniato Salomão</td>
              <td className="conteudo" onClick={handleVisualizarClick}>00000000000</td>
              <td className="conteudo" onClick={handleVisualizarClick}>Noturno</td> 
              <td className="icones-acao">
                <img src={editar} alt="editar" id="icon-acao" onClick={handleEditarClick} />
                <img
                  src={excluir}
                  alt="excluir"
                  id="icon-acao"
                  onClick={handleExcluirClick}
                />
              </td>   
          </tr>
          <tr>
            <td className="checkbox-conteudo">
              <input type="checkbox" className="checkbox" id="checkbox" />
            </td>
            <td className="conteudo">002</td> {/* celula do conteudo */}
            <td className="conteudo">Gustavo</td>
            <td className="conteudo">00000000000</td>
            <td className="conteudo">Noturno</td>
            <td className="icones-acao">
              <img src={editar} alt="editar" id="icon-acao" />
              <img src={excluir} alt="excluir" id="icon-acao" />
            </td>
          </tr>
          <tr>
            <td className="checkbox-conteudo">
              <input type="checkbox" className="checkbox" id="checkbox" />
            </td>
            <td className="conteudo">003</td> {/* celula do conteudo */}
            <td className="conteudo">Lucianno</td>
            <td className="conteudo">00000000000</td>
            <td className="conteudo">Noturno</td>
            <td className="icones-acao">
              <img src={editar} alt="editar" id="icon-acao" />
              <img src={excluir} alt="excluir" id="icon-acao" />
            </td>
          </tr>
          <tr>
            <td className="checkbox-conteudo">
              <input type="checkbox" className="checkbox" id="checkbox" />
            </td>
            <td className="conteudo">004</td> {/* celula do conteudo */}
            <td className="conteudo">Cesar</td>
            <td className="conteudo">00000000000</td>
            <td className="conteudo">Matutino</td>
            <td className="icones-acao">
              <img src={editar} alt="editar" id="icon-acao" />
              <img src={excluir} alt="excluir" id="icon-acao" />
            </td>
          </tr>
        </tbody>
        <caption>1/100</caption>
      </table>
      {isVisualizarOpen && (
        <VisualizarSecretario handleCloseVisualizar={handleCloseVisualizar} />
      )}
      {isExcluirOpen && (<Excluir handleExcluirClose={handleExcluirClose} />)}
      {isEditarOpen && (<Editar handleEditarClose={handleEditarClose} />)}
    </>
  );
}
