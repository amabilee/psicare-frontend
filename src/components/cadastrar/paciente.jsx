import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
// import 'rsuite/dist/rsuite.css';
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
        nome: "",//
        cpf: "",//
        dataNascimento: "",//
        email: "",//
        telefoneContato: "",//
        sexo: "",//
        estadoCivil: "",//
        religiao: "",//
        rendaFamiliar: "",//
        profissao: "",//
        outroContato: "",//
        nomeDoContatoResponsavel: "",//
        naturalidade: "",//
        nacionalidade: "",//
        enderecoCep: "",//
        enderecoLogradouro: "",//
        enderecoBairro: "",//
        enderecoComplemento: "",
        enderecoCidade: "",
        enderecoUF: "",
        dataInicioTratamento: "",//yyyy-MM-dd 
        dataTerminoTratamento: "",//yyyy-MM-dd
        encaminhadorNome: "",//
        tipoDeTratamento: "",//
        alunoUnieva: false,
        funcionarioUnieva: false
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

    const HandleFormSubmit = (newState) => async() => {
        console.log(dadosForm)
        // if (dadosForm.nome.length <= 6) {
        //     setState({ ...newState, open: true });
        //     setMessage("Insira o nome completo.");
        // } else if (!cpf.isValid(dadosForm.cpf)){
        //     setState({ ...newState, open: true }); 
        //     setMessage("Insira um cpf válido.");
        // } else if (dadosForm.telefone.length != 15){
        //     setState({ ...newState, open: true }); 
        //     setMessage("Insira um telefone válido.");
        // } else if (!validator.isEmail(dadosForm.email)){
        //     setState({ ...newState, open: true });
        //     setMessage("Insira um email válido.");
        // } else if (dadosForm.turno === "#") {
        //     setState({ ...newState, open: true });
        //     setMessage("Selecione um turno.");

        // } else {
            const token = localStorage.getItem("user_token")
                try {
                    var dadosEnviados = await api.post("/paciente", dadosForm, {
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
                //}  
        }
    }

    const buscarAlunos = async() => {
        const token = localStorage.getItem("user_token")
        try {
            const selectAlunos = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setAlunosNome(selectAlunos.data);
        } catch (e) {
            console.log("Erro ao buscar alunos: ", e)
        }
    }

    return( 
        <>
            <div className="modal" >
                <div className="modal-content modal-content-paciente">
                    <h2>Cadastro de paciente</h2>
                    <hr /> 
                    <div className="formulario">
                        <h2>informações pessoais</h2>
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
                                format="MM/dd/yyyy" 
                                className="data-nascimento"
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
                                    <option value="Feminino">Prefiro não informar</option>
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
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefoneContato} onChange={(e) =>  setDadosForm({...dadosForm, telefoneContato:e.target.value})} />
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
                                <label htmlFor="outro">Outro contato*</label>
                                <IMaskInput type="text" className="outro" id="outro" mask="(00)0 0000-0000" value={dadosForm.outroContato} onChange={(e) =>  setDadosForm({...dadosForm, outroContato:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="nome-contato">Nome do contato/responsável</label>
                                <input type="text" className="nome-contato" id="nome-contato" value={dadosForm.nomeDoContatoResponsavel} onChange={(e) =>  setDadosForm({...dadosForm, nomeDoContatoResponsavel:e.target.value})}/>
                            </div>
                        </div>

                        <h2>Endereço</h2>

                        <div className="flex-endereco">
                            <div className="div-flex">
                                <label htmlFor="cep">CEP*</label>
                                <input type="text" className="cep" id="cep" value={dadosForm.enderecoCep} onChange={(e) =>  setDadosForm({...dadosForm, enderecoCep:e.target.value})} />
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
                                <input type="text" className="uf" id="uf" value={dadosForm.enderecoUF} onChange={(e) =>  setDadosForm({...dadosForm, enderecoUF:e.target.value})} />
                            </div>
                        </div>

                        <h2>Informações de tratamento</h2>

                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                                {dadosForm.alunoUnieva ? (
                                    <select 
                                    className="encaminhadorSelect" id="encaminhadorSelect" 
                                    value={dadosForm.encaminhadorNome} 
                                    onChange={(e) => setDadosForm({...dadosForm, encaminhadorNome: e.target.value})} 
                                    disabled={!dadosForm.alunoUnieva}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        { alunosNome.alunos.map(aluno => (
                                        <option 
                                        key={aluno._id} 
                                        value={aluno._id}>
                                        {aluno.nome}
                                        </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput" 
                                    value={dadosForm.encaminhadorNome} 
                                    onChange={(e) => setDadosForm({...dadosForm, encaminhadorNome: e.target.value})} 
                                    disabled={!dadosForm.funcionarioUnieva} 
                                    />
                                )}
                            </div>
                            <div className="div-flex">
                                <label htmlFor="status">Status Encaminhador*</label>
                                <select className="status" name="status" id="status" value={dadosForm.statusEncaminhador} onChange={(e) => {setDadosForm({...dadosForm, alunoUnieva: e.target.value === "Aluno da UniEVANGÉLICA", funcionarioUnieva: e.target.value === "Funcionário da Associação Educativa Evangélica", encaminhadorNome: ""});}}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Aluno da UniEVANGÉLICA">Aluno da UniEVANGÉLICA</option>
                                    <option value="Funcionário da Associação Educativa Evangélica">Funcionário da Associação Educativa Evangélica</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="inicio-tratamento">Início do Tratamento*</label>
                                <input type="date" className="inicio-tratamento" id="inicio-tratamento" value={dadosForm.dataInicioTratamento} onChange={(e) =>  setDadosForm({...dadosForm, dataInicioTratamento:e.target.value})}/>
                            </div>
                            <div className="div-flex">
                                <label htmlFor="termino-tratamento">Término do tratamento*</label>
                                <input type="date" className="termino-tratamento" id="termino-tratamento" value={dadosForm.dataTerminoTratamento} onChange={(e) =>  setDadosForm({...dadosForm, dataTerminoTratamento:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="tratamento">Tipo de tratamento*</label>
                                <select className="tratamento" name="tratamento" id="tratamento" value={dadosForm.tipoDeTratamento} onChange={(e) =>  setDadosForm({...dadosForm, tipoDeTratamento:e.target.value})}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="">Psicoterapia</option>
                                    <option value="">Plantão</option>
                                    <option value="">Psicodiagnóstico</option>
                                    <option value="">Avaliação diagnóstica</option>
                                </select>
                            </div>
                        </div>

                        <div className="buttons-form">
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
                        <h2>Cadastro realizado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )} 
    </>
    )
}