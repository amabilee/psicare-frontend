import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
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
        idade: 0,
        email: "",
        telefoneContato: "",
        sexo: "",
        estadoCivil: "",
        religiao: "",
        rendaFamiliar: "",
        profissao: "",
        outroContato: "",
        nomeDoContatoResponsavel: "",
        menorDeIdade: 0,
        naturalidade: "",
        nacionalidade: "",
        enderecoCep: "",
        enderecoLogradouro: "",
        enderecoBairro: "",
        enderecoComplemento: "",
        enderecoCidade: "",
        enderecoUF: "",
        dataInicioTratamento: "0000/00/00", 
        dataTerminoTratamento: "0000/00/00",
        quemEncaminhouID: "",
        quemEncaminhouNome: "",
        tipoDeTratamento: "",
        alunoUnieva: true,
        funcionarioUnieva: false,
        statusEncaminhador: ""
    });

    const [state, setState] = React.useState({
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
        if (dadosForm.nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome completo.");
        } else if (!cpf.isValid(dadosForm.cpf)){
            setState({ ...newState, open: true }); 
            setMessage("Insira um cpf válido.");
        } else if (dadosForm.telefone.length != 15){
            setState({ ...newState, open: true }); 
            setMessage("Insira um telefone válido.");
        } else if (!validator.isEmail(dadosForm.email)){
            setState({ ...newState, open: true });
            setMessage("Insira um email válido.");
        } else if (dadosForm.turno === "#") {
            setState({ ...newState, open: true });
            setMessage("Selecione um turno.");

        } else {
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
                }  
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
                                <input type="date" className="data-nascimento" id="data-nascimento" value={dadosForm.dataNascimento} onChange={(e) =>  setDadosForm({...dadosForm, dataNascimento:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="sexo">Sexo*</label>
                                <select className="sexo" name="sexo" id="sexo" 
                                
                                value={dadosForm.sexo} onChange={(e) =>  setDadosForm({...dadosForm, sexo: parseInt(e.target.value)})}
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
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefone} onChange={(e) =>  setDadosForm({...dadosForm, telefone:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="estado-civil">Estado civil*</label>
                                <select className="estado-civil" name="estado-civil" id="estado-civil"
                                 value={dadosForm.estadoCivil} onChange={(e) =>  setDadosForm({...dadosForm, estadoCivil: parseInt(e.target.value)})}
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
                                <select className="renda" name="renda" id="renda" value={dadosForm.rendaFamiliar}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="">Menos de R$500</option>
                                    <option value="">R$500 - $999</option>
                                    <option value="">R$1,000 - R$1,999</option>
                                    <option value="">R$2,000 - R$2,999</option>
                                    <option value="">R$3,000 - R$4,999</option>
                                    <option value="">R$5,000 ou mais</option>
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
                                <input type="text" className="outro" id="outro" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="nome-contato">Nome do contato/responsável</label>
                                <input type="text" className="nome-contato" id="nome-contato" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})}/>
                            </div>
                        </div>

                        <h2>Endereço</h2>

                        <div className="flex-endereco">
                            <div className="div-flex">
                                <label htmlFor="cep">CEP*</label>
                                <input type="text" className="cep" id="cep" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="logradouro">Logradouro*</label>
                                <input type="text" className="logradouro" id="logradouro" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="bairro">Bairro*</label>
                                <input type="text" className="bairro" id="bairro" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-endereco">
                            <div className="div-flex">
                                <label htmlFor="cidade">Cidade*</label>
                                <input type="text" className="cidade" id="cidade" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="complemento">Complemento</label>
                                <input type="text" className="complemento" id="complemento" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="uf">UF*</label>
                                <input type="text" className="uf" id="uf" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                        </div>

                        <h2>Informações de tratamento</h2>

                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                                {dadosForm.statusEncaminhador === "Aluno da UniEVANGÉLICA" ? (
                                    <select 
                                    className="encaminhadorSelect" id="encaminhadorSelect" 
                                    value={dadosForm.quemEncaminhouNome} 
                                    onChange={(e) => setDadosForm({...dadosForm, quemEncaminhouNome: e.target.value})} 
                                    disabled={dadosForm.statusEncaminhador === ""}
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
                                    value={dadosForm.quemEncaminhouNome} 
                                    onChange={(e) => setDadosForm({...dadosForm, quemEncaminhouNome: e.target.value})} 
                                    disabled={dadosForm.statusEncaminhador === ""} 
                                    />
                                )}
                            </div>
                            <div className="div-flex">
                                <label htmlFor="status">Status Encaminhador*</label>
                                <select className="status" name="status" id="status" value={dadosForm.statusEncaminhador} onChange={(e) => setDadosForm({
                                    ...dadosForm, 
                                    statusEncaminhador: e.target.value, quemEncaminhouNome: ""
                                })}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Aluno da UniEVANGÉLICA">Aluno da UniEVANGÉLICA</option>
                                    <option value="Funcionário da Associação Educativa Evangélica">Funcionário da Associação Educativa Evangélica</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="inicio-tratamento">Início do Tratamento*</label>
                                <input type="date" className="inicio-tratamento" id="inicio-tratamento" />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="termino-tratamento">Término do tratamento*</label>
                                <input type="date" className="termino-tratamento" id="termino-tratamento" />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="tratamento">Tipo de tratamento*</label>
                                <select className="tratamento" name="tratamento" id="tratamento" value={dadosForm.tipoDeTratamento}>
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
                        
                        {/* 
                        <div className="flex-input">
                            <div className="div-CPF">
                                <label htmlFor="CPF">CPF*</label>
                                <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosForm.cpf} onChange={(e) =>  setDadosForm({...dadosForm, cpf:e.target.value})} />
                            </div>
                            <div className="div-telefone">
                                <label htmlFor="Telefone">Telefone*</label>
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefone} onChange={(e) =>  setDadosForm({...dadosForm, telefone:e.target.value})} />
                            </div>
                        </div>                   
                        <label htmlFor="Email">Email*</label>
                        <input type="email" name="email" id="email" value={dadosForm.email} onChange={(e) =>  setDadosForm({...dadosForm, email:e.target.value})} />
                        <label htmlFor="turno">Turno*</label>
                        <select className="turno" id="turno" value={dadosForm.turno} onChange={(e) =>  setDadosForm({...dadosForm, turno:e.target.value})} required>
                            <option value="#" disabled>Selecione uma opção</option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                            <option value="noturno">Noturno</option>
                        </select> */}
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