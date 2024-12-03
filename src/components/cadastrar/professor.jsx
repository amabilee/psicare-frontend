import React, { useState } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css"

export default function CadastrarProfessor({ handleCloseModal, renderForm }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosForm, setDadosForm] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        disciplina: ""
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

    const handleFormSubmit = (newState) => async () => {
        if (dadosForm.nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome completo.");
            return;
        } else if (!cpf.isValid(dadosForm.cpf)) {
            setState({ ...newState, open: true });
            setMessage("Insira um cpf válido.");
            return;
        } else if (dadosForm.telefone.length != 15) {
            setState({ ...newState, open: true });
            setMessage("Insira um telefone válido.");
            return;
        } else if (!validator.isEmail(dadosForm.email)) {
            setState({ ...newState, open: true });
            setMessage("Insira um email válido.");
            return;
        } else if (dadosForm.disciplina.length === 0) {
            setState({ ...newState, open: true });
            setMessage("Insira uma disciplina.");
            return;
        } else {
            const token = localStorage.getItem("user_token")
            try {
                var dadosEnviados = await api.post("/professor", dadosForm, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
                console.log(dadosEnviados)

                setIsSucessModalOpen(true);
                renderForm(true)
            } catch (e) {
                setState({ ...newState, open: true });
                setMessage(e.response.data.error);
            }
        }
    }

    return (
        <>
            <div className="modal" >
                <div className="modal-content">
                    <h2>Cadastro de professor</h2>
                    <hr />
                    <div className="formulario">
                        <label htmlFor="Nome">Nome Completo*</label>
                        <input type="text" id="nome" value={dadosForm.nome} onChange={(e) => setDadosForm({ ...dadosForm, nome: e.target.value })} />
                        <div className="flex-input">
                            <div className="div-CPF">
                                <label htmlFor="CPF">CPF*</label>
                                <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosForm.cpf} onChange={(e) => setDadosForm({ ...dadosForm, cpf: e.target.value })} />
                            </div>
                            <div className="div-telefone">
                                <label htmlFor="Telefone">Telefone*</label>
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefone} onChange={(e) => setDadosForm({ ...dadosForm, telefone: e.target.value })} />
                            </div>
                        </div>
                        <label htmlFor="Email">Email*</label>
                        <input type="email" name="email" id="email" value={dadosForm.email} onChange={(e) => setDadosForm({ ...dadosForm, email: e.target.value })} />
                        <label htmlFor="disciplina">Disciplina*</label>
                        <input type="text" className="disciplina" value={dadosForm.disciplina} onChange={(e) => setDadosForm({ ...dadosForm, disciplina: e.target.value })} />
                        <p className="campo_obrigatorio">*Campo Obrigatório</p>
                        <div className="buttons-form">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={handleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}>Cadastrar</button>
                            <Snackbar
                                ContentProps={{ sx: { borderRadius: '8px' } }}
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
                        <h2>Professor cadastrado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}