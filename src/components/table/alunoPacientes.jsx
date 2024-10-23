import React, {useState, useEffect} from "react";
import { api } from "../../services/server";
import VisualizarPaciente from "../visualizar/paciente";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

export default function TableAlunoPaciente({ pacienteAlunos }){
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosPaciente, setDadosPaciente] = useState({ pacientes: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunosTable, setTotalAlunosTable] = useState(0);
  const [acumularAlunosPage, setAcumularAlunosPage] = useState(0);

  useEffect(() => {
    receberDadosAluno();
  }, [pacienteAlunos, currentPage]);
  console.log("dadosPaciente",dadosPaciente)

  const receberDadosAluno = async () => {
    const token = localStorage.getItem("user_token")
    try {
      let dadosPaginados = `/paciente/aluno/${pacienteAlunos}?page=${currentPage}`;//numero de pagina atual para a api 
      const receberDados = await api.get(dadosPaginados, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });//requisação get para os "dadosPaginados" contruido
      console.log("receber dados",receberDados)

      const { pacientes, totalPages ,totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
      //aluno: lista de pacientes, e totalPages: numero total de paginas tudo retornado pela api
      setDadosPaciente({ pacientes }); //atualiza os dadospacientes para os dados da minha api "pacientes"
      setTotalPages(totalPages); //atualiza o totalPages com o "total" retorndo da minha apis
      setTotalAlunosTable(totalItems);

      const pacientesAcumulados = ((currentPage - 1) * 10 + pacientes.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
      setAcumularAlunosPage(pacientesAcumulados);
    } catch (e) {
      console.log("Erro ao buscar dados do aluno:", e);
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
  const calculoLinhasVazias = 10 - dadosPaciente.pacientes.length;
  const dadosVazios = dadosPaciente.pacientes.length === 0;

  const formatarDataNascimento = (data) => {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };
  return(
      <div className="table-container table-container-alunoPaciente">
        <h2>Paciente</h2>
        <table className="table table-paciente">
          <thead>
              <tr className="tr-body">
                <th>Nome</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Tipo de Tratamento</th>
                <th>Data de Nascimento</th>
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
                  <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                    {paciente.nome}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                    {paciente.telefone}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                    {paciente.cpf}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                    {paciente.tipoDeTratamento}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(paciente)}>
                    {formatarDataNascimento(paciente.dataNascimento)}
                  </td>
                </tr>
              )) )}
            {calculoLinhasVazias > 0 && renderLinhasVazias(calculoLinhasVazias)}
          </tbody>
          <tfoot className="footer-table">
            <tr>
              <td colSpan="7">
                <div className="quantidade-itens">
                  {Array.isArray(dadosPaciente.pacientes) &&
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
        {isVisualizarOpen && (
            <VisualizarPaciente
              handleCloseVisualizar={handleCloseVisualizar}
              dadosPaciente={usuarioClick}
            />
          )}
    </div>
  );
}