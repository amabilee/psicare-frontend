import React, { useState, useEffect } from "react";

import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import { FaCalendar, FaClock } from 'react-icons/fa';

import "./style.css"

export default function CadastrarConsulta({ handleCloseModal, renderForm }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [pacientesNome, setPacientesNome] = useState({ pacientes: [] });
    const [alunosNome, setAlunosNome] = useState({ alunos: [] });
    const [frequenciaOpcoes, setFrequenciaOpcoes] = useState([]);
    const [dadosForm, setDadosForm] = useState({
        Nome: "",
        start: "",
        end: "",
        createAt: "",
        sala: "",
        TipoDeConsulta: "",
        pacienteId: "#",
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

    const handleFormSubmit = (newState) => async () => {
        console.log(dadosForm)
        if (dadosForm.Nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira título para a consulta.");
        }
        else {
            console.log(dadosForm)
            // const token = localStorage.getItem("user_token")
            // console.log(dadosForm)
            // try {
            //     const dadosEnviados = await api.post("/consulta", dadosForm, {
            //         headers: {
            //             "Content-Type": "application/json",
            //             "authorization": `Bearer ${token}`
            //         }
            //     });
            //     console.log(dadosEnviados)
            //     setIsSucessModalOpen(true);
            //     renderForm(true)
            // } catch (e) {
            //     setState({ ...state, open: true });
            //     setMessage(e.response.data.error);
            // }
        }
    }

    const buscarPacientes = async () => {
        const token = localStorage.getItem("user_token")
        try {
            const response = await api.get(`/paciente`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setPacientesNome(response.data);
        } catch (e) {
            if (e.response.status == 401) {
                signOut()
            } else {
                console.log("Erro ao buscar alunos ", e)
            }
        }
    }

    const buscarAlunos = async () => {
        const token = localStorage.getItem("user_token")
        try {
            const response = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setAlunosNome(response.data);
        } catch (e) {
            if (e.response.status == 401) {
                signOut()
            } else {
                console.log("Erro ao buscar alunos ", e)
            }
        }
    }

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
                        <select className="professorNome" value={dadosForm.pacienteId} onChange={(e) => setDadosForm({ ...dadosForm, pacienteId: e.target.value })}>
                            <option value="#" disabled>Selecione uma opção</option>
                            {pacientesNome.pacientes.map(paciente => (
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
                                    format="HH:ss"
                                    placeholder="HH:ss"
                                    style={{
                                        width: "150px"
                                    }}
                                    onChange={(e) => setDadosForm({ ...dadosForm, start: e })}
                                />
                            </div>
                            <p>às</p>
                            <DatePicker
                                className="data-nascimento"
                                format="HH:ss"
                                placeholder="HH:ss"
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
                            {alunosNome.alunos.map(aluno => (
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

//   resourceID: { type: String, required: true },
//   recorrencia: RecorrenciaSchema,
//   consultaRecorrenteID: { type: String, required: true },
//   AlunoID: { type: String, required: true },

//   Nome: { type: String, required: true },
//   start: { type: Date, required: true },
//   end: { type: Date, required: true },
//   sala: { type: String, required: true },
//   TipoDeConsulta: { type: String, required: true },
//   observacao: { type: String, required: true },
//   statusDaConsulta: { type: String },
//   createAt: { type: Date, default: Date.now },
