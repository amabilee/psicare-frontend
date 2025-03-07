import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import VisualizarAluno from "../visualizar/aluno";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";

export default function TableProfAluno({ alunosProfessor }) {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosAluno, setDadosAluno] = useState({ alunos: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunosTable, setTotalAlunosTable] = useState(0);
  const [acumularAlunosPage, setAcumularAlunosPage] = useState(0);

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
    receberDadosAluno();
  }, [alunosProfessor, currentPage]);


  const receberDadosAluno = async () => {
    const token = localStorage.getItem("user_token")
    try {
      let dadosPaginados = `/aluno/professor/${alunosProfessor}?page=${currentPage}`;//numero de pagina atual para a api 
      const receberDados = await api.get(dadosPaginados, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      }); //requisação get para os "dadosPaginados" contruido

      const { alunos, totalPages, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
      //aluno: lista de alunos, e totalPages: numero total de paginas tudo retornado pela api
      setDadosAluno({ alunos }); //atualiza os dadosalunos para os dados da minha api "alunos"
      setTotalPages(totalPages); //atualiza o totalPages com o "total" retorndo da minha apis
      setTotalAlunosTable(totalItems);

      const alunosAcumulados = ((currentPage - 1) * 10 + alunos.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
      setAcumularAlunosPage(alunosAcumulados);
    } catch (e) {
      if (!e.response?.data.error.includes("Nenhum aluno encontrado para este professor")) {
        setState({ ...state, open: true });
        setMessage("Ocorreu um erro ao buscar dados do aluno");
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
  const calculoLinhasVazias = 10 - dadosAluno.alunos.length;
  const dadosVazios = dadosAluno.alunos.length === 0;
  return (
    <div className="table-container table-container-ProfAlunos">
      <h2>Alunos</h2>
      <table className="table table-paciente">
        <thead>
          <tr className="tr-body">
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Periodo</th>
            <th>CPF</th>
            <th>telefone</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {dadosVazios ? (
            <tr>
              <td colSpan="6" className="nenhum-Dado">
                Nenhum aluno encontrado.
              </td>
            </tr>
          ) : (Array.isArray(dadosAluno.alunos) &&
            dadosAluno.alunos.map((aluno) => (
              <tr key={aluno._id} >
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.nome}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.matricula}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                {aluno.periodo.includes("°") || aluno.periodo.includes("º") ? aluno.periodo : `${aluno.periodo}°`}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.cpf}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.telefone}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.email}
                </td>
              </tr>
            )))}
          {calculoLinhasVazias > 0 && renderLinhasVazias(calculoLinhasVazias)}
        </tbody>
        <tfoot className="footer-table">
          <tr>
            <td colSpan="7">
              <div className="quantidade-itens">
                {Array.isArray(dadosAluno.alunos) &&
                  `${acumularAlunosPage}/${totalAlunosTable}`}
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

      <Snackbar
        ContentProps={{ sx: { borderRadius: '8px' } }}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert variant="filled" severity="error" onClose={handleClose} action="">
          {message}
        </Alert>
      </Snackbar>
      {isVisualizarOpen && (
        <VisualizarAluno
          handleCloseVisualizar={handleCloseVisualizar}
          dadosAluno={usuarioClick}
        />
      )}
    </div>
  );
}