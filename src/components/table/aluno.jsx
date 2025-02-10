import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import VisualizarAluno from "../visualizar/aluno";
import ExcluirAluno from "../excluir/aluno";
import EditarAluno from "../editar/aluno";
import IconEditar from "../../assets/editar-icon.svg";
import IconExcluir from "../../assets/excluir-icon.svg";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function TableAluno({ renderFormTable, pesquisar, filtrarPesquisa, loadingStatus }) {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosAluno, setDadosAluno] = useState({ alunos: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlunosTable, setTotalAlunosTable] = useState(0);
  const [acumularAlunosPage, setAcumularAlunosPage] = useState(0);
  const [checkboxSelecionadas, setCheckboxSelecionadas] = useState({});
  const [todasCheckboxSelecionadas, setTodasCheckboxSelecionadas] = useState({});
  const [idsSelecionados, setIdsSelecionados] = useState([]);
  
  const [message, setMessage] = useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  }, []);

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    receberDadosAluno();
  }, [renderFormTable, currentPage, pesquisar, filtrarPesquisa]);

  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    const level = localStorage.getItem('user_level');
    setUserLevel(level);
  }, []);

  const receberDadosAluno = async () => {
    const token = localStorage.getItem("user_token")

    try {
      let dadosPaginados = `/aluno?page=${currentPage}`;

      let filtrar = [];
      if (pesquisar) {
        filtrar += `&q=${pesquisar}`;
      }
      if (filtrarPesquisa.nome) {
        filtrar += `&nome=${filtrarPesquisa.nome}`;
      }
      if (filtrarPesquisa.cpf) {
        filtrar += `&cpf=${filtrarPesquisa.cpf}`;
      }
      if (filtrarPesquisa.telefone) {
        filtrar += `&telefone=${filtrarPesquisa.telefone}`;
      }
      if (filtrarPesquisa.email) {
        filtrar += `&email=${filtrarPesquisa.email}`;
      }
      if (filtrarPesquisa.matricula) {
        filtrar += `&matricula=${filtrarPesquisa.matricula}`;
      }
      if (filtrarPesquisa.periodo) {
        filtrar += `&periodo=${filtrarPesquisa.periodo}`;
      }

      if (filtrarPesquisa.nomeProfessor) {
        filtrar += `&nomeProfessor=${filtrarPesquisa.nomeProfessor}`;
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

      const { alunos, totalPages: total, totalItems } = receberDados.data;
      setDadosAluno({ alunos });
      setTotalPages(total);
      setTotalAlunosTable(totalItems);
      loadingStatus(false)
      const alunosAcumulados = ((currentPage - 1) * 15 + alunos.length)
      setAcumularAlunosPage(alunosAcumulados);
    } catch (e) {
      setState({ ...state, open: true });
      setMessage("Ocorreu um erro ao buscar dados do aluno");
    }
  };

  //visualizar informações
  const handleVisualizarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsVisualizarOpen(true);
  };

  const handleCloseVisualizar = () => {
    setIsVisualizarOpen(false);
  };

  //relacionado a Excluir itens
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
    receberDadosAluno();
    setCheckboxSelecionadas({});
    setTodasCheckboxSelecionadas({});
    setIdsSelecionados([]);
  }

  //relacionado a editar
  const handleEditarClick = (originalData) => {
    setUsuarioClick(originalData);
    setIsEditarOpen(true);
  };

  const handleEditarClose = () => {
    setIsEditarOpen(false);
  };

  //Relacionado a atualizar os dados editados
  const renderDadosAluno = (dadosAtualizados) => { //recebe um objeto "dadosAtualizados", contendo informações de um aluno específico
    //callback é uma função passada a outra função como argumento
    setDadosAluno((prevDados) => { //setDadosAluno como uma função callback para atualizar o estado anterior(prevDados)
      return {
        ...prevDados, //operador spread(...) é usado para criar um cópia do objeto, para manter a propriedade inalterada
        alunos: prevDados.alunos.map((aluno) => //percorre cada item na array alunos
          aluno._id === dadosAtualizados._id ? dadosAtualizados : aluno
        ),
      };
    });
  };

  //Tudo relacionado as checkboxes da tabela
  const contarTotalCheckboxSelecionadas = () => {//calcula as checkbox marcadas em todas as paginas
    let totalSelecionados = 0;
    for (const pagina in checkboxSelecionadas) {//usando um loop "for", percorrendo cada propriedade definida como pagina no objeto checkboxSelecionadas
      totalSelecionados += Object.keys(checkboxSelecionadas[pagina]).length;//para cada página ele obtem o numero de chaves no checkboxSelecionadas em cada pagina, adicionando a contagem das checkbox na variável "totalSelecionados"
    }

    return totalSelecionados
  };

  const algumaCheckboxSelecionada = () => {// verifica se pelo menos uma checkbox está marcada em todas as páginas
    return contarTotalCheckboxSelecionadas() > 0;
  };

  const handleCheckboxSelecionada = (index, id) => (e) => {
    const isChecked = e.target.checked;

    setCheckboxSelecionadas((prev) => {
      const novaSelection = { ...prev };
      const paginaAtual = `page-${currentPage}`  // Obtém a chave da página atual para armazenar o estado das checkboxes

      if (!novaSelection[paginaAtual]) {//se a novaSelection não tiver uma propriedade key com pagina atual
        novaSelection[paginaAtual] = {} //criará um objeto vazio
      }
      if (isChecked) { // se a caixa de seleção estiver marcada (isChecked == true)
        novaSelection[paginaAtual][index] = true;//defini o valor como true, significando que a caixa de sleção fornecida "index" na página atual está marcada
        //set é uma estrutura de dados que armazena valores unicos, vou usar um set para que os ids não sejam duplicados
        setIdsSelecionados((prev) => {
          const novoSet = new Set(prev);
          novoSet.add(id);
          return Array.from(novoSet)
        })
      } else {//caso nao estiver marcada
        delete novaSelection[paginaAtual][index] //exclui a propriedade, significando que a caixa de seleção fornecida "index" está desmarcada
        //defini como o novo estado deve ser atualizado com base no estado anterior
        setIdsSelecionados((prev) => prev.filter((IdSelecionado) => IdSelecionado !== id))//.filter É um método de array em JavaScript que cria um novo array
      }
      return novaSelection;
    });
  };

  const handleSelecionarTudo = (e) => {
    const isChecked = e.target.checked; //verifica se a checkbox esta marcada
    const paginaAtual = `page-${currentPage}`; // Obtém a chave da página atual para armazenar o estado das checkboxes

    // Atualiza o estado de todasCheckboxSelecionadas com base na página atual e se está marcada ou não
    setTodasCheckboxSelecionadas((prev) => ({
      ...prev,
      [paginaAtual]: isChecked,
    }));

    // Atualiza o estado de checkboxSelecionadas com base na página atual e na seleção de "Selecionar tudo"
    setCheckboxSelecionadas((prev) => {
      const novaSelection = { ...prev };//estado anterior de checkboxSelecionadas

      if (isChecked) {
        novaSelection[paginaAtual] = {}; //Inicializa um objeto vazio para armazenar as checkboxes selecionadas na página atual.
        const novosIds = []

        //dadosAluno é o estado que contem os dados do aluno e alunos é a lista de array dos alunos
        dadosAluno.alunos.forEach((aluno, index) => {//itera sobre cada item de dadosAluno.alunos
          novaSelection[paginaAtual][index] = true; //define a checkbox como marcada na pagina atual
          novosIds.push(aluno._id);//adiciona o Id do aluno ao array de novosIds, que será usada em idsSelecionados
        });

        setIdsSelecionados((prev) => {//atualiza os ids dos alunos selecionados
          const novoSet = new Set(prev);//utiliza um conjunto Set para que não tenha ids duplicados
          //forEach percorre os itens de uma array
          novosIds.forEach((id) => novoSet.add(id));
          return Array.from(novoSet);
        })
      } else {
        delete novaSelection[paginaAtual];//remove a seleção da página atual
        setIdsSelecionados((prev) => prev.filter((id) => !dadosAluno.alunos.some((aluno) => aluno._id === id))); // Remove os IDs da página atual do estado idsSelecionados
      }

      return novaSelection
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
  const calculoLinhasVazias = 15 - dadosAluno.alunos.length;
  const dadosVazios = dadosAluno.alunos.length === 0;


  const formatarCPF = (cpf) => {
    if (cpf.length === 11) {

      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    }
    return cpf;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {algumaCheckboxSelecionada() ? ( // ? avalia a condição para retornar um dos dois valores
            <tr className="tr-body">
              <th>
                <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo} />
              </th>
              <th>{contarTotalCheckboxSelecionadas()} selecionados</th>
              <th colSpan={5} className="deletar-selecionados">
                <span onClick={handleExcluirSelecionados}>Deletar Selecionados</span>
              </th>
            </tr>
          ) : (
            <tr className="tr-body">
              <th>
                <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo} />
              </th>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Periodo</th>
              <th>CPF</th>
              <th>Professor</th>
              {(userLevel === '0') && (
                <th></th>
              )}
            </tr>
          )}
        </thead>
        <tbody className="table-body">
          {dadosVazios ? (
            <tr>
              <td colSpan="6" className="nenhum-Dado">
                Nenhum aluno encontrado.
              </td>
            </tr>
          ) : (Array.isArray(dadosAluno.alunos) &&
            dadosAluno.alunos.map((aluno, index) => (
              <tr key={aluno._id} >
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleCheckboxSelecionada(index, aluno._id)} // index é o item do secretário na lista
                    checked={checkboxSelecionadas[`page-${currentPage}`]?.hasOwnProperty(index) || false}// se o index estiver presente em checkboxSelecionadas para a página atual, marcar o checkbox
                  //hasOwnProperty -> esse método retorna um booleano indicando se o objeto possui uma propriedade específica, que no caso é o index
                  />
                </td>
                <td className="table-content" id="td-nome" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.nome}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.matricula}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.periodo}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(aluno)}>
                  {formatarCPF(aluno.cpf)}
                </td>
                <td className="table-content" id="td-prof" onClick={() => handleVisualizarClick(aluno)}>
                  {aluno.nomeProfessor}
                </td>
                {(userLevel === '0') && !algumaCheckboxSelecionada() && (
                  <>
                    <td>
                      <img
                        src={IconEditar}
                        alt="editar"
                        className="icon-editar"
                        onClick={() => handleEditarClick(aluno)}
                      />
                      <img
                        src={IconExcluir}
                        alt="excluir"
                        className="icon-excluir"
                        onClick={() => handleExcluirClick(aluno)}
                      />
                    </td>
                  </>
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
          {typeof message === 'string' ? message : ''}
        </Alert>

      </Snackbar>
      {isVisualizarOpen && (
        <VisualizarAluno
          handleCloseVisualizar={handleCloseVisualizar}
          dadosAluno={usuarioClick}
        />
      )}
      {isExcluirOpen && (
        <ExcluirAluno
          handleExcluirClose={handleExcluirClose}
          dadosAluno={usuarioClick}
          atualizarTableExcluir={() => {
            atualizarTableExcluir();

          }}
        />

      )}
      {isEditarOpen && (
        <EditarAluno
          handleEditarClose={handleEditarClose}
          dadosAluno={usuarioClick}
          renderDadosAluno={renderDadosAluno}
        />
      )}
    </div>
  );
}