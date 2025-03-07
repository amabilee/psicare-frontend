import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import moment from 'moment';
import Select from 'react-select'

export default function EditarAluno({ handleEditarClose, dadosConsulta, renderDadosConsulta }) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosConsulta);
    const [pacientesNome, setPacientesNome] = useState([]);
    const [alunosNome, setAlunosNome] = useState([]);
    const [frequenciaOpcoes, setFrequenciaOptions] = useState([]);

    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleEditarConfirmar = () => {
        if (!dadosAtualizados.Nome || dadosAtualizados.Nome.length <= 6) {
            setMessage("Insira um título válido para a consulta (mínimo 6 caracteres).");
            setState({ ...state, open: true });
            return;
        }
        if (dadosAtualizados.pacienteId === "#") {
            setMessage("Selecione um paciente.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosAtualizados.createAt) {
            setMessage("Insira uma data para a consulta.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosAtualizados.start || !dadosAtualizados.end) {
            setMessage("Insira o horário de início e fim da consulta.");
            setState({ ...state, open: true });
            return;
        }

        const startTime = new Date(dadosAtualizados.start).getTime();
        const endTime = new Date(dadosAtualizados.end).getTime();

        if (startTime >= endTime) {
            setMessage("O horário de início deve ser menor que o horário de término.");
            setState({ ...state, open: true });
            return
        }

        if (!dadosAtualizados.sala) {
            setMessage("Selecione uma sala.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosAtualizados.TipoDeConsulta) {
            setMessage("Selecione o tipo de consulta.");
            setState({ ...state, open: true });
            return;
        }
        if (dadosAtualizados.alunoId === "#") {
            setMessage("Selecione o aluno responsável.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosAtualizados.observacao) {
            setMessage("Insira uma observação.");
            setState({ ...state, open: true });
            return;
        }
        if (!dadosAtualizados.statusDaConsulta) {
            setMessage("Insira um status.");
            setState({ ...state, open: true });
            return;
        } else {
            setIsEditarConfirmar(true);
            setEditar(false);
        }
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = async () => {
        const token = localStorage.getItem("user_token")

        const createAtDate = new Date(dadosAtualizados.createAt);

        const formattedData = {
            ...dadosAtualizados,
            createAt: dadosAtualizados.createAt,
            start: new Date(createAtDate).setHours(
                new Date(dadosAtualizados.start).getHours(),
                new Date(dadosAtualizados.start).getMinutes(),
                new Date(dadosAtualizados.start).getSeconds()
            ),
            end: new Date(createAtDate).setHours(
                new Date(dadosAtualizados.end).getHours(),
                new Date(dadosAtualizados.end).getMinutes(),
                new Date(dadosAtualizados.end).getSeconds()
            )
        };


        formattedData.start = new Date(formattedData.start).toString();
        formattedData.end = new Date(formattedData.end).toString();

        try {
            const renderData = { ...formattedData }
            delete formattedData.createdAt;
            delete formattedData.nomePaciente;
            delete formattedData.nomeAluno;
            await api.patch(`/consulta/${dadosAtualizados._id}`, formattedData, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            setSucessoEditar(true);
            renderDadosConsulta(renderData);
        } catch (e) {
            setState({ ...state, open: true });
            setMessage(e.response.data);
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
        if (dadosAtualizados.intervalo === 'Semanal') {
            setFrequenciaOptions(Array.from({ length: 25 }, (_, i) => ({ value: i + 1, label: String(i + 1) })));
        } else if (dadosAtualizados.intervalo === 'Mensal') {
            setFrequenciaOptions(Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: String(i + 1) })));
        } else if (dadosAtualizados.intervalo === 'Sessão Única') {
            setDadosAtualizados((prevState) => ({
                ...prevState,
                frequenciaIntervalo: '1',
            }));
            setFrequenciaOptions([{ value: 1, label: '1' }]);
        } else {
            setFrequenciaOptions([]);
        }
    }, [dadosAtualizados.intervalo]);

    useEffect(() => {
        buscarPacientes();
        buscarAlunos();
    }, []);

    const changePaciente = (e) => {
        setDadosAtualizados({
            ...dadosAtualizados,
            pacienteId: e.value,
            nomePaciente: e.options[e.selectedIndex].text
        })
    }

    const pacienteOptions = pacientesNome.map((paciente) => ({
        value: paciente._id,
        label: paciente.nome,
    }));

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

    const alunoOptions = alunosNome.map((aluno) => ({
        value: aluno._id,
        label: aluno.nome,
    }));

    const statusOptions = [
        { value: "Pendente", label: "Pendente" },
        { value: "Concluída", label: "Concluída" },
        { value: "Em andamento", label: "Em andamento" },
        { value: "Cancelada", label: "Cancelada" },
        { value: "Paciente Faltou", label: "Paciente Faltou" },
        { value: "Aluno Faltou", label: "Aluno Faltou" }
    ]

    return (
        <>
            {Editar && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edição de consulta</h2>
                        <hr />
                        <div className="formulario">
                            <label>Título da consulta*</label>
                            <input
                                type="text"
                                value={dadosAtualizados.Nome}
                                onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, Nome: e.target.value })}
                                maxLength={256}
                            />

                            <label>Paciente*</label>
                            <Select
                                className="paciente-select"
                                options={pacienteOptions}
                                value={pacienteOptions.find(option => option.value === dadosAtualizados.pacienteId) || null}
                                onChange={(selectedOption) => setDadosAtualizados({
                                    ...dadosAtualizados,
                                    pacienteId: selectedOption.value,
                                    nomePaciente: selectedOption.label
                                })}
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
                                        style={{ width: "160px" }}
                                        value={dadosAtualizados.createAt ? new Date(dadosAtualizados.createAt) : null}
                                        onChange={(e) => setDadosAtualizados({
                                            ...dadosAtualizados,
                                            createAt: e ? new Date(e).toISOString() : null,
                                        })}
                                    />
                                </div>
                                <div className="div-flex">
                                    <label>Intervalo Temporal*</label>
                                    <DatePicker
                                        className="data-nascimento"
                                        format="HH:mm"
                                        placeholder="HH:mm"
                                        style={{ width: "150px" }}
                                        value={dadosAtualizados.start ? new Date(dadosAtualizados.start) : null}
                                        onChange={(e) => setDadosAtualizados({
                                            ...dadosAtualizados,
                                            start: e ? new Date(e).toISOString() : null,
                                        })}
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
                                    hideHours={(hour) => hour < 7 || hour >= 22}
                                    disabledHours={(hour) => hour < 7 || hour >= 22}
                                    value={dadosAtualizados.end ? new Date(dadosAtualizados.end) : null}
                                    onChange={(e) => setDadosAtualizados({
                                        ...dadosAtualizados,
                                        end: e ? new Date(e).toISOString() : null,
                                    })}
                                />

                            </div>

                            <div className="flex-informacoes-pessoais div-flex-consulta">
                                <div className="div-flex">
                                    <label>Sala*</label>
                                    <Select
                                        className="sala-select"
                                        options={roomsOptions}
                                        value={roomsOptions.find(option => option.value === dadosAtualizados.sala) || null}
                                        onChange={(selectedOption) => {
                                            setDadosAtualizados({ ...dadosAtualizados, sala: selectedOption.value });
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
                                        value={consultaOptions.find(option => option.value === dadosAtualizados.TipoDeConsulta) || null}
                                        onChange={(selectedOption) => {
                                            setDadosAtualizados({ ...dadosAtualizados, TipoDeConsulta: selectedOption.value });
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
                                value={alunoOptions.find(option => option.value === dadosAtualizados.alunoId) || null}
                                onChange={(selectedOption) => {
                                    setDadosAtualizados({
                                        ...dadosAtualizados,
                                        alunoId: selectedOption.value,
                                        nomeAluno: selectedOption.label
                                    });
                                }}
                                placeholder="Selecione uma opção"
                                menuPlacement="auto"
                            />

                            <label>Observações*</label>
                            <input type="text" value={dadosAtualizados.observacao} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, observacao: e.target.value })} maxLength={256} />

                            <label>Status da consulta*</label>
                            <Select
                                className="tipo-select"
                                options={statusOptions}
                                value={statusOptions.find(option => option.value === dadosAtualizados.statusDaConsulta) || null}
                                onChange={(selectedOption) => {
                                    setDadosAtualizados({ ...dadosAtualizados, statusDaConsulta: selectedOption.value });
                                }}
                                placeholder="Selecione uma opção"
                                menuPlacement="top"
                            />

                            <span className="campo_obrigatorio">*Campo Obrigatório</span>

                            <div className="buttons-form buttons-form-aluno">
                                <button className="button-voltar" id="voltar" onClick={handleEditarClose} >Cancelar</button>
                                <button className="button-cadastrar" id="cadastrar" onClick={() => handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>
                                    Confirmar
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
            )}
            {isEditarConfirmar && (
                <div className="modal-confirmar">
                    <div className="modal-content-confirmar modal-content-confirmar-consulta">
                        <h2>Confirmar Edição de Consulta</h2>
                        <hr />
                        <div className="dados-inseridos">
                            <div className="coluna1">
                                <div>
                                    <p>Título da consulta</p>
                                    <h1>{dadosAtualizados.Nome}</h1>
                                </div>
                            </div>
                            <div className="coluna2">
                                <div>
                                    <p>Responsável</p>
                                    <h1>{dadosAtualizados.nomeAluno}</h1>
                                </div>
                                <div>
                                    <p>Paciente</p>
                                    <h1>{dadosAtualizados.nomePaciente}</h1>
                                </div>
                                <div>

                                    <p>Observação</p>
                                    <h1>{dadosAtualizados.observacao}</h1>
                                </div>
                            </div>
                            <div className="coluna3">
                                <div>
                                    <p>Local</p>
                                    <h1>{dadosAtualizados.sala}</h1>
                                </div>
                                <div>
                                    <p>Tipo da consulta</p>
                                    <h1>{dadosAtualizados.TipoDeConsulta}</h1>
                                </div>
                            </div>
                            <div className="coluna4">
                                <div>
                                    <p>Data da consulta</p>
                                    <h1>{moment(dadosAtualizados.createAt).format('DD/MM/YYYY')}</h1>
                                </div>
                                <div>
                                    <p>Intervalo de tempo</p>
                                    <h1>{moment(dadosAtualizados.start).format('HH:mm')} - {moment(dadosAtualizados.end).format('HH:mm')}</h1>
                                </div>
                            </div>

                        </div>
                        <div className="buttons-confirmar buttons-confirmar-aluno">
                            <button className="button-voltar-confirmar" id="voltar" onClick={handleVoltarConfirmar} >
                                Voltar
                            </button>
                            <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleSucessoConfirmar}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {SucessoEditar && (
                <div className="modal-sucesso">
                    <div className="modal-sucesso-content">
                        <h1>Sucesso!</h1>
                        <h2>Aluno atualizado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
                    </div>
                </div>
            )}
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity="error" onClose={handleClose} action=" ">
                    {message}
                </Alert>
            </Snackbar>
        </>

    );
}
