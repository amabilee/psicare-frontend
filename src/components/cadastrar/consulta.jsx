import React, { useState, useEffect } from "react";

import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';

import "./style.css"

export default function CadastrarConsulta({ handleCloseModal, renderForm }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [pacientesNome, setPacientesNome] = useState([]);
    const [alunosNome, setAlunosNome] = useState([]);
    const [frequenciaOpcoes, setFrequenciaOpcoes] = useState([]);
    const [dadosForm, setDadosForm] = useState({
        Nome: "",
        start: "",
        end: "",
        createAt: "",
        sala: "",
        TipoDeConsulta: "",
        pacienteld: "#",
        alunoId: "#",
        statusDaConsulta: "Pendente",
        allDay: false,
        intervalo: "",
        frequenciaIntervalo: "",
        observacao: "",
    });

    useEffect(() => {
        buscarPacientes();
        buscarAlunos();
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

    const handleFormSubmit = async (newState) => {
        if (!dadosForm.Nome || dadosForm.Nome.length <= 6) {
            setMessage("Insira um título válido para a consulta (mínimo 6 caracteres).");
            setState({ ...newState, open: true });
            return;
        }
        if (dadosForm.pacienteld === "#") {
            setMessage("Selecione um paciente.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.createAt) {
            setMessage("Insira uma data para a consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.start || !dadosForm.end) {
            setMessage("Insira o horário de início e fim da consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.sala) {
            setMessage("Selecione uma sala.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.TipoDeConsulta) {
            setMessage("Selecione o tipo de consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (dadosForm.alunoId === "#") {
            setMessage("Selecione o aluno responsável.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.intervalo) {
            setMessage("Selecione o intervalo.");
            setState({ ...newState, open: true });
            return;
        }
        if (dadosForm.intervalo !== "Sessão Única" && !dadosForm.frequenciaIntervalo) {
            setMessage("Selecione a frequência do intervalo.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosForm.observacao) {
            setMessage("Insira uma observação.");
            setState({ ...newState, open: true });
            return;
        }

        const formattedData = {
            ...dadosForm,
            createAt: new Date(dadosForm.createAt).toString(),
            start: new Date(dadosForm.start).toString(),
            end: new Date(dadosForm.end).toString(),
        };
        
        

        try {
            const token = localStorage.getItem("user_token");
            await api.post("/consulta", formattedData, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            setMessage("Consulta criada com sucesso!");
            setIsSucessModalOpen(true);
            renderForm(true);
        } catch (e) {
            setMessage("Erro ao criar consulta");
            setState({ ...state, open: true });
        }
    };


    const buscarPacientes = async () => {
        const token = localStorage.getItem("user_token");
        try {
            const response = await api.get(`/paciente`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            setPacientesNome(response.data.pacientes);
        } catch (e) {
            console.error("Erro ao buscar pacientes:", e);
        }
    };

    const buscarAlunos = async () => {
        const token = localStorage.getItem("user_token");
        try {
            const response = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            });
            setAlunosNome(response.data.alunos);
        } catch (e) {
            console.error("Erro ao buscar alunos:", e);
        }
    };

    useEffect(() => {
        if (dadosForm.intervalo === 'Semanal') {
            setFrequenciaOpcoes(Array.from({ length: 25 }, (_, i) => i + 1));
        } else if (dadosForm.intervalo === 'Mensal') {
            setFrequenciaOpcoes(Array.from({ length: 6 }, (_, i) => i + 1));
        } else if (dadosForm.intervalo === 'Sessão Única') {
            setDadosForm((prevState) => ({
                ...prevState,
                frequenciaIntervalo: '1',
            }));
            setFrequenciaOpcoes(Array.from({ length: 1 }, (_, i) => i + 1));
        } else {
            setFrequenciaOpcoes([]);
        }
    }, [dadosForm.intervalo]);

    return (
        <>
            <div className="modal" >
                <div className="modal-content">
                    <h2>Cadastro de consulta</h2>
                    <hr />
                    <div className="formulario">
                        <label>Título da consulta*</label>
                        <input type="text" value={dadosForm.Nome} onChange={(e) => setDadosForm({ ...dadosForm, Nome: e.target.value })} />

                        <label>Paciente*</label>
                        <select
                            className="professorNome"
                            value={dadosForm.pacienteld}
                            onChange={(e) => setDadosForm({ ...dadosForm, pacienteld: e.target.value })}
                        >
                            <option value="#" disabled>Selecione uma opção</option>
                            {pacientesNome.map((paciente) => (
                                <option key={paciente._id} value={paciente._id}>
                                    {paciente.nome}
                                </option>
                            ))}
                        </select>

                        <div className="flex-informacoes-pessoais div-flex-consulta">
                            <div className="div-flex">
                                <label htmlFor="data-nascimento">Data da consulta*</label>
                                <DatePicker
                                    className="data-nascimento"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/mm/aaaa"
                                    style={{
                                        width: "160px"
                                    }}
                                    onChange={(e) => setDadosForm({ ...dadosForm, createAt: e })}
                                />
                            </div>
                            <div className="div-flex">
                                <label>Intervalo Temporal*</label>
                                <DatePicker
                                    className="data-nascimento"
                                    format="HH:mm"
                                    placeholder="HH:mm"
                                    style={{
                                        width: "150px"
                                    }}
                                    onChange={(e) => setDadosForm({ ...dadosForm, start: e })}
                                />
                            </div>
                            <p>às</p>
                            <DatePicker
                                className="data-nascimento"
                                format="HH:mm"
                                placeholder="HH:mm"
                                style={{
                                    width: "150px"
                                }}
                                onChange={(e) => setDadosForm({ ...dadosForm, end: e })}
                            />
                        </div>
                        <div className="flex-informacoes-pessoais div-flex-consulta">
                            <div className="div-flex">
                                <label>Sala*</label>
                                <select className="sexo"
                                    value={dadosForm.sala} onChange={(e) => setDadosForm({ ...dadosForm, sala: e.target.value })}
                                >
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Sala 1">Sala 1</option>
                                    <option value="Sala 2">Sala 2</option>
                                    <option value="Sala 3">Sala 3</option>
                                    <option value="Sala 4">Sala 4</option>
                                    <option value="Sala 5">Sala 5</option>
                                    <option value="Sala 6">Sala 6</option>
                                    <option value="Sala 7">Sala 7</option>
                                    <option value="Sala 8">Sala 8</option>
                                    <option value="Sala 9">Sala 9</option>
                                    <option value="Sala 10">Sala 10</option>
                                </select>
                            </div>
                            <div className="div-flex">
                                <label>Tipo da consulta*</label>
                                <select className="sexo"
                                    value={dadosForm.TipoDeConsulta} onChange={(e) => setDadosForm({ ...dadosForm, TipoDeConsulta: e.target.value })}
                                >
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Casal">Casal</option>
                                    <option value="Familiar">Familiar</option>
                                </select>
                            </div>
                        </div>

                        <label>Aluno responsável*</label>
                        <select className="professorNome" value={dadosForm.alunoId} onChange={(e) => setDadosForm({ ...dadosForm, alunoId: e.target.value })}>
                            <option value="#" disabled>Selecione uma opção</option>
                            {alunosNome.map(aluno => (
                                <option key={aluno._id} value={aluno._id}>
                                    {aluno.nome}
                                </option>
                            ))}
                        </select>

                        <div className="flex-informacoes-pessoais div-flex-consulta">
                            <div className="div-flex">
                                <label>Intervalo*</label>
                                <select className="sexo"
                                    value={dadosForm.intervalo}
                                    onChange={(e) => setDadosForm({ ...dadosForm, intervalo: e.target.value })}
                                >
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Sessão Única">Sessão Única</option>
                                    <option value="Semanal">Semanal</option>
                                    <option value="Mensal">Mensal</option>
                                </select>
                            </div>
                            <div className="div-flex" style={{ marginLeft: "20px" }}>
                                <label>Frequência do intervalo*</label>
                                <select className="sexo"
                                    value={dadosForm.frequenciaIntervalo}
                                    onChange={(e) => setDadosForm({ ...dadosForm, frequenciaIntervalo: e.target.value })}
                                    disabled={dadosForm.intervalo === 'Sessão Única'}
                                >
                                    <option value="" disabled>Selecione uma opção</option>
                                    {frequenciaOpcoes.map(opcao => (
                                        <option key={opcao} value={opcao}>{opcao}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Observações*</label>
                        <input type="text" value={dadosForm.observacao} onChange={(e) => setDadosForm({ ...dadosForm, observacao: e.target.value })} />

                        <span className="campo_obrigatorio">*Campo Obrigatório</span>

                        <div className="buttons-form buttons-form-aluno">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={() => handleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}>
                                Cadastrar
                            </button>

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
                        <h2>Consulta cadastrada com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}
