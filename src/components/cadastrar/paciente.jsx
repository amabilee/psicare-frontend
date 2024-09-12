import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css"

export default function CadastrarPaciente({ handleCloseModal, renderForm }){
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [alunosNome, setAlunosNome] = useState({ alunos: []})
    const [dadosForm, setDadosForm] = useState({  
        nome: "",
        cpf: "",
        dataNascimento: "",
        email: "",
        telefoneContato: "",
        sexo: "",
        estadoCivil: "",
        religiao: "",
        rendaFamiliar: "",
        profissao: "",
        outroContato: "",
        nomeDoContatoResponsavel: "",
        naturalidade: "",
        nacionalidade: "",
        enderecoCep: "",
        enderecoLogradouro: "",
        enderecoBairro: "",
        enderecoComplemento: "",
        enderecoCidade: "",
        enderecoUF: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        encaminhador: "",
        tipoDeTratamento: "",
        alunoUnieva: false,
        funcionarioUnieva: false,
        ativoPaciente: true,
        alunoId: ""
    });    


    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });

    const { vertical, horizontal, open } = state;

    useEffect(() => {
        buscarAlunos();
    }, [])

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const calcularIdade = (dataNascimento) => {
        const dataAtual = new Date(); 
        const dataAniversario = new Date(dataNascimento); //converte o argumento fornecido para um objeto date

        let idade = dataAtual.getFullYear() - dataAniversario.getFullYear();
        const mes = dataAtual.getMonth() + 1
        if(mes < dataAniversario.getMonth() || (mes === dataAniversario.getMonth() && dataAtual.getDate() < dataAniversario.getDate())){
            idade --;
        }
        return idade;
    }    

    const HandleFormSubmit = (newState) => async() => {
        const idade = calcularIdade(dadosForm.dataNascimento)
        
        if (dadosForm.nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome completo.");
        } else if (!cpf.isValid(dadosForm.cpf)){
            setState({ ...newState, open: true }); 
            setMessage("Insira um cpf válido.");
        } else if (!validator.isDate(dadosForm.dataNascimento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira uma data de nascimento.");
        } else if (dadosForm.sexo === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um sexo.");
        } else if (!validator.isEmail(dadosForm.email)){
            setState({ ...newState, open: true });
            setMessage("Insira um email válido.");
        } else if (dadosForm.telefoneContato.length != 15){
            setState({ ...newState, open: true }); 
            setMessage("Insira um telefone válido.");
        } else if (dadosForm.estadoCivil === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um estado civil.");
        } else if(dadosForm.profissao <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma profissao.");
        } else if(dadosForm.religiao <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma religião.");
        } else if (dadosForm.rendaFamiliar === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione uma renda.");
        } else if(dadosForm.nacionalidade <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma nacionalidade.");
        } else if(dadosForm.naturalidade <= 4){
            setState({ ...newState, open: true });
            setMessage("Selecione uma naturalidade.");
        } else if(idade < 18 && dadosForm.nomeDoContatoResponsavel.length <= 4){
            setState({ ...newState, open: true }); 
            setMessage("Insira o nome do contato/responsável.");
        } else if(idade < 18 && dadosForm.outroContato.length != 15){
            setState({ ...newState, open: true }); 
            setMessage("Insira um telefone do contato/responsável válido.");
        }  else if (dadosForm.enderecoCep === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um cep.");
        } else if (dadosForm.enderecoLogradouro === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Logradouro.");
        } else if (dadosForm.enderecoBairro === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Bairro.");
        } else if (dadosForm.enderecoCidade === ""){
            setState({ ...newState, open: true });
            setMessage("Insira um Cidade.");
        } else if (dadosForm.enderecoUF === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione uma Unidade Federativa.");
        } else if (!dadosForm.alunoUnieva && !dadosForm.funcionarioUnieva){
            setState({ ...newState, open: true });
            setMessage("Selecione um encaminhador.");
        } else if(!dadosForm.alunoId === "" && dadosForm.alunoUnieva){
            setState({ ...newState, open: true });
            setMessage("Selecione o AlunoUnieva");
        } else if(dadosForm.encaminhador.length <= 4 && dadosForm.funcionarioUnieva) {
            setState({ ...newState, open: true });
            setMessage("Insira o funcionario");
        } else if (!validator.isDate(dadosForm.dataInicioTratamento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira a data do início do tratamento.");
        }
        else if (!validator.isDate(dadosForm.dataTerminoTratamento)){
            setState({ ...newState, open: true }); 
            setMessage("Insira a data do término do tratamento.");
        }else if (dadosForm.tipoDeTratamento === ""){
            setState({ ...newState, open: true });
            setMessage("Selecione um tipo de tratamento.");
        }

        else {
            const token = localStorage.getItem("user_token")
            const dataNascimentoFormatada = new Date(dadosForm.dataNascimento).toISOString().split('T')[0] 
            const dataInicioFormatada = new Date(dadosForm.dataInicioTratamento).toISOString().split('T')[0] 
            const dataTerminoFormatada = new Date(dadosForm.dataTerminoTratamento).toISOString().split('T')[0] 
            // var dataNascFormatadaSeparacao = dataNascimentoFormatada.split('T')[0] 
            // var dataInicFormatadaSeparacao = dataInicioFormatada.split('T')[0] 
            // var dataTermFormatadaSeparacao = dataTerminoFormatada.split('T')[0] 
            const dadosFormAtualizados = {
                ...dadosForm,
                alunoId: dadosForm.alunoUnieva ? dadosForm.encaminhador : "",
                dataNascimento: dataNascimentoFormatada,
                dataInicioTratamento: dataInicioFormatada,
                dataTerminoTratamento: dataTerminoFormatada
            };
            console.log(dataNascimentoFormatada, dataInicioFormatada, dataTerminoFormatada)
                try {
                    var dadosEnviados = await api.post("/paciente", dadosFormAtualizados, {
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${token}`
                            }
                    });
                    console.log(dadosEnviados)

                    setIsSucessModalOpen(true);
                    renderForm(true)
                    // renderForm={renderFormCadastro} 
                } catch (e) {
                    console.log(e)
                    setState({ ...newState, open: true });
                    setMessage(e.response.data);
                }  
        }
    }

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

    return( 
        <>
            <div className="modal" id="modal">
                <div className="modal-content modal-content-paciente">
                    <h2>Cadastro de paciente</h2>
                    <hr /> 
                    <div className="formulario">
                        <h2>Informações Pessoais</h2>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="Nome">Nome Completo*</label>
                                <input type="text" className="nome-completo" id="nome" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="CPF">CPF*</label>
                                <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosForm.cpf} onChange={(e) =>  setDadosForm({...dadosForm, cpf:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="data-nascimento">Data de nascimento*</label>
                                <DatePicker 
                                className="data-nascimento"
                                format="dd/MM/yyyy"
                                placeholder="dd/mm/aaaa"
                                // value={dadosForm.dataNascimento}
                                onChange={(e) =>  setDadosForm({...dadosForm, dataNascimento: e})}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="sexo">Sexo*</label>
                                <select className="sexo" name="sexo" id="sexo" 
                                value={dadosForm.sexo} onChange={(e) =>  setDadosForm({...dadosForm, sexo: e.target.value})}
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
                                 value={dadosForm.email} onChange={(e) =>  setDadosForm({...dadosForm, email:e.target.value})} 
                                 />
                                </div>  
                            <div className="div-flex">
                                <label htmlFor="Telefone">Telefone*</label>
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefoneContato} onChange={(e) => setDadosForm({...dadosForm, telefoneContato:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="estado-civil">Estado civil*</label>
                                <select className="estado-civil" name="estado-civil" id="estado-civil"
                                 value={dadosForm.estadoCivil} onChange={(e) =>  setDadosForm({...dadosForm, estadoCivil: e.target.value})}
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
                                <input type="text" className="profissao" id="profissao" value={dadosForm.profissao} onChange={(e) =>  setDadosForm({...dadosForm, profissao:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="religiao">Religião*</label>
                                <input type="text" className="religiao" id="religiao" value={dadosForm.religiao} onChange={(e) =>  setDadosForm({...dadosForm, religiao:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="renda">Renda Familiar*</label>
                                <select className="renda" name="renda" id="renda" value={dadosForm.rendaFamiliar} onChange={(e) =>  setDadosForm({...dadosForm, rendaFamiliar:e.target.value})} >
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
                                <input type="text" className="nacionalidade" id="nacionalidade" value={dadosForm.nacionalidade} onChange={(e) =>  setDadosForm({...dadosForm, nacionalidade:e.target.value})} />
                            </div>
                            <div className="div-flex-naturalidade">
                                <label htmlFor="naturalidade">Naturalidade*</label>
                                <input type="text" className="naturalidade" id="naturalidade" value={dadosForm.naturalidade} onChange={(e) =>  setDadosForm({...dadosForm, naturalidade:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="nome-contato">Nome do contato/responsável</label>
                                <input type="text" className="nome-contato" id="nome-contato" value={dadosForm.nomeDoContatoResponsavel} onChange={(e) =>  setDadosForm({...dadosForm, nomeDoContatoResponsavel:e.target.value})}/>
                            </div>
                            <div className="div-flex">
                                <label htmlFor="outro">Telefone contato/responsável</label>
                                <IMaskInput type="text" className="outro" id="outro" mask="(00)0 0000-0000" value={dadosForm.outroContato} onChange={(e) =>  setDadosForm({...dadosForm, outroContato:e.target.value})} />
                            </div>
                            
                        </div>

                        <h2>Endereço</h2>

                        <div className="flex-endereco">
                            <div className="div-flex">
                                <label htmlFor="cep">CEP*</label>
                                <IMaskInput type="text" className="cep" id="cep" mask="00000-000" value={dadosForm.enderecoCep} onChange={(e) =>  setDadosForm({...dadosForm, enderecoCep:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="logradouro">Logradouro*</label>
                                <input type="text" className="logradouro" id="logradouro" value={dadosForm.enderecoLogradouro} onChange={(e) =>  setDadosForm({...dadosForm, enderecoLogradouro:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="bairro">Bairro*</label>
                                <input type="text" className="bairro" id="bairro" value={dadosForm.enderecoBairro} onChange={(e) =>  setDadosForm({...dadosForm, enderecoBairro:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-endereco">
                            <div className="div-flex">
                                <label htmlFor="cidade">Cidade*</label>
                                <input type="text" className="cidade" id="cidade" value={dadosForm.enderecoCidade} onChange={(e) =>  setDadosForm({...dadosForm, enderecoCidade:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="complemento">Complemento</label>
                                <input type="text" className="complemento" id="complemento" value={dadosForm.enderecoComplemento} onChange={(e) =>  setDadosForm({...dadosForm, enderecoComplemento:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="uf">UF*</label>
                                <select className="uf" name="uf" id="uf"
                                 value={dadosForm.enderecoUF} onChange={(e) =>  setDadosForm({...dadosForm, enderecoUF: e.target.value})}
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
                                {dadosForm.alunoUnieva ? (
                                    <select 
                                    className="encaminhadorSelect" id="encaminhadorSelect" 
                                    value={dadosForm.encaminhador} 
                                    onChange={(e) => setDadosForm({...dadosForm, encaminhador: e.target.value})} 
                                    disabled={!dadosForm.alunoUnieva}>
                                        <option value="" disabled>Selecione uma opção</option>
                                        { alunosNome.alunos.map(aluno => (
                                        <option key={aluno._id} value={aluno._id}>
                                        {aluno.nome}    
                                        </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput" 
                                    value={dadosForm.encaminhador} 
                                    onChange={(e) => setDadosForm({...dadosForm, encaminhador: e.target.value})} 
                                    disabled={!dadosForm.funcionarioUnieva} 
                                    />
                                )}
                            </div>
                            <div className="div-flex">
                                <label htmlFor="status">Status Encaminhador*</label>
                                <select className="status" name="status" id="status"
                                value={dadosForm.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosForm.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : ""}
                                onChange={(e) => {setDadosForm({...dadosForm, alunoUnieva: e.target.value === "Aluno da UniEVANGÉLICA", funcionarioUnieva: e.target.value === "Funcionário da Associação Educativa Evangélica", encaminhador: "", alunoId: ""})}}>
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
                                placeholder="dd/mm/aaaa"
                                // value={dadosForm.dataNascimento}
                                onChange={(e) =>  setDadosForm({...dadosForm, dataInicioTratamento: e})}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="termino-tratamento">Término do tratamento*</label>
                                <DatePicker 
                                className="termino-tratamento"
                                format="dd/MM/yyyy"
                                placeholder="dd/mm/aaaa"
                                // value={dadosForm.dataNascimento}
                                onChange={(e) =>  setDadosForm({...dadosForm, dataTerminoTratamento: e})}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="tratamento">Tipo de tratamento*</label>
                                <select className="tratamento" name="tratamento" id="tratamento" value={dadosForm.tipoDeTratamento} onChange={(e) =>  setDadosForm({...dadosForm, tipoDeTratamento:e.target.value})}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="psicoterapia">Psicoterapia</option>
                                    <option value="plantao">Plantão</option>
                                    <option value="psicodiagnostico">Psicodiagnóstico</option>
                                    <option value="avaliacao diagnostica">Avaliação diagnóstica</option>
                                </select>
                            </div>
                        </div>
                        <p className="campo_obrigatorio">*Campo Obrigatório</p>

                        <div className="buttons-form buttons-form-paciente">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={HandleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}>Cadastrar</button>  
                            <Snackbar
                                ContentProps={{sx: {borderRadius: '8px'}}}
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
                        </div>
                    </div>
                </div>
            </div>  
            
            {isSucessModalOpen && (
                <div className="modal-sucesso">
                    <div className="modal-sucesso-content">
                        <h1>Sucesso!</h1>
                        <h2>Paciente cadastrado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )} 
    </>
    )
    
}
