import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { api } from "../../services/server";
import VisualizarRelatorio from "../visualizar/relatorio";
import ExcluirRelatorio from "../excluir/relatorio";
import EditarRelatorio from "../editar/relatorio";
import IconEditar from "../../assets/editar-icon.svg";
import IconExcluir from "../../assets/excluir-icon.svg";
import IconDownload from "../../assets/download.svg"
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

import { UseAuth } from '../../hooks';

export default function TableRelatorio({ renderFormTable, pesquisar, filtrarPesquisa, loadingStatus }) {
  const { signOut } = UseAuth();
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosRelatorio, setDadosRelatorio] = useState({ relatorios: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRelatorioTable, setTotalRelatorioTable] = useState(0);
  const [acumularRelatorioPage, setAcumularRelatorioPage] = useState(0);
  const [checkboxSelecionadas, setCheckboxSelecionadas] = useState({});
  const [todasCheckboxSelecionadas, setTodasCheckboxSelecionadas] = useState({});
  const [idsSelecionados, setIdsSelecionados] = useState([]);

  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    receberDadosRelatorio();
  }, [renderFormTable, currentPage, pesquisar, filtrarPesquisa]);

  useEffect(() => {
    const level = localStorage.getItem('user_level');
    setUserLevel(level);
  }, []);

  const formatarDataRequest = (data) => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}-${mes}`;
  };

  const receberDadosRelatorio = async () => {
    const token = localStorage.getItem("user_token")

    try {
      let dadosPaginados = `/relatorio?page=${currentPage}`;

      let filtrar = [`&ativoRelatorio=true`];
      if (pesquisar) {
        filtrar += `&q=${pesquisar}`;
      }
      if (filtrarPesquisa.nomePaciente) {
        filtrar += `&nomePaciente=${filtrarPesquisa.nomePaciente}`;
      }
      if (filtrarPesquisa.nomeAluno) {
        filtrar += `&nomeAluno=${filtrarPesquisa.nomeAluno}`;
      }
      if (filtrarPesquisa.dataCriacao) {
        filtrar += `&dataCriacao=${formatarDataRequest(filtrarPesquisa.dataCriacao)}`;
      }
      if (filtrarPesquisa.tipoTratamento) {
        filtrar += `&tipoTratamento=${filtrarPesquisa.tipoTratamento}`;
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


  const handleExcluirClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsExcluirOpen(true);
  };

  const handleExcluirSelecionados = () => {
    setUsuarioClick({ _ids: idsSelecionados });
    setIsExcluirOpen(true);
  }

  const handleExcluirClose = () => {
    setIsExcluirOpen(false);
  };

  const atualizarTableExcluir = () => {
    receberDadosRelatorio();
  }

  const handleEditarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsEditarOpen(true);
  };

  const handleEditarClose = () => {
    setIsEditarOpen(false);
  };

  const renderDadosRelatorio = (dadosAtualizados) => {
    setDadosRelatorio((prevDados) => {
      return {
        ...prevDados,
        relatorios: prevDados.relatorios.map((relatorio) =>
          relatorio._id === dadosAtualizados._id ? dadosAtualizados : relatorio
        ),
      };
    });
  };

  const contarTotalCheckboxSelecionadas = () => {
    let totalSelecionados = 0;
    for (const pagina in checkboxSelecionadas) {
      totalSelecionados += Object.keys(checkboxSelecionadas[pagina]).length;
    }

    return totalSelecionados
  };

  const algumaCheckboxSelecionada = () => {
    return contarTotalCheckboxSelecionadas() > 0;
  };

  const handleCheckboxSelecionada = (index, id) => (e) => {
    const isChecked = e.target.checked;

    setCheckboxSelecionadas((prev) => {
      const novaSelection = { ...prev };
      const paginaAtual = `page-${currentPage}`

      if (!novaSelection[paginaAtual]) {
        novaSelection[paginaAtual] = {}
      }
      if (isChecked) {
        novaSelection[paginaAtual][index] = true;

        setIdsSelecionados((prev) => {
          const novoSet = new Set(prev);
          novoSet.add(id);
          return Array.from(novoSet)
        })
      } else {
        delete novaSelection[paginaAtual][index]

        setIdsSelecionados((prev) => prev.filter((IdSelecionado) => IdSelecionado !== id))
      }
      return novaSelection;
    });
  };

  const handleSelecionarTudo = (e) => {
    const isChecked = e.target.checked;
    const paginaAtual = `page-${currentPage}`;


    setTodasCheckboxSelecionadas((prev) => ({
      ...prev,
      [paginaAtual]: isChecked,
    }));


    setCheckboxSelecionadas((prev) => {
      const novaSelection = { ...prev };

      if (isChecked) {
        novaSelection[paginaAtual] = {};
        const novosIds = []


        dadosRelatorio.relatorios.forEach((relatorio, index) => {
          novaSelection[paginaAtual][index] = true;
          novosIds.push(relatorio._id);
        });

        setIdsSelecionados((prev) => {
          const novoSet = new Set(prev);

          novosIds.forEach((id) => novoSet.add(id));
          return Array.from(novoSet);
        })
      } else {
        delete novaSelection[paginaAtual];
        setIdsSelecionados((prev) => prev.filter((id) => !dadosRelatorio.relatorios.some((relatorio) => relatorio._id === id)));
      }

      return novaSelection
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

  const downloadFile = (arquivo) => {
    const fullURL = `${api.defaults.baseURL}${arquivo.id}`;
    window.open(fullURL, '_blank');
    console.log(`Abrindo URL: ${fullURL}`);
  };


  const handleDownloadClick = (originalData) => {
    console.log(originalData)
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Relatório de Tratamento", 105, 10, { align: "center" });


    doc.setFontSize(12);
    doc.setFont("times", "normal")
    doc.line(10, 16, 200, 16);
    doc.text("Informações do Paciente", 10, 20);
    doc.line(10, 22, 200, 22);

    const patientInfo = [
      { label: "Nome do paciente", value: originalData.nomePaciente },
      { label: "Data de nascimento", value: formatarDataExport(originalData.dataNascimentoPaciente) },
      { label: "Tipo de tratamento", value: originalData.tipoTratamento }
    ];

    let yPosition = 28;
    doc.setFontSize(10);
    patientInfo.forEach((item) => {
      doc.setFont("times", "bold");
      doc.text(`${item.label}:`, 10, yPosition);
      doc.setFont("times", "normal");
      doc.text(item.value || "Não informado", 80, yPosition); 
      yPosition += 8;
    });

    yPosition += 5;
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 5;

    doc.setFontSize(12);
    doc.setFont("times", "normal")
    doc.text("Informações do Tratamento", 10, yPosition);
    doc.line(10, yPosition + 2, 200, yPosition + 2);

    const treatmentInfo = [
      { label: "Encaminhador", value: `${originalData.nomeAluno} - Aluno da UniEVANGÉLICA` || `${originalData.nome_funcionario} - Funcionário da Associação Educativa Evangélica` || "Não informado" },
      { label: "Data de início do tratamento", value: formatarDataExport(originalData.dataInicioTratamento) },
      { label: "Data de término do tratamento", value: formatarDataExport(originalData.dataTerminoTratamento) }
    ];

    yPosition += 10;
    doc.setFontSize(10)
    treatmentInfo.forEach((item) => {
      doc.setFont("times", "bold");
      doc.text(`${item.label}:`, 10, yPosition);
      doc.setFont("times", "normal");
      doc.text(item.value || "Não informado", 80, yPosition);
      yPosition += 8;
    });

    yPosition += 5;
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 5;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("Informações do Relatório", 10, yPosition);
    doc.line(10, yPosition + 2, 200, yPosition + 2);

    yPosition += 10;

    const relatorioInfo = [
      { label: "Data de criação", value: formatarDataExport(originalData.dataCriacao) },
      { label: "Última atualização", value: formatarDataExport(originalData.ultimaAtualizacao) },
    ];

    relatorioInfo.forEach((item) => {
      doc.setFontSize(10)
      doc.setFont("times", "bold"); 
      doc.text(`${item.label}:`, 10, yPosition);
      doc.setFont("times", "normal");
      doc.text(item.value || "Não informado", 80, yPosition);
      yPosition += 8;
    });

    doc.setFontSize(10);

    doc.setFont("times", "bold"); 
    doc.text("Conteúdo:", 10, yPosition);
    doc.setFont("times", "normal");
    doc.setFontSize(10)
    const conteudo = doc.splitTextToSize(originalData.conteudo || "Não informado", 180);
    yPosition += 6;
    conteudo.forEach((line) => {
      doc.text(line, 15, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 5;

    if (originalData.prontuario.length > 0) {
      doc.text("Arquivos do Prontuário:", 10, yPosition);
      yPosition += 10;
      originalData.prontuario.forEach((file, index) => {
        doc.text(`${index + 1}. ${file.nome}`, 15, yPosition);
        yPosition += 10;
        downloadFile(file);
      });
    }

    if (originalData.assinatura.length > 0) {
      doc.text("Arquivos de Assinatura:", 10, yPosition);
      yPosition += 10;
      originalData.assinatura.forEach((file, index) => {
        doc.text(`${index + 1}. ${file.nome}`, 15, yPosition);
        yPosition += 10;
        downloadFile(file);
      });
    }

    doc.save(`Relatorio_${originalData.nomePaciente}.pdf`);
  };

  const formatarDataExport = (data) => {
    if (!data) return "Não informado";

    try {
      const dataObj = new Date(data);
      const dia = String(dataObj.getDate()).padStart(2, "0");
      const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
      const ano = dataObj.getFullYear();

      const horas = String(dataObj.getHours()).padStart(2, "0");
      const minutos = String(dataObj.getMinutes()).padStart(2, "0");
      const segundos = String(dataObj.getSeconds()).padStart(2, "0");

      const dataFormatada = `${dia}/${mes}/${ano}`;
      const horaFormatada = `${horas}:${minutos}:${segundos}`;

      // Verifica se as horas são diferentes de 00:00:00
      return horas !== "00" || minutos !== "00" || segundos !== "00"
        ? `${dataFormatada} às ${horaFormatada}`
        : dataFormatada;
    } catch (error) {
      return "Formato inválido";
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {algumaCheckboxSelecionada() ? (
            <tr className="tr-body">
              {(userLevel === '0' || userLevel === '3') && (
                <th>
                  <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo} />
                </th>
              )}
              <th>{contarTotalCheckboxSelecionadas()} selecionados</th>
              <th colSpan={5} className="deletar-selecionados">
                <span onClick={handleExcluirSelecionados}>Deletar Selecionados</span>
              </th>
            </tr>
          ) : (
            <tr className="tr-body">
              {(userLevel === '0' || userLevel === '3') && (
                <th>
                  <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo} />
                </th>
              )}
              <th>Data de Criação</th>
              <th>Paciente</th>
              <th>Tipo de Tratamento</th>
              <th>Aluno / Funcionário responsável</th>
              <th></th>
            </tr>
          )}
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
                {(userLevel === '0' || userLevel === '3') && (
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={handleCheckboxSelecionada(index, relatorio._id)}
                      checked={checkboxSelecionadas[`page-${currentPage}`]?.hasOwnProperty(index) || false}

                    />
                  </td>
                )}
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
                  {relatorio.nomeAluno ? relatorio.nomeAluno : relatorio.nome_funcionario}
                </td>
                {!algumaCheckboxSelecionada() && (
                  <td>
                    <img
                      src={IconDownload}
                      alt="exportar"
                      className="icon-editar"
                      onClick={() => handleDownloadClick(relatorio)}
                    />
                    <img
                      src={IconEditar}
                      alt="editar"
                      className="icon-editar"
                      onClick={() => handleEditarClick(relatorio)}
                    />
                    {(userLevel === '0' || userLevel === '3') && (
                      <img
                        src={IconExcluir}
                        alt="excluir"
                        className="icon-excluir"
                        onClick={() => handleExcluirClick(relatorio)}
                      />
                    )}
                  </td>
                )}
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
      {isExcluirOpen && (
        <ExcluirRelatorio
          handleExcluirClose={handleExcluirClose}
          dadosRelatorio={usuarioClick}
          atualizarTableExcluir={() => {
            atualizarTableExcluir();
            setCheckboxSelecionadas({});
            setTodasCheckboxSelecionadas({});
          }}
        />

      )}
      {isEditarOpen && (
        <EditarRelatorio
          handleEditarClose={handleEditarClose}
          dadosRelatorio={usuarioClick}
          renderDadosRelatorio={renderDadosRelatorio}
        />
      )}
    </div>
  );
}
