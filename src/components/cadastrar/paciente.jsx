import React, {useState} from "react";
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
        funcionarioUnieva: false
    });

    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });

    const { vertical, horizontal, open } = state;

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

    return( 
        <>
            <div className="modal" >
                <div className="modal-content modal-content-paciente">
                    <h2>Cadastro de paciente</h2>
                    <hr /> 
                    <div className="formulario">
                        <h2>informações pessoais</h2>
                        <div className="flex-input-paciente">
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
                                <input type="date" className="data-nascimento" id="data-nascimento" />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="sexo">Sexo*</label>
                                <select className="sexo" name="sexo" id="sexo">
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-input-paciente">
                            <div className="div-flex-email">
                                <label htmlFor="Email">Email*</label>
                                <input type="email" className="email" id="email" value={dadosForm.email} onChange={(e) =>  setDadosForm({...dadosForm, email:e.target.value})} />
                                </div>
                            <div className="div-flex-telefone">
                                <label htmlFor="Telefone">Telefone*</label>
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefone} onChange={(e) =>  setDadosForm({...dadosForm, telefone:e.target.value})} />
                            </div>
                            <div className="div-flex-estadoCivil">
                                <label htmlFor="estado-civil">Estado civil*</label>
                                <select className="estado-civil" name="estado-civil" id="estado-civil">
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </div>
                            <div className="div-flex-profissao">
                                <label htmlFor="profissao">Profissão*</label>
                                <input type="text" className="profissao" id="profissao" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-input-paciente">
                            <div className="div-flex">
                                <label htmlFor="religiao">Religião*</label>
                                <input type="text" className="religiao" id="religiao" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="renda">Renda familiar*</label>
                                <input type="text" className="renda" id="renda" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="nacionalidade">Nacionalidade*</label>
                                <input type="text" className="nacionalidade" id="nacionalidade" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex-naturalidade">
                                <label htmlFor="naturalidade">Naturalidade*</label>
                                <input type="text" className="naturalidade" id="naturalidade" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-input-paciente">
                            <div className="div-flex div-flex-contatos">
                                <label htmlFor="outro">Outro contato*</label>
                                <input type="text" className="outro" id="outro" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                            <div className="div-flex div-flex-contatos">
                                <label htmlFor="nome-contato">Nome do contato/responsável*</label>
                                <input type="text" className="nome-contato" id="nome-contato" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
                            </div>
                        </div>
                        <h2>Endereço</h2>

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