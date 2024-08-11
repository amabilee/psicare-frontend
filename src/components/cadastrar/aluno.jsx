import React, {useState, useEffect} from "react";
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
    const [professoresNome, setProfessoresNome] = useState({ professores: []});
    const [dadosForm, setDadosForm] = useState({
        nome: "", 
        cpf: "", 
        telefone: "", 
        email: "", 
        professor: "#",
        matricula: "",
        periodo: 0,
        senha: "123456"
    });

    useEffect(() => {
        buscarProfessores();
    }, []);

    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
      }, []);

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
        } else if(dadosForm.professor === "#"){
            setState({...newState, open: true});
            setMessage("Selecione um professor.")
        } else if (dadosForm.matricula.length < 7){
            setState({ ...newState, open: true });
            setMessage("Insira a matrícula.");
        } else if (dadosForm.periodo === 0){
            setState({...newState, open: true});
            setMessage("Selecione um periodo.")
        }
        else {
            const token = localStorage.getItem("user_token")
            console.log(dadosForm)
            try {
                const dadosEnviados = await api.post("/aluno", dadosForm, {
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
                console.log("Erro ao cadastrar o aluno:", e)
                setState({ ...newState, open: true });
                setMessage("Erro ao cadastrar o aluno.");
            }
        }
    }

    const buscarProfessores = async() => {
        const token = localStorage.getItem("user_token")
        try {
            const selectProfessores = await api.get(`/professor`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                  }
            });
            setProfessoresNome(selectProfessores.data);
        } catch (e) {
            console.log("Erro ao buscar professores: ", e)
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
                        <select className="professorNome" id="professorNome" value={dadosForm.professor} onChange={(e) =>  setDadosForm({...dadosForm, professor:e.target.value})} required>
                            <option value="#" disabled>Selecione uma opção</option>
                            { professoresNome.professores.map(professor => (
                                    <option key={professor._id} value={professor._id}>
                                        {professor.nome}
                                    </option>
                                ))}
                        </select>

                        <div className="flex-input">
                            <div className="div-matricula">
                                <label htmlFor="matricula">Matrícula*</label>
                                <IMaskInput type="text" className="matricula" id="matricula" mask="0000000" value={dadosForm.matricula} onChange={(e) =>  setDadosForm({...dadosForm, matricula:e.target.value})} />
                            </div>
                            <div className="div-periodo">
                                <label htmlFor="periodo">Período*</label>
                                <select className="periodo" id="periodo" value={dadosForm.periodo} onChange={(e) =>  setDadosForm({...dadosForm, periodo: parseInt(e.target.value)})} required>
                                    <option value="0" disabled>Selecione uma opção</option>
                                    <option value="1">1° período</option>
                                    <option value="2">2° período</option>
                                    <option value="3">3° período</option>
                                    <option value="4">4° período</option>
                                    <option value="5">5° período</option>
                                    <option value="6">6° período</option>
                                    <option value="7">7° período</option>
                                    <option value="8">8° período</option>
                                    <option value="9">9° período</option>
                                    <option value="10">10° período</option>
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