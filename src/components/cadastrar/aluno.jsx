import React, {useState} from "react";
import { api } from "../../services/server";
import {IMaskInput} from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css"

export default function CadastrarAluno({ handleCloseModal, renderForm }){
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosForm, setDadosForm] = useState({
        id: 0, 
        nome: "", 
        cpf: "", 
        telefone: "", 
        email: "", 
        professorNome: "#",
        matricula: "",
        periodo: "#"
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

    const handleFormSubmit = (newState) => async() => {
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
        } else if(dadosForm.professorNome === "#"){
            setState({...newState, open: true});
            setMessage("Selecione um professor.")
        } else if (dadosForm.matricula.length < 7){
            setState({ ...newState, open: true });
            setMessage("Insira a matrícula.");
        } else if (dadosForm.periodo === "#"){
            setState({...newState, open: true});
            setMessage("Selecione um periodo.")
        }
        else {
            try {
                var envioDados = await api.get("/aluno/ultimo/criado", dadosForm);
                let novoId = 0;

                if(envioDados.data) {
                    novoId = envioDados.data.id + 1
                }

                var envioDadosAtualizados = {...dadosForm, id: novoId}
                console.log(novoId)
                console.log(envioDadosAtualizados)

                try {
                    var dadosEnviados = await api.post("/aluno", envioDadosAtualizados);
                    console.log(dadosEnviados)

                    setIsSucessModalOpen(true);
                    renderForm(true)
                    // renderForm={renderFormCadastro} 
                } catch (e) {
                    console.log("deu ruim ai", e)
                    setState({ ...newState, open: true });
                    setMessage(e.response.data);
                }
            } catch (e) {
                console.log(e)
            }   
        }
    }

    return( 
        <>
            <div className="modal" >
                <div className="modal-content modal-content-aluno">
                    <h2>Cadastro de aluno</h2>
                    <hr /> 
                    <div className="formulario">
                        <label htmlFor="Nome">Nome Completo*</label>
                        <input type="text" id="nome" value={dadosForm.nome} onChange={(e) =>  setDadosForm({...dadosForm, nome:e.target.value})} />
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
                        
                        <label htmlFor="professorResponsavel">Professor*</label>
                        <select className="professorNome" id="professorNome" value={dadosForm.professorNome} onChange={(e) =>  setDadosForm({...dadosForm, professorNome:e.target.value})} required>
                            <option value="#" disabled>Selecione uma opção</option>
                            
                        </select>

                        <div className="flex-input">
                            <div className="div-matricula">
                                <label htmlFor="matricula">Matrícula*</label>
                                <IMaskInput type="text" className="matricula" id="matricula" mask="0000000" value={dadosForm.matricula} onChange={(e) =>  setDadosForm({...dadosForm, matricula:e.target.value})} />
                            </div>
                            <div className="div-periodo">
                                <label htmlFor="periodo">Período*</label>
                                <select className="periodo" id="periodo" value={dadosForm.periodo} onChange={(e) =>  setDadosForm({...dadosForm, periodo:e.target.value})} required>
                                    <option value="#" disabled>Selecione uma opção</option>
                                    <option value="1-periodo">1° período</option>
                                    <option value="2-periodo">2° período</option>
                                    <option value="3-periodo">3° período</option>
                                    <option value="4-periodo">4° período</option>
                                    <option value="5-periodo">5° período</option>
                                    <option value="6-periodo">6° período</option>
                                    <option value="7-periodo">7° período</option>
                                    <option value="8-periodo">8° período</option>
                                    <option value="9-periodo">9° período</option>
                                    <option value="10-periodo">10° período</option>
                                </select>
                            </div>

                            
                        </div>
                        
                        <div className="buttons-form buttons-form-aluno">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={handleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}>Cadastrar</button>  
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