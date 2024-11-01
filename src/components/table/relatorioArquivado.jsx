import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import VisualizarRelatorio from "../visualizar/relatorio";

import AtivarIcon from "../../assets/ativar-icon.svg"

import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { UseAuth } from '../../hooks';

export default function TableRelatorioArquivado({ renderFormTable, pesquisar, filtrarPesquisa, loadingStatus }) {
  const { signOut } = UseAuth();
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosRelatorio, setDadosRelatorio] = useState({ relatorios: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRelatorioTable, setTotalRelatorioTable] = useState(0);
  const [acumularRelatorioPage, setAcumularRelatorioPage] = useState(0);

  const [message, setMessage] = useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    receberDadosRelatorio();
  }, [renderFormTable, currentPage, pesquisar, filtrarPesquisa]);

  const receberDadosRelatorio = async () => {
    const token = localStorage.getItem("user_token")

    try {
      let dadosPaginados = `/relatorio?page=${currentPage}`;

      let filtrar = [`&ativoRelatorio=false`];
      if (pesquisar) {
        filtrar += `&q=${pesquisar}`;
      }
      if (filtrarPesquisa.nome) {
        filtrar += `&nome=${filtrarPesquisa.nome}`;
      }
      if (filtrarPesquisa.cpf) {
        filtrar += `&cpf=${filtrarPesquisa.cpf}`;
      }
      if (filtrarPesquisa.dataNascimento) {
        filtrar += `&dataNascimento=${filtrarPesquisa.dataNascimento}`;
      }
      if (filtrarPesquisa.encaminhador) {
        filtrar += `&encaminhador=${filtrarPesquisa.encaminhador}`;
      }
      if (filtrarPesquisa.dataInicioTratamento) {
        filtrar += `&dataInicioTratamento=${filtrarPesquisa.dataInicioTratamento}`;
      }
      if (filtrarPesquisa.dataTerminoTratamento) {
        filtrar += `&dataTerminoTratamento=${filtrarPesquisa.dataTerminoTratamento}`;
      }
      if (filtrarPesquisa.tipoDeTratamento) {
        filtrar += `&tipoDeTratamento=${filtrarPesquisa.tipoDeTratamento}`;
      }
      if (filtrarPesquisa.sexo) {
        filtrar += `&sexo=${filtrarPesquisa.sexo}`;
      }
      if (filtrar.length > 0) {
        dadosPaginados += `&${filtrar}`
      }

      const receberDados = await api.get(dadosPaginados, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      const { relatorios, totalPages, totalItems } = receberDados.data;


      setDadosRelatorio({ relatorios });
      setTotalPages(totalPages);
      setTotalRelatorioTable(totalItems);
      loadingStatus(false)

      const relatoriosAcumulados = ((currentPage - 1) * 15 + relatorios.length)
      setAcumularRelatorioPage(relatoriosAcumulados);
    } catch (e) {
      if (e.response.status == 401) {
        signOut()
      } else {
        console.log("Erro ao buscar relatorios ", e)
      }
    }
  };


  const handleVisualizarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsVisualizarOpen(true);
  };

  const handleCloseVisualizar = () => {
    setIsVisualizarOpen(false);
  };

  const renderDadosRelatorio = (dadosAtualizados) => {
    setDadosRelatorio((prevDados) => {
      return {
        ...prevDados,
        relatorios: prevDados.relatorios.filter((relatorio) => relatorio._id !== dadosAtualizados._id),
      };
    });
  };

  const handlePaginaAnterior = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePaginaSeguinte = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderLinhasVazias = (contadorLinhas) => {
    const linhasVazias = [];
    for (let i = 0; i < contadorLinhas; i++) {
      linhasVazias.push(

        <tr key={`empty-${i}`} className="tr-vazia">
          <td colSpan="1">&nbsp;</td>
        </tr>
      );
    }
    return linhasVazias;
  };

  const calculoLinhasVazias = 15 - dadosRelatorio.relatorios.length;
  const dadosVazios = dadosRelatorio.relatorios.length === 0;


  const formatarData = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleAtivarClick = async (originalData) => {
    let newRelatorio = ({ ...originalData, ativoRelatorio: true });
    const token = localStorage.getItem("user_token");

    try {
      await api.patch(`/relatorio/${newRelatorio._id}`, newRelatorio, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });
      renderDadosRelatorio(newRelatorio);
      setState({ ...{ vertical: 'bottom', horizontal: 'center' }, open: true });
      setMessage("Relatório ativado com sucesso.");
    } catch (e) {
      console.log("Erro ao atualizar dados:", e)
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="tr-body">
            <th>Data de Criação</th>
            <th>Paciente</th>
            <th>Tipo de Tratamento</th>
            <th>Aluno / Funcionário responsável</th>
            <th></th>
          </tr>

        </thead>
        <tbody className="table-body">
          {dadosVazios ? (
            <tr>
              <td colSpan="6" className="nenhum-Dado">
                Nenhum relatório encontrado.
              </td>
            </tr>
          ) : (Array.isArray(dadosRelatorio.relatorios) &&
            dadosRelatorio.relatorios.map((relatorio, index) => (
              <tr key={relatorio._id} >
                <td className="table-content" id="td-nome" onClick={() => handleVisualizarClick(relatorio)}>
                  {formatarData(relatorio.dataCriacao)}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(relatorio)}>
                  {relatorio.nomePaciente}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(relatorio)}>
                  {relatorio.tipoTratamento}
                </td>
                <td className="table-content" id="td-tratamento" onClick={() => handleVisualizarClick(relatorio)}>
                  {relatorio.alunoUnieva ? relatorio.nomeAluno : relatorio.nome_funcionario}
                </td>
                <td>
                  <img
                    src={AtivarIcon}
                    alt="ativar"
                    className="icon-editar"
                    onClick={() => handleAtivarClick(relatorio)}
                  />
                </td>
              </tr>
            ))
          )}
          {calculoLinhasVazias > 0 && renderLinhasVazias(calculoLinhasVazias)}
        </tbody>
        <tfoot className="footer-table">
          <tr>
            <td colSpan="7">
              <div className="quantidade-itens">
                <span>
                  {Array.isArray(dadosRelatorio.pacientes) &&
                    `${acumularRelatorioPage}/${totalRelatorioTable}`}
                </span>
              </div>
              <div className="paginacao-table">
                <button
                  className={`voltar-pagina ${currentPage === 1 ? "paginacaoWhite" : "paginacaoBlack"}`}
                  onClick={handlePaginaAnterior}
                  disabled={currentPage === 1}
                >
                  <img
                    src={currentPage === 1 ? paginacaoBlack : paginacaoWhite}
                    alt="icone-paginacao"
                    className="img_paginacao"
                  />
                </button>
                <button
                  className={`passar-pagina ${currentPage === totalPages ? "paginacaoBlack" : "paginacaoWhite"}`}
                  onClick={handlePaginaSeguinte}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor: currentPage === totalPages ? "#D9D9D9" : "#C760EB",
                  }}
                >
                  <img
                    src={currentPage === totalPages ? paginacaoBlack : paginacaoWhite}
                    alt="icone-paginacao"
                    className="img_paginacao"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {isVisualizarOpen && (
        <VisualizarRelatorio
          handleCloseVisualizar={handleCloseVisualizar}
          dadosRelatorio={usuarioClick}
        />
      )}
      <Snackbar
        ContentProps={{ sx: { borderRadius: '8px' } }}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert variant="filled" severity="success" onClose={handleClose} action="">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
