import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import VisualizarPaciente from "../visualizar/paciente";


import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import AtivarIcon from "../../assets/ativar-icon.svg"

import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

export default function TablePacienteArquivado({ renderFormTable, pesquisar, filtrarPesquisa, loadingStatus }) {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosPaciente, setDadosPaciente] = useState({ pacientes: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPacientesTable, setTotalPacientesTable] = useState(0);
  const [acumularPacientesPage, setAcumularPacientesPage] = useState(0);
  const [checkboxSelecionadas, setCheckboxSelecionadas] = useState({}); // Novo estado para contagem de checkboxes selecionadas
  const [todasCheckboxSelecionadas, setTodasCheckboxSelecionadas] = useState({});

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
    receberDadosPaciente();
  }, [renderFormTable, currentPage, pesquisar, filtrarPesquisa]);

  const receberDadosPaciente = async () => {
    const token = localStorage.getItem("user_token")
    try {
      let dadosPaginados = `/paciente?page=${currentPage}`;//numero de pagina atual para a api 

      let filtrar = [`&ativo=false`];
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
      });//requisação get para os "dadosPaginados" contruidos

      const { pacientes, totalPages, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição

      //paciente: lista de pacientes, e totalPages: numero total de paginas tudo retornado pela api
      setDadosPaciente({ pacientes }); //atualiza os dadosPaciente para os dados da minha api "pacientes"
      setTotalPages(totalPages); //atualiza o totalPages com o "total" retorndo da minha apis
      setTotalPacientesTable(totalItems);
      loadingStatus(false)

      const pacientesAcumulados = ((currentPage - 1) * 15 + pacientes.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
      setAcumularPacientesPage(pacientesAcumulados);
    } catch (e) {
      console.log("Erro ao buscar dados do secretário:", e);
    }
  };

  const handleVisualizarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsVisualizarOpen(true);
  };

  const handleCloseVisualizar = () => {
    setIsVisualizarOpen(false);
  };

  const handleAtivarClick = async (originalData) => {
    let newPaciente = ({ ...originalData, ativoPaciente: true });
    const token = localStorage.getItem("user_token");
    
    try {
      await api.patch(`/paciente/${newPaciente._id}`, newPaciente, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      });
      
      renderDadosPaciente(newPaciente._id); 
  
      setState({ ...{ vertical: 'bottom', horizontal: 'center' }, open: true });
      setMessage("Paciente ativado com sucesso.");
    } catch (e) {
      console.log("Erro ao atualizar dados:", e);
    }
  };

  const renderDadosPaciente = (idPaciente) => {
    setDadosPaciente((prevDados) => {
      return {
        ...prevDados,
        pacientes: prevDados.pacientes.filter((paciente) => paciente._id !== idPaciente), // remove o paciente
      };
    });
  };
  

  //Tudo relacionado a paginação da tabela
  const handlePaginaAnterior = () => {
    if (currentPage > 1) { //se a pagina atual for maior que 1, entao tem página anterior para navegação
      setCurrentPage(currentPage - 1); //atualiza a pagina atual para a pagina anterior 
    }
  };

  const handlePaginaSeguinte = () => {
    if (currentPage < totalPages) { //se a pagina atual for menor que o toal de pagina, tem paginas seguintes p/ navegação
      setCurrentPage(currentPage + 1); //atualiza a pagina atual para a pagina seguinte
    }
  };

  const renderLinhasVazias = (contadorLinhas) => { //função flecha que indica quantas linhas vazias serão renderizadas
    const linhasVazias = []; //array que sera preenchida pelas linhas vazias
    for (let i = 0; i < contadorLinhas; i++) {//loop for que ira iterar "contadorLinhas"
      linhasVazias.push( //adicionado a array linhasVazias com um push
        //criar uma nova linha com uma chave key unica, para renderizar de forma eficiente quando adicionar um elemento
        <tr key={`empty-${i}`} className="tr-vazia">
          <td colSpan="1">&nbsp;</td>
        </tr>
      );
    }
    return linhasVazias;
  };
  //calcula quantas linhas vazias são necessárias para preencher ate um total de 15 linhas
  const calculoLinhasVazias = 15 - dadosPaciente.pacientes.length;
  const dadosVazios = dadosPaciente.pacientes.length === 0;


  const formatarDataNascimento = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };
  

  return (
    <div className="table-container">
      <table className="table table-paciente-arquivado">
        <thead>
          <tr className="tr-body">
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Tratamento</th>
            <th>Data de nascimento</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-body">
          {dadosVazios ? (
            <tr>
              <td colSpan="6" className="nenhum-Dado">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (Array.isArray(dadosPaciente.pacientes) &&
            dadosPaciente.pacientes.map((paciente, index) => (
              <tr key={paciente._id} >
                <td className="table-content" id="td-nome" onClick={() => handleVisualizarClick(paciente)}>
                  {paciente.nome}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                  {paciente.telefoneContato ? paciente.telefoneContato : paciente.telefone}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                  {paciente.email}
                </td>
                <td className="table-content" id="td-tratamento" onClick={() => handleVisualizarClick(paciente)}>
                  {paciente.tipoDeTratamento}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                  {formatarDataNascimento(paciente.dataNascimento)}
                </td>
                <td>
                  <img
                    src={AtivarIcon}
                    alt="ativar"
                    className="icon-editar"
                    onClick={() => handleAtivarClick(paciente)}
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
                  {Array.isArray(dadosPaciente.pacientes) &&
                    `${acumularPacientesPage}/${totalPacientesTable}`}
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
        <VisualizarPaciente
          handleCloseVisualizar={handleCloseVisualizar}
          dadosPaciente={usuarioClick}
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
