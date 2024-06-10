import React, {useState} from "react";
import {IMaskInput} from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import "./style.css"

export default function CadastrarSecretario({ handleCloseModal }){
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [dadosForm, setDadosForm] = useState({nome: "", cpf: "", telefone: "", email: "", turno: ""});
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      });
      const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const HandleFormSubmit = (newState) => () => {
        if (dadosForm.nome.length <= 6) {
            setState({ ...newState, open: true }); 
        } else if (dadosForm.cpf.length != 14){
            setState({ ...newState, open: true }); 
        } else if (dadosForm.telefone.length != 15){
            setState({ ...newState, open: true }); 
        } else if (dadosForm.email){
            setState({ ...newState, open: true });
        } else {
            setIsSucessModalOpen(true);
            console.log(dadosForm);
        }
    }


    return( 
        <>
            <div className="modal" >
                <div className="modal-content">
                    <h2>Cadastro de secretário</h2>
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
                        <label htmlFor="turno">Turno*</label>
                        <select className="turno" id="turno" value={dadosForm.turno} onChange={(e) =>  setDadosForm({...dadosForm, turno:e.target.value})}>
                            <option value="#"></option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                            <option value="noturno">Noturno</option>
                        </select>
                        <div className="buttons-form">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={() => HandleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}  >Cadastrar</button>  
                            <Snackbar
                                anchorOrigin={{ vertical, horizontal }}
                                open={open}
                                autoHideDuration={5000}
                                onClose={handleClose}
                                message="Insira todos os campos."
                                key={vertical + horizontal}
                            />
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