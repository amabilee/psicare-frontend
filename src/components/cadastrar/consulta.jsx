import React, { useState, useEffect } from "react";

import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import Select from 'react-select'

import "./style.css"

export default function CadastrarConsulta({ handleCloseModal, renderTable }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [pacientesNome, setPacientesNome] = useState([]);
    const [alunosNome, setAlunosNome] = useState([]);
    const [frequenciaOptions, setFrequenciaOptions] = useState([]);
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

    const handleFormSubmit = async () => {
        if (!dadosForm.Nome || dadosForm.Nome.length <= 6) {
            setMessage("Insira um título válido para a consulta (mínimo 6 caracteres).");
            setState({ ...state, open: true });
            return;
        }
        if (dadosForm.pacienteId === "#") {
            setMessage("Selecione um paciente.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosForm.createAt) {
            setMessage("Insira uma data para a consulta.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosForm.start || !dadosForm.end) {
            setMessage("Insira o horário de início e fim da consulta.");
            setState({ ...state, open: true });
            return;
        }

        const startTime = new Date(dadosForm.start).getTime();
        const endTime = new Date(dadosForm.end).getTime();

        if (startTime >= endTime) {
            setMessage("O horário de início deve ser menor que o horário de término.");
            setState({ ...state, open: true });
            return
        }

        if (!dadosForm.sala) {
            setMessage("Selecione uma sala.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosForm.TipoDeConsulta) {
            setMessage("Selecione o tipo de consulta.");
            setState({ ...state, open: true });
            return;
        }
        if (dadosForm.alunoId === "#") {
            setMessage("Selecione o aluno responsável.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosForm.intervalo) {
            setMessage("Selecione o intervalo.");
            setState({ ...state, open: true });
            return;
        }
        if (dadosForm.intervalo !== "Sessão Única" && !dadosForm.frequenciaIntervalo) {
            setMessage("Selecione a frequência do intervalo.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosForm.observacao) {
            setMessage("Insira uma observação.");
            setState({ ...state, open: true });
            return;
        }

        const createAtDate = new Date(dadosForm.createAt);

        const formattedData = {
            ...dadosForm,
            createAt: createAtDate.toString(),
            start: new Date(createAtDate).setHours(
                new Date(dadosForm.start).getHours(),
                new Date(dadosForm.start).getMinutes(),
                new Date(dadosForm.start).getSeconds()
            ),
            end: new Date(createAtDate).setHours(
                new Date(dadosForm.end).getHours(),
                new Date(dadosForm.end).getMinutes(),
                new Date(dadosForm.end).getSeconds()
            )
        };
        formattedData.start = new Date(formattedData.start).toString();
        formattedData.end = new Date(formattedData.end).toString();

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
            renderTable();
        } catch (e) {
            setMessage(e.response.data.error);
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
            setState({ ...state, open: true });
            setMessage("Erro ao buscar pacientes");
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
            setState({ ...state, open: true });
            setMessage("Erro ao buscar alunos");
        }
    };

    useEffect(() => {
        if (dadosForm.intervalo === 'Semanal') {
            setFrequenciaOptions(Array.from({ length: 25 }, (_, i) => ({ value: i + 1, label: String(i + 1) })));
        } else if (dadosForm.intervalo === 'Mensal') {
            setFrequenciaOptions(Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: String(i + 1) })));
        } else if (dadosForm.intervalo === 'Sessão Única') {
            setDadosForm((prevState) => ({
                ...prevState,
                frequenciaIntervalo: '1',
            }));
            setFrequenciaOptions([{ value: 1, label: '1' }]);
        } else {
            setFrequenciaOptions([]);
        }
    }, [dadosForm.intervalo]);

    const roomsOptions = [
        { value: "Sala 1", label: "Sala 1" },
        { value: "Sala 2", label: "Sala 2" },
        { value: "Sala 3", label: "Sala 3" },
        { value: "Sala 4", label: "Sala 4" },
        { value: "Sala 5", label: "Sala 5" },
        { value: "Sala 6", label: "Sala 6" },
        { value: "Sala 7", label: "Sala 7" },
        { value: "Sala 8", label: "Sala 8" },
        { value: "Sala 9", label: "Sala 9" },
        { value: "Sala 10", label: "Sala 10" }
    ]

    const consultaOptions = [
        { value: "Individual", label: "Individual" },
        { value: "Casal", label: "Casal" },
        { value: "Familiar", label: "Familiar" }
    ]

    const intervaloOptions = [
        { value: "Sessão Única", label: "Sessão Única" },
        { value: "Semanal", label: "Semanal" },
        { value: "Mensal", label: "Mensal" }
    ]

    const pacienteOptions = pacientesNome.map((paciente) => ({
        value: paciente._id,
        label: paciente.nome,
    }));

    const alunoOptions = alunosNome.map((aluno) => ({
        value: aluno._id,
        label: aluno.nome,
    }));

    return (
        <>
            <div className="modal" >
                <div className="modal-content">
                    <h2>Cadastro de consulta</h2>
                    <hr />
                    <div className="formulario">
                        <label>Título da consulta*</label>
                        <input type="text" value={dadosForm.Nome} onChange={(e) => setDadosForm({ ...dadosForm, Nome: e.target.value })} maxLength={256} />

                        <label>Paciente*</label>
                        <Select
                            className="paciente-select"
                            options={pacienteOptions}
                            value={pacienteOptions.find(option => option.value === dadosForm.pacienteId) || null}
                            onChange={(selectedOption) => {
                                setDadosForm({ ...dadosForm, pacienteId: selectedOption.value });
                            }}
                            placeholder="Selecione uma opção"
                            menuPlacement="auto"
                        />

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
                                    style={{ width: "150px" }}
                                    onChange={(e) => setDadosForm({ ...dadosForm, start: e })}
                                    hideHours={(hour) => hour < 7 || hour >= 22}
                                    disabledHours={(hour) => hour < 7 || hour >= 22}
                                />
                            </div>
                            <p>às</p>
                            <DatePicker
                                className="data-nascimento data-termino"
                                format="HH:mm"
                                placeholder="HH:mm"
                                style={{ width: "150px" }}
                                onChange={(e) => setDadosForm({ ...dadosForm, end: e })}
                                hideHours={(hour) => hour < 7 || hour >= 22}
                                disabledHours={(hour) => hour < 7 || hour >= 22}
                            />

                        </div>
                        <div className="flex-informacoes-pessoais div-flex-consulta">
                            <div className="div-flex">
                                <label>Sala*</label>
                                <Select
                                    className="sala-select"
                                    options={roomsOptions}
                                    value={roomsOptions.find(option => option.value === dadosForm.sala) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, sala: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma sala"
                                    menuPlacement="auto"
                                />
                            </div>
                            <div className="div-flex">
                                <label>Tipo da consulta*</label>
                                <Select
                                    className="tipo-select"
                                    options={consultaOptions}
                                    value={consultaOptions.find(option => option.value === dadosForm.TipoDeConsulta) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, TipoDeConsulta: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>

                        <label>Aluno responsável*</label>
                        <Select
                            className="paciente-select"
                            options={alunoOptions}
                            value={alunoOptions.find(option => option.value === dadosForm.alunoId) || null}
                            onChange={(selectedOption) => {
                                setDadosForm({ ...dadosForm, alunoId: selectedOption.value });
                            }}
                            placeholder="Selecione uma opção"
                            menuPlacement="auto"
                        />
                        <div className="flex-informacoes-pessoais div-flex-consulta">
                            <div className="div-flex">
                                <label>Intervalo*</label>
                                <Select
                                className="intervalo-select"
                                    options={intervaloOptions}
                                    value={intervaloOptions.find(option => option.value === dadosForm.intervalo) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, intervalo: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                            <div className="div-flex" style={{ marginLeft: "20px" }}>
                                <label>Frequência do intervalo*</label>
                                <Select
                                    className="frequencia-select"
                                    options={frequenciaOptions}
                                    value={frequenciaOptions.find(option => option.value === Number(dadosForm.frequenciaIntervalo)) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, frequenciaIntervalo: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                    isDisabled={dadosForm.intervalo === 'Sessão Única'}
                                />
                            </div>
                        </div>

                        <label>Observações*</label>
                        <input type="text" value={dadosForm.observacao} onChange={(e) => setDadosForm({ ...dadosForm, observacao: e.target.value })} maxLength={256} />

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
