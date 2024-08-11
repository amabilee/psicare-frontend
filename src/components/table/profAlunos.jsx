import React, {useState, useEffect} from "react";
import { api } from "../../services/server";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

export default function TableProfAluno({ renderFormTable }){
    const [dadosAluno, setDadosAluno] = useState({ alunos: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAlunosTable, setTotalAlunosTable] = useState(0);
    const [acumularAlunosPage, setAcumularAlunosPage] = useState(0);

    useEffect(() => {
      receberDadosAluno();
    }, [renderFormTable, currentPage]);

    const receberDadosAluno = async () => {
      const token = localStorage.getItem("user_token")
      try {
        let dadosPaginados = `/aluno/paginado?page=${currentPage}`;//numero de pagina atual para a api 
        const receberDados = await api.get(dadosPaginados, {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });//requisação get para os "dadosPaginados" contruido
        const { alunos, totalPages: total, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
        //aluno: lista de alunos, e totalPages: numero total de paginas tudo retornado pela api
        setDadosAluno({ alunos }); //atualiza os dadosalunos para os dados da minha api "alunos"
        setTotalPages(total); //atualiza o totalPages com o "total" retorndo da minha apis
        setTotalAlunosTable(totalItems);

        const alunosAcumulados = ((currentPage - 1) * 15 + alunos.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
        setAcumularAlunosPage(alunosAcumulados);
      } catch (e) {
        console.log("Erro ao buscar dados do aluno:", e);
      }
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
    return(
        <div className="table-container">
          <span>Alunos</span>
          <table className="table">
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
              {Array.isArray(dadosAluno.alunos) &&
                dadosAluno.alunos.map((aluno, index) => (
                  <tr key={aluno._id} >
                    <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                      {aluno.nome}
                    </td>
                    <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                      {aluno.matricula}
                    </td>
                    <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                      {aluno.periodo}
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
                ))}
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
      </div>
    );
}