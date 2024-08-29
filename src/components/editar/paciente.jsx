import React, {useState, useEffect} from "react";
import { api } from "../../services/server";
import {IMaskInput} from "react-imask";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css";

export default function EditarPaciente({handleEditarClose, dadosPaciente, renderDadosPaciente}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [alunosNome, setAlunosNome] = useState({ alunos: []})
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState({});
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosPaciente);
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
        buscarAlunos();
    }, [])

    const calcularIdade = (dataNascimento) => {
        const dataAtual = new Date(); 
        const dataAniversario = new Date(dataNascimento); //converte o argumento fornecido para um objeto date

        let idade = dataAtual.getFullYear() - dataAniversario.getFullYear();
        const mes = dataAtual.getMonth() + 1
        console.log(mes)
        if(mes < dataAniversario.getMonth() || (mes === dataAniversario.getMonth() && dataAtual.getDate() < dataAniversario.getDate())){
            idade --;
        }
        return idade;
    }    

    const handleEditarConfirmar = (newState) => () => {
        const idade = calcularIdade(dadosAtualizados.dataNascimento)
        if (dadosAtualizados.nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome completo.");
        } else if (!cpf.isValid(dadosAtualizados.cpf)){
            setState({ ...newState, open: true }); 
            setMessage("Insira um cpf válido.");
        } else if (!validator.isDate(dadosAtualizados.dataNascimento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira uma data de nascimento.");
        } else if (dadosAtualizados.sexo === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um sexo.");
        } else if (!validator.isEmail(dadosAtualizados.email)){
            setState({ ...newState, open: true });
            setMessage("Insira um email válido.");
        } else if (dadosAtualizados.telefoneContato.length != 15){
            setState({ ...newState, open: true }); 
            setMessage("Insira um telefone válido.");
        } else if (dadosAtualizados.estadoCivil === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um estado civil.");
        } else if(dadosAtualizados.profissao <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma profissao.");
        } else if(dadosAtualizados.religiao <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma religião.");
        } else if (dadosAtualizados.rendaFamiliar === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione uma renda.");
        } else if(dadosAtualizados.nacionalidade <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma nacionalidade.");
        } else if(dadosAtualizados.naturalidade <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma naturalidade.");
        } else if(idade < 18 && dadosAtualizados.nomeDoContatoResponsavel.length <= 4){
            setState({ ...newState, open: true }); 
            setMessage("Insira o nome do contato/responsável.");
        } else if(idade < 18 && dadosAtualizados.outroContato.length != 15){
            setState({ ...newState, open: true }); 
            setMessage("Insira um telefone do contato/responsável válido.");
        }  else if (dadosAtualizados.enderecoCep === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um cep.");
        } else if (dadosAtualizados.enderecoLogradouro === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Logradouro.");
        } else if (dadosAtualizados.enderecoBairro === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Bairro.");
        } else if (dadosAtualizados.enderecoCidade === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Cidade.");
        } else if (dadosAtualizados.enderecoUF === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione uma Unidade Federativa.");
        } else if (!dadosAtualizados.alunoUnieva && !dadosAtualizados.funcionarioUnieva){
            setState({ ...newState, open: true });
            setMessage("Selecione um encaminhador.");
        } else if(dadosAtualizados.encaminhador === "" && dadosAtualizados.alunoUnieva){
            setState({ ...newState, open: true });
            setMessage("Selecione o AlunoUnieva");
        } else if(dadosAtualizados.encaminhador.length <= 4 && dadosAtualizados.funcionarioUnieva) {
            setState({ ...newState, open: true });
            setMessage("Insira o funcionario");
        } else if (!validator.isDate(dadosAtualizados.dataInicioTratamento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira a data do início do tratamento.");
        } else if (!validator.isDate(dadosAtualizados.dataTerminoTratamento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira a data do término do tratamento.");
        } else if (dadosAtualizados.tipoDeTratamento === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um tipo de tratamento.");
        } else {
            setIsEditarConfirmar(true);
            setEditar(false);
        }
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = async() => {
      const token = localStorage.getItem("user_token")
      try {
          await api.patch(`/paciente/${dadosAtualizados._id}`, dadosAtualizados, {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });

        setSucessoEditar(true);
        renderDadosPaciente(dadosAtualizados);
      } catch (e){
        console.log("Erro ao atualizar dados:", e)
      }
    };

    const buscarAlunos = async() => {
        const token = localStorage.getItem("user_token")
        console.log(1)
        try {
            const selectAlunos = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            console.log(selectAlunos)
            setAlunosNome(selectAlunos.data);
        } catch (e) {
            console.log("Erro ao buscar alunos: ", e)
        }
    }

  return (
    <>
    {Editar && (
      <div className="modal-editar">
        <div className="modal-content-editar modal-content-editar-paciente">
          <h2>Editar Paciente</h2>
          <hr />
          <div className="formulario">
            <h2>Informações pessoais</h2>
            <div className="flex-informacoes-pessoais">
                <div className="div-flex">
                    <label htmlFor="Nome">Nome Completo*</label>
                    <input type="text" className="nome-completo" id="nome" value={dadosAtualizados.nome} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, nome:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="CPF">CPF*</label>
                    <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosAtualizados.cpf} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, cpf:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="data-nascimento">Data de nascimento*</label>
                    <DatePicker 
                    className="data-nascimento"
                    format="dd/MM/yyyy"
                    // value={dadosAtualizados.dataNascimento}
                    onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, dataNascimento: e})}
                    />
                </div>
                <div className="div-flex">
                    <label htmlFor="sexo">Sexo*</label>
                    <select className="sexo" name="sexo" id="sexo" 
                    value={dadosAtualizados.sexo} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, sexo: e.target.value})}
                    >
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="prefiro nao informar">Prefiro não informar</option>
                    </select>
                </div>
            </div>
            <div className="flex-informacoes-pessoais">
                <div className="div-flex">
                    <label htmlFor="Email">Email*</label>
                    <input type="email" className="email" id="email"
                        value={dadosAtualizados.email} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, email:e.target.value})} 
                        />
                    </div>  
                <div className="div-flex">
                    <label htmlFor="Telefone">Telefone*</label>
                    <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosAtualizados.telefoneContato} onChange={(e) => setDadosAtualizados({...dadosAtualizados, telefoneContato:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="estado-civil">Estado civil*</label>
                    <select className="estado-civil" name="estado-civil" id="estado-civil"
                        value={dadosAtualizados.estadoCivil} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, estadoCivil: e.target.value})}
                        >
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="solteiro">Solteiro</option>
                        <option value="casado">Casado</option>
                        <option value="separado">Separado</option>
                        <option value="divorciado">Divorciado</option>
                        <option value="viuvo">Viúvo</option>
                    </select>
                </div>
                <div className="div-flex">
                    <label htmlFor="profissao">Profissão*</label>
                    <input type="text" className="profissao" id="profissao" value={dadosAtualizados.profissao} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, profissao:e.target.value})} />
                </div>
            </div>
            <div className="flex-informacoes-pessoais">
                <div className="div-flex">
                    <label htmlFor="religiao">Religião*</label>
                    <input type="text" className="religiao" id="religiao" value={dadosAtualizados.religiao} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, religiao:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="renda">Renda Familiar*</label>
                    <select className="renda" name="renda" id="renda" value={dadosAtualizados.rendaFamiliar} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, rendaFamiliar:e.target.value})} >
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="Menos de R$500">Menos de R$500</option>
                        <option value="R$500 - $999">R$500 - $999</option>
                        <option value="R$1,000 - R$1,999">R$1,000 - R$1,999</option>
                        <option value="R$2,000 - R$2,999">R$2,000 - R$2,999</option>
                        <option value="R$3,000 - R$4,999">R$3,000 - R$4,999</option>
                        <option value="R$5,000 ou mais">R$5,000 ou mais</option>
                    </select>
                </div>
                <div className="div-flex">
                    <label htmlFor="nacionalidade">Nacionalidade*</label>
                    <input type="text" className="nacionalidade" id="nacionalidade" value={dadosAtualizados.nacionalidade} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, nacionalidade:e.target.value})} />
                </div>
                <div className="div-flex-naturalidade">
                    <label htmlFor="naturalidade">Naturalidade*</label>
                    <input type="text" className="naturalidade" id="naturalidade" value={dadosAtualizados.naturalidade} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, naturalidade:e.target.value})} />
                </div>
            </div>
            <div className="flex-informacoes-pessoais">
                <div className="div-flex">
                    <label htmlFor="nome-contato">Nome do contato/responsável</label>
                    <input type="text" className="nome-contato" id="nome-contato" value={dadosAtualizados.nomeDoContatoResponsavel} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, nomeDoContatoResponsavel:e.target.value})}/>
                </div>
                <div className="div-flex">
                    <label htmlFor="outro">Telefone contato/responsável</label>
                    <IMaskInput type="text" className="outro" id="outro" mask="(00)0 0000-0000" value={dadosAtualizados.outroContato} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, outroContato:e.target.value})} />
                </div>
                
            </div>

            <h2>Endereço</h2>

            <div className="flex-endereco">
                <div className="div-flex">
                    <label htmlFor="cep">CEP*</label>
                    <IMaskInput type="text" className="cep" id="cep" mask="00000-000" value={dadosAtualizados.enderecoCep} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoCep:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="logradouro">Logradouro*</label>
                    <input type="text" className="logradouro" id="logradouro" value={dadosAtualizados.enderecoLogradouro} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoLogradouro:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="bairro">Bairro*</label>
                    <input type="text" className="bairro" id="bairro" value={dadosAtualizados.enderecoBairro} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoBairro:e.target.value})} />
                </div>
            </div>
            <div className="flex-endereco">
                <div className="div-flex">
                    <label htmlFor="cidade">Cidade*</label>
                    <input type="text" className="cidade" id="cidade" value={dadosAtualizados.enderecoCidade} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoCidade:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="complemento">Complemento</label>
                    <input type="text" className="complemento" id="complemento" value={dadosAtualizados.enderecoComplemento} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoComplemento:e.target.value})} />
                </div>
                <div className="div-flex">
                    <label htmlFor="uf">UF*</label>
                    <select className="uf" name="uf" id="uf"
                        value={dadosAtualizados.enderecoUF} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, enderecoUF: e.target.value})}
                        >
                        <option value="" disabled></option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                    </select>
                </div>
            </div>

            <h2>Informações de tratamento</h2>

            <div className="flex-informacoes-tratamento">
                <div className="div-flex">
                    <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                    {dadosAtualizados.alunoUnieva ? (
                        <select 
                        className="encaminhadorSelect" id="encaminhadorSelect" 
                        value={dadosAtualizados.encaminhador} 
                        onChange={(e) => setDadosAtualizados({...dadosAtualizados, encaminhador: e.target.value})} 
                        disabled={!dadosAtualizados.alunoUnieva}
                        >
                            <option value="" disabled>Selecione uma opção</option>
                            { alunosNome.alunos.map(aluno => (
                            <option 
                            key={aluno.nome} 
                            value={aluno.nome}>
                            {aluno.nome}    
                            </option>
                            ))}
                        </select>
                    ) : (
                        <input type="text" className="encaminhadorInput" id="encaminhadorInput" 
                        value={dadosAtualizados.encaminhador} 
                        onChange={(e) => setDadosAtualizados({...dadosAtualizados, encaminhador: e.target.value})} 
                        disabled={!dadosAtualizados.funcionarioUnieva} 
                        />
                    )}
                </div>
                <div className="div-flex">
                    <label htmlFor="status">Status Encaminhador*</label>
                    <select className="status" name="status" id="status"
                    value={dadosAtualizados.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosAtualizados.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : dadosAtualizados.encaminhador ? "" : ""}
                    onChange={(e) => {setDadosAtualizados({...dadosAtualizados, alunoUnieva: e.target.value === "Aluno da UniEVANGÉLICA", funcionarioUnieva: e.target.value === "Funcionário da Associação Educativa Evangélica", encaminhador: ""})}}>
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="Aluno da UniEVANGÉLICA">Aluno da UniEVANGÉLICA</option>
                        <option value="Funcionário da Associação Educativa Evangélica">Funcionário da Associação Educativa Evangélica</option>
                    </select>
                </div>
            </div>
            <div className="flex-informacoes-tratamento">
                <div className="div-flex">
                    <label htmlFor="inicio-tratamento">Início do Tratamento*</label>
                    <DatePicker 
                    className="inicio-tratamento"
                    format="dd/MM/yyyy"
                    // value={dadosAtualizados.dataNascimento}
                    onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, dataInicioTratamento: e})}
                    />
                </div>
                <div className="div-flex">
                    <label htmlFor="termino-tratamento">Término do tratamento*</label>
                    <DatePicker 
                    className="termino-tratamento"
                    format="dd/MM/yyyy"
                    // value={dadosAtualizados.dataNascimento}
                    onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, dataTerminoTratamento: e})}
                    />
                </div>
                <div className="div-flex">
                    <label htmlFor="tratamento">Tipo de tratamento*</label>
                    <select className="tratamento" name="tratamento" id="tratamento" value={dadosAtualizados.tipoDeTratamento} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, tipoDeTratamento:e.target.value})}>
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="psicoterapia">Psicoterapia</option>
                        <option value="plantao">Plantão</option>
                        <option value="psicodiagnostico">Psicodiagnóstico</option>
                        <option value="avaliacao diagnostica">Avaliação diagnóstica</option>
                    </select>
                </div>
            </div>
            <div className="buttons-form">
              <button className="button-cancelar" id="voltar" onClick={handleEditarClose}>
                Cancelar
              </button>
              <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>
                Confirmar
              </button>
              <Snackbar
                  ContentProps={{sx: {borderRadius: '8px'}}}
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
            </div>
          </div>
        </div>  
      </div>
    )}
      {isEditarConfirmar && (
        <div className="modal-confirmar">
            <div className="modal-content-confirmar modal-content-confirmar-paciente">
                <h2>Confirmar Edição de Paciente</h2>
                <hr />
                <div className="dados-inseridos">
                  <div className="coluna1">
                    <div className="nome">
                        <p>Nome Completo</p>
                        <h1>{dadosAtualizados.nome}</h1>
                    </div>
                  </div> 
                  <div className="coluna2">
                      <div className="CPF">
                          <p>CPF</p>
                          <h1>{dadosAtualizados.cpf}</h1>
                      </div>
                      <div className="telefone">
                          <p>Telefone</p>
                          <h1>{dadosAtualizados.telefone}</h1>
                      </div>
                  </div>
                  <div className="coluna3">
                    <div className="email">
                      <p>E-mail</p>
                      <h1>{dadosAtualizados.email}</h1>
                    </div>
                  </div>
                  <div className="coluna4">
                    <div className="disciplina">
                      <p>Disciplina</p>
                      <h1>{dadosAtualizados.disciplina}</h1>
                    </div>  
                  </div>
                     
                </div> 
                <div className="buttons-confirmar buttons-confirmar-paciente">
                  <button className="button-voltar-confirmar" id="voltar" onClick={handleVoltarConfirmar} >
                    Voltar
                  </button>
                  <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleSucessoConfirmar}>
                    Confirmar
                  </button>
                </div> 
            </div>
        </div>
      )}
      {SucessoEditar && (
        <div className="modal-sucesso">
          <div className="modal-sucesso-content">
              <h1>Sucesso!</h1>
              <h2>Paciente atualizado com sucesso.</h2>
              <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
          </div>
        </div>
      )}
    </>
    
  );
}
