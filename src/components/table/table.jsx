  import React, { useState, useEffect } from "react";
  import { api } from "../../services/server";
  import paginacaoWhite from "../../assets/paginacao-white.svg";
  import paginacaoBlack from "../../assets/paginacao-black.svg";
  import VisualizarSecretario from "../visualizar/secretario";
  import Excluir from "../excluir/excluir";
  import Editar from "../editar/editar";
  import editar from "../../assets/editar-icon.svg";
  import excluir from "../../assets/excluir-icon.svg";
  import "./style.css";

  export default function Table({ renderFormTable, pesquisar }) {
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

    useEffect(() => {
      receberDadosSecretario();
    }, [renderFormTable, currentPage, pesquisar]);

    const receberDadosSecretario = async () => {
      try {
        let dadosPaginados = `/secretario/paginado?page=${currentPage}`;//numero de pagina atual para a api 
        if (pesquisar.trim() !== "") { //verifica se há algum valor no estado pesquisar, metodo trim remove espaços em branco.
          dadosPaginados = `/secretario?q=${pesquisar}`; //se a verificação for vrdd, busca secretario em pesquisar
        }

        const receberDados = await api.get(dadosPaginados);//requisação get para os "dadosPaginados" contruido
        const { secretarios, totalPages: total, totalItems } = receberDados.data; //resposta da api é um objeto com os dados da requisição
        //secretario: lista de secretarios, e totalPages: numero total de paginas tudo retornado pela api
        setDadosSecretario({ secretarios }); //atualiza os dadosSecretarios para os dados da minha api "secretarios"
        setTotalPages(total); //atualiza o totalPages com o "total" retorndo da minha apis
        setTotalSecretariosTable(totalItems);

        const secretariosAcumulados = ((currentPage - 1) * 15 + secretarios.length) /* se estamos na pagina 1, currentPage - 1 será 0 e 0 * 15 é 0. E assim por diante */
        setAcumularSecretariosPage(secretariosAcumulados);
      } catch (e) {
        console.log("Erro ao buscar dados do secretário:", e);
      }
    };

    const handleCheckboxSelecionada = (index) => (e) => {
      const isChecked = e.target.checked;

      setCheckboxSelecionadas((prev) => {
        const novaSelection = { ...prev };
        const paginaAtual = `page-${currentPage}` //page-pagina atual
        
        if(!novaSelection[paginaAtual]) {//se a novaSelection não tiver  uma propriedade key com pagina atual
          novaSelection[paginaAtual] = {};//criará um objeto vazio 
        } 
        if(isChecked) { // se a caixa de seleção estiver marcada (isChecked == true)
          novaSelection[paginaAtual][index] = true;//defini o valor como true, significando que a caixa de sleção fornecida "index" na página atual está marcada
        } else {//caso nao estiver marcada
          delete novaSelection[paginaAtual][index] //exclui a propriedade, significando que a caixa de seleção fornecida "index" está desmarcada
        }
        return novaSelection;
      }); 
    };

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

    const handleSelecionarTudo = (e) => {
      const isChecked = e.target.checked;
      const paginaAtual = `page-${currentPage}`;

      setTodasCheckboxSelecionadas((prev) => ({
        ...prev,
        [paginaAtual]: isChecked,
      }));

      setCheckboxSelecionadas((prev) => {
        const novaSelection = { ...prev };

        if(isChecked) {
          novaSelection [paginaAtual] = {};

          //dadosSecretario é o estado que contem os dados do secretario e secretarios é a lista de array dos secretarios
          dadosSecretario.secretarios.forEach((secretario, index) => {
            novaSelection[paginaAtual][index] = true;
          });
        } else {
          delete novaSelection[paginaAtual];
        }

        return novaSelection
      });
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

    const atualizarTableExcluir = () => {
      receberDadosSecretario();
    }
    const handleExcluirClose = () => {
      setIsExcluirOpen(false);
    };

    const handleEditarClick = (originalData) => {
      setUsuarioClick(originalData);
      setIsEditarOpen(true);
    };

    const handleEditarClose = () => {
      setIsEditarOpen(false);
    };

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
            <td colSpan="7">&nbsp;</td>
          </tr>
        );
      }
      return linhasVazias;
    };
    //calcula quantas linhas vazias são necessárias para preencher ate um total de 15 linhas
    const calculoLinhasVazias = 15 - dadosSecretario.secretarios.length;

    return (
      <div className="table-container">
        <table className="table-secretario">
          <thead>
            {algumaCheckboxSelecionada() ? ( // ? avalia a condição para retornar um dos dois valores
              <tr className="tr-body">
                <th>
                  <input type="checkbox" className="checkbox" checked={todasCheckboxSelecionadas[`page-${currentPage}`] || false} onChange={handleSelecionarTudo}/>
                </th>
                <th>{contarTotalCheckboxSelecionadas()} selecionados</th>
                <th colSpan={5} className="deletar-selecionados">
                  <span onClick={handleExcluirClick}>Deletar Selecionados</span>
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
          <tbody className="body-table-secretario">
            {Array.isArray(dadosSecretario.secretarios) &&
              dadosSecretario.secretarios.map((dados, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={handleCheckboxSelecionada(index)} // index é o item do secretário na lista
                      checked={checkboxSelecionadas[`page-${currentPage}`]?.hasOwnProperty(index) || false}// se o index estiver presente em checkboxSelecionadas para a página atual, marcar o checkbox
                      //hasOwnProperty -> esse método retorna um booleano indicando se o objeto possui uma propriedade específica, que no caso é o index
                    />
                  </td>
                  <td className="body-table" onClick={() => handleVisualizarClick(dados)}>
                    {dados.nome}
                  </td>
                  <td className="body-table" onClick={() => handleVisualizarClick(dados)}>
                    {dados.telefone}
                  </td>
                  <td className="body-table" onClick={() => handleVisualizarClick(dados)}>
                    {dados.email}
                  </td>
                  <td className="body-table" onClick={() => handleVisualizarClick(dados)}>
                    {dados.cpf}
                  </td>
                  <td className="body-table" onClick={() => handleVisualizarClick(dados)}>
                    {dados.turno}
                  </td>
                  <td>
                    <img
                      src={editar}
                      alt="editar"
                      className="icon-editar"
                      onClick={() => handleEditarClick(dados)}
                    />
                    <img
                      src={excluir}
                      alt="excluir"
                      className="icon-excluir"
                      onClick={() => handleExcluirClick(dados)}
                    />
                  </td>
                </tr>
              ))}
            {calculoLinhasVazias > 0 && renderLinhasVazias(calculoLinhasVazias)}
          </tbody>
          <tfoot className="footer-table-secretario">
            <tr>
              <td>
                <div className="quantidade-secretario">
                  {Array.isArray(dadosSecretario.secretarios) &&
                    `${acumularSecretariosPage}/${totalSecretariosTable}`}
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="7">
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
          <Excluir handleExcluirClose={handleExcluirClose} dadosSecretario={usuarioClick}  atualizarTableExcluir={atualizarTableExcluir} />
          
        )}
        {isEditarOpen && (
          <Editar
            handleEditarClose={handleEditarClose}
            dadosSecretario={usuarioClick}
            renderDadosSecretario={renderDadosSecretario}
          />
        )}
      </div>
    );
  }
