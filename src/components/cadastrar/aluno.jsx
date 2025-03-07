import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css"

import { UseAuth } from '../../hooks';

import Select from 'react-select'

export default function CadastrarAluno({ handleCloseModal, renderForm }) {
    const { signOut } = UseAuth();
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [professoresNome, setProfessoresNome] = useState({ professores: [] });
    const [dadosForm, setDadosForm] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        professorId: "#",
        matricula: "",
        periodo: 0,
    });

    useEffect(() => {
        buscarProfessores();
    }, []);

    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    }, []);

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
        } else if (dadosForm.professorId === "#") {
            setState({ ...newState, open: true });
            setMessage("Selecione um professor.")
            return;
        } else if (dadosForm.matricula.length < 7) {
            setState({ ...newState, open: true });
            setMessage("Insira a matrícula.");
            return;
        } else if (dadosForm.periodo === 0) {
            setState({ ...newState, open: true });
            setMessage("Selecione um periodo.")
            return;
        }
        else {
            const token = localStorage.getItem("user_token")
            try {
                await api.post("/aluno", dadosForm, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
                setIsSucessModalOpen(true);
                renderForm(true)
            } catch (e) {
                setState({ ...state, open: true });
                setMessage(e.response.data.error);
            }
        }
    }

    const buscarProfessores = async () => {
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
            if (e.response.status == 401) {
                signOut()
            } else {
                setState({ ...state, open: true });
                setMessage('Erro ao buscar aluno');
            }
        }
    }

    const periodoOptions = [
        { value: "1", label: "1°" },
        { value: "2", label: "2°" },
        { value: "3", label: "3°" },
        { value: "4", label: "4°" },
        { value: "5", label: "5°" },
        { value: "6", label: "6°" },
        { value: "7", label: "7°" },
        { value: "8", label: "8°" },
        { value: "9", label: "9°" },
        { value: "10", label: "10°" }
    ]

    const professorOptions = professoresNome.professores.map((professor) => ({
        value: professor._id,
        label: professor.nome,
    }));

    return (
        <>
            <div className="modal" >
                <div className="modal-content modal-content-aluno">
                    <h2>Cadastro de aluno</h2>
                    <hr />
                    <div className="formulario">
                        <label htmlFor="Nome">Nome Completo*</label>
                        <input type="text" id="nome" value={dadosForm.nome} onChange={(e) => setDadosForm({ ...dadosForm, nome: e.target.value })} maxLength={100} />
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
                        <input type="email" name="email" id="email" value={dadosForm.email} onChange={(e) => setDadosForm({ ...dadosForm, email: e.target.value })} maxLength={150} />

                        <label htmlFor="professorResponsavel">Professor*</label>
                        <Select
                            className="paciente-select"
                            options={professorOptions}
                            value={professorOptions.find(option => option.value === dadosForm.professorId) || null}
                            onChange={(selectedOption) => {
                                setDadosForm({ ...dadosForm, professorId: selectedOption.value });
                            }}
                            placeholder="Selecione uma opção"
                            menuPlacement="auto"
                        />

                        <div className="flex-input">
                            <div className="div-matricula">
                                <label htmlFor="matricula">Matrícula*</label>
                                <IMaskInput type="text" className="matricula" id="matricula" mask="0000000" value={dadosForm.matricula} onChange={(e) => setDadosForm({ ...dadosForm, matricula: e.target.value })} />
                            </div>
                            <div className="div-periodo">
                                <label htmlFor="periodo">Período*</label>
                                <Select
                                    className="tipo-select"
                                    options={periodoOptions}
                                    value={periodoOptions.find(option => option.value === dadosForm.periodo) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, periodo: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                        <p className="campo_obrigatorio">*Campo Obrigatório</p>
                        <div className="buttons-form buttons-form-aluno">
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
                        <h2>Aluno cadastrado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}