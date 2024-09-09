import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import VisualizarSecretario from "../visualizar/secretario";
import ExcluirSecretario from "../excluir/secretario";
import EditarSecretario from "../editar/secretario";
import IconEditar from "../../assets/editar-icon.svg";
import IconExcluir from "../../assets/excluir-icon.svg";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

export default function TableSecretario({ renderFormTable, pesquisar, filtrarPesquisa }) {
  const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
  const [isExcluirOpen, setIsExcluirOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [usuarioClick, setUsuarioClick] = useState({});
  const [dadosSecretario, setDadosSecretario] = useState({ secretarios: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSecretariosTable, setTotalSecretariosTable] = useState(0);
  const [acumularSecretariosPage, setAcumularSecretariosPage] = useState(0);
  const [checkboxSelecionadas, setCheckboxSelecionadas] = useState({}); // Novo estado para contagem de checkboxes selecionadas
  const [todasCheckboxSelecionadas, setTodasCheckboxSelecionadas] = useState({});
  const [idsSelecionados, setIdsSelecionados] = useState([]);

  useEffect(() => {
    receberDadosSecretario();
  }, [renderFormTable, currentPage, pesquisar, filtrarPesquisa]);
  console.log(filtrarPesquisa)

  const receberDadosSecretario = async() => {
    const token = localStorage.getItem("user_token")
    console.log(token)
    try {
      let dadosPaginados = `/secretario?page=${currentPage}`;//numero de pagina atual para a api 

      // filtro de pesquisa
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
      if (filtrarPesquisa.turno) {
        filtrar += `&turno=${filtrarPesquisa.turno}`;
      }
      if(filtrar.length > 0){
        dadosPaginados += `&${filtrar}`
      }

      // autorização do get de secretario
      const receberDados = await api.get(dadosPaginados ,{
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });//requisação get para os "dadosPaginados" contruidos
      console.log(receberDados)

      const { secretarios, totalPages, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
      console.log("quantidade total de itens: ", totalItems)
      //secretario: lista de secretarios, e totalPages: numero total de paginas tudo retornado pela api
      setDadosSecretario({ secretarios }); //atualiza os dadosSecretarios para os dados da minha api "secretarios"
      setTotalPages(totalPages); //atualiza o totalPages com o "total" retorndo da minha apis
      setTotalSecretariosTable(totalItems);

      const secretariosAcumulados = ((currentPage - 1) * 15 + secretarios.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
      setAcumularSecretariosPage(secretariosAcumulados);
    } catch (e) {
      console.log("Erro ao buscar dados do secretário:", e);
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
    receberDadosSecretario();
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
  const renderDadosSecretario = (dadosAtualizados) => { //recebe um objeto "dadosAtualizados", contendo informações de um secretario específico
    //callback é uma função passada a outra função como argumento
    setDadosSecretario((prevDados) => { //setDadosSecretario como uma função callback para atualizar o estado anterior(prevDados)
      return {
        ...prevDados, //operador spread(...) é usado para criar um cópia do objeto, para manter a propriedade inalterada
        secretarios: prevDados.secretarios.map((secretario) => //percorre cada item na array secretarios
        secretario._id === dadosAtualizados._id ? dadosAtualizados : secretario
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
      
      if(!novaSelection[paginaAtual]) {//se a novaSelection não tiver uma propriedade key com pagina atual
        novaSelection[paginaAtual] = {} //criará um objeto vazio
      } 
      if(isChecked) { // se a caixa de seleção estiver marcada (isChecked == true)
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

      if(isChecked) {
        novaSelection [paginaAtual] = {}; //Inicializa um objeto vazio para armazenar as checkboxes selecionadas na página atual.
        const novosIds = []

        //dadosSecretario é o estado que contem os dados do secretario e secretarios é a lista de array dos secretarios
        dadosSecretario.secretarios.forEach((secretario, index) => {//itera sobre cada item de dadosSecretario.secretarios
          novaSelection[paginaAtual][index] = true; //define a checkbox como marcada na pagina atual
          novosIds.push(secretario._id);//adiciona o Id do secretario ao array de novosIds, que será usada em idsSelecionados
        });

        setIdsSelecionados((prev) => {//atualiza os ids dos secretarios selecionados
          const novoSet = new Set(prev);//utiliza um conjunto Set para que não tenha ids duplicados
          //forEach percorre os itens de uma array
          novosIds.forEach((id) => novoSet.add(id));
          return Array.from(novoSet);
        })
      } else {
        delete novaSelection[paginaAtual];//remove a seleção da página atual
        setIdsSelecionados((prev) => prev.filter((id) => !dadosSecretario.secretarios.some((secretario) => secretario._id === id))); // Remove os IDs da página atual do estado idsSelecionados
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
  const calculoLinhasVazias = 15 - dadosSecretario.secretarios.length;
  const dadosVazios = dadosSecretario.secretarios.length === 0;


  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {algumaCheckboxSelecionada() ? ( // ? avalia a condição para retornar um dos dois valores
            <tr className="tr-body">
              <th>
                <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo}/>
              </th>
              <th>{contarTotalCheckboxSelecionadas()} selecionados</th>
              <th colSpan={5} className="deletar-selecionados">
                <span onClick={handleExcluirSelecionados}>Deletar Selecionados</span>
              </th>
            </tr>
          ) : (
            <tr className="tr-body">
              <th>
                <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo}/>
              </th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Turno</th>
              <th></th>
            </tr>
          )}
        </thead>
        <tbody className="table-body">
          {dadosVazios ? (
            <tr>
              <td colSpan="6" className="nenhum-Dado">
                  Nenhum secretario encontrado.
              </td>
            </tr>
          ) : (Array.isArray(dadosSecretario.secretarios) &&
            dadosSecretario.secretarios.map((secretario, index) => (
              <tr key={secretario._id} >
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleCheckboxSelecionada(index, secretario._id)} // index é o item do secretário na lista
                    checked={checkboxSelecionadas[`page-${currentPage}`]?.hasOwnProperty(index) || false}// se o index estiver presente em checkboxSelecionadas para a página atual, marcar o checkbox
                    //hasOwnProperty -> esse método retorna um booleano indicando se o objeto possui uma propriedade específica, que no caso é o index
                  />
                </td>
                <td className="table-content" id="td-nome" onClick={() => handleVisualizarClick(secretario)}>
                  {secretario.nome}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(secretario)}>
                  {secretario.telefone}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(secretario)}>
                  {secretario.email}
                </td>
                <td className="table-content" onClick={() => handleVisualizarClick(secretario)}>
                  {secretario.cpf}
                </td>
                <td className="table-content" id="td-turno" onClick={() => handleVisualizarClick(secretario)}>
                  {secretario.turno}
                </td>
                <td>
                  <img
                    src={IconEditar}
                    alt="editar"
                    className="icon-editar"
                    onClick={() => handleEditarClick(secretario)}
                  />
                  <img
                    src={IconExcluir}
                    alt="excluir"
                    className="icon-excluir"
                    onClick={() => handleExcluirClick(secretario)}
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
                  {Array.isArray(dadosSecretario.secretarios) &&
                    `${acumularSecretariosPage}/${totalSecretariosTable}`}
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
        <VisualizarSecretario
          handleCloseVisualizar={handleCloseVisualizar}
          dadosSecretario={usuarioClick}
        />
      )}
      {isExcluirOpen && (
        <ExcluirSecretario 
        handleExcluirClose={handleExcluirClose} 
        dadosSecretario={usuarioClick}  
        atualizarTableExcluir={() => {
          atualizarTableExcluir();
          setCheckboxSelecionadas({});
          setTodasCheckboxSelecionadas({});
        }}
        />
        
      )}
      {isEditarOpen && (
        <EditarSecretario
          handleEditarClose={handleEditarClose}
          dadosSecretario={usuarioClick}
          renderDadosSecretario={renderDadosSecretario}
        />
      )}
    </div>
  );
}
