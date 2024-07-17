import React, {useState, useEffect} from "react";
import { api } from "../../services/server";
import VisualizarProfessor from "../visualizar/professor";
import ExcluirProfessor from "../excluir/professor";
import EditarProfessor from "../editar/professor";
import IconEditar from "../../assets/editar-icon.svg";
import IconExcluir from "../../assets/excluir-icon.svg";
import paginacaoWhite from "../../assets/paginacao-white.svg";
import paginacaoBlack from "../../assets/paginacao-black.svg";
import "./style.css";

export default function TableProfessor({ renderFormTable, pesquisar }){
    const [isVisualizarOpen, setIsVisualizarOpen] = useState(false);
    const [isExcluirOpen, setIsExcluirOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [usuarioClick, setUsuarioClick] = useState({});
    const [dadosProfessor, setDadosProfessor] = useState({ professores: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProfessoresTable, setTotalProfessoresTable] = useState(0);
    const [acumularProfessoresPage, setAcumularProfessoresPage] = useState(0);
    const [checkboxSelecionadas, setCheckboxSelecionadas] = useState({}); // Novo estado para contagem de checkboxes selecionadas
    const [todasCheckboxSelecionadas, setTodasCheckboxSelecionadas] = useState({});
    const [idsSelecionados, setIdsSelecionados] = useState([]);

    useEffect(() => {
      receberDadosProfessor();
    }, [renderFormTable, currentPage, pesquisar]);

    const receberDadosProfessor = async () => {
      try {
        let dadosPaginados = `/professor/paginado?page=${currentPage}`;//numero de pagina atual para a api 
        if (pesquisar.trim() !== "") { //verifica se há algum valor no estado pesquisar, metodo trim remove espaços em branco.
          dadosPaginados = `/professor?q=${pesquisar}`; //se a verificação for vrdd, busca professor em pesquisar
        }

        const receberDados = await api.get(dadosPaginados);//requisação get para os "dadosPaginados" contruido
        console.log(receberDados)

        const { professores, totalPages, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
        console.log("quantidade total de itens: ", totalItems)

        //professor: lista de professores, e totalPages: numero total de paginas tudo retornado pela api
        setDadosProfessor({ professores }); //atualiza os dadosprofessores para os dados da minha api "professores"
        setTotalPages(totalPages); //atualiza o totalPages com o "total" retorndo da minha apis
        setTotalProfessoresTable(totalItems);

        const professoresAcumulados = ((currentPage - 1) * 15 + professores.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
        setAcumularProfessoresPage(professoresAcumulados);
      } catch (e) {
        console.log("Erro ao buscar dados do professor:", e);
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
      receberDadosProfessor();
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
    const renderDadosProfessor = (dadosAtualizados) => { //recebe um objeto "dadosAtualizados", contendo informações de um professor específico
      //callback é uma função passada a outra função como argumento
      setDadosProfessor((prevDados) => { //setDadosProfessor como uma função callback para atualizar o estado anterior(prevDados)
        return {
          ...prevDados, //operador spread(...) é usado para criar um cópia do objeto, para manter a propriedade inalterada
          professores: prevDados.professores.map((professor) => //percorre cada item na array professores
          professor._id === dadosAtualizados._id ? dadosAtualizados : professor
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

          //dadosProfessor é o estado que contem os dados do professor e professores é a lista de array dos professores
          dadosProfessor.professores.forEach((professor, index) => {//itera sobre cada item de dadosProfessor.professores
            novaSelection[paginaAtual][index] = true; //define a checkbox como marcada na pagina atual
            novosIds.push(professor._id);//adiciona o Id do professor ao array de novosIds, que será usada em idsSelecionados
          });

          setIdsSelecionados((prev) => {//atualiza os ids dos professores selecionados
            const novoSet = new Set(prev);//utiliza um conjunto Set para que não tenha ids duplicados
            //forEach percorre os itens de uma array
            novosIds.forEach((id) => novoSet.add(id));
            return Array.from(novoSet);
          })
        } else {
          delete novaSelection[paginaAtual];//remove a seleção da página atual
          setIdsSelecionados((prev) => prev.filter((id) => !dadosProfessor.professores.some((professor) => professor._id === id))); // Remove os IDs da página atual do estado idsSelecionados
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
    const calculoLinhasVazias = 15 - dadosProfessor.professores.length;
    return(
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
                <th>Disciplina</th>
                <th></th>
              </tr>
            )}
          </thead>
          <tbody className="table-body">
            {Array.isArray(dadosProfessor.professores) &&
              dadosProfessor.professores.map((professor, index) => (
                <tr key={professor._id} >
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={handleCheckboxSelecionada(index, professor._id)} // index é o item do secretário na lista
                      checked={checkboxSelecionadas[`page-${currentPage}`]?.hasOwnProperty(index) || false}// se o index estiver presente em checkboxSelecionadas para a página atual, marcar o checkbox
                      //hasOwnProperty -> esse método retorna um booleano indicando se o objeto possui uma propriedade específica, que no caso é o index
                    />
                  </td>
                  <td className="table-content" id="td-nome" onClick={() => handleVisualizarClick(professor)}>
                    {professor.nome}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(professor)}>
                    {professor.telefone}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(professor)}>
                    {professor.email}
                  </td>
                  <td className="table-content" onClick={() => handleVisualizarClick(professor)}>
                    {professor.cpf}
                  </td>
                  <td className="table-content" id="td-disciplina" onClick={() => handleVisualizarClick(professor)}>
                    {professor.disciplina}
                  </td>
                  <td>
                    <img
                      src={IconEditar}
                      alt="editar"
                      className="icon-editar"
                      onClick={() => handleEditarClick(professor)}
                    />
                    <img
                      src={IconExcluir}
                      alt="excluir"
                      className="icon-excluir"
                      onClick={() => handleExcluirClick(professor)}
                    />
                  </td>
                </tr>
              ))}
            {calculoLinhasVazias > 0 && renderLinhasVazias(calculoLinhasVazias)}
          </tbody>
          <tfoot className="footer-table">
            <tr>
              <td colSpan="7">
                <div className="quantidade-itens">
                  <span>
                    {Array.isArray(dadosProfessor.professores) &&
                      `${acumularProfessoresPage}/${totalProfessoresTable}`}
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
          <VisualizarProfessor
            handleCloseVisualizar={handleCloseVisualizar}
            dadosProfessor={usuarioClick}
          />
        )}
        {isExcluirOpen && (
          <ExcluirProfessor 
          handleExcluirClose={handleExcluirClose} 
          dadosProfessor={usuarioClick}  
          atualizarTableExcluir={() => {
            atualizarTableExcluir();
            setCheckboxSelecionadas({});
            setTodasCheckboxSelecionadas({});
          }}
          />
          
        )}
        {isEditarOpen && (
          <EditarProfessor
            handleEditarClose={handleEditarClose}
            dadosProfessor={usuarioClick}
            renderDadosProfessor={renderDadosProfessor}
          />
        )}
      </div>
    );
}