import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import moment from 'moment';

export default function EditarAluno({ handleEditarClose, dadosConsulta, renderDadosConsulta }) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosConsulta);
    const [pacientesNome, setPacientesNome] = useState([]);
    const [alunosNome, setAlunosNome] = useState([]);
    const [frequenciaOpcoes, setFrequenciaOpcoes] = useState([]);

    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleEditarConfirmar = (newState) => {
        if (!dadosAtualizados.Nome || dadosAtualizados.Nome.length <= 6) {
            setMessage("Insira um título válido para a consulta (mínimo 6 caracteres).");
            setState({ ...newState, open: true });
            return;
        }
        if (dadosAtualizados.pacienteId === "#") {
            setMessage("Selecione um paciente.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.createAt) {
            setMessage("Insira uma data para a consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.start || !dadosAtualizados.end) {
            setMessage("Insira o horário de início e fim da consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.sala) {
            setMessage("Selecione uma sala.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.TipoDeConsulta) {
            setMessage("Selecione o tipo de consulta.");
            setState({ ...newState, open: true });
            return;
        }
        if (dadosAtualizados.alunoId === "#") {
            setMessage("Selecione o aluno responsável.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.observacao) {
            setMessage("Insira uma observação.");
            setState({ ...newState, open: true });
            return;
        }
        if (!dadosAtualizados.statusDaConsulta) {
            setMessage("Insira um status.");
            setState({ ...newState, open: true });
            return;
        } else {
            console.log(dadosAtualizados)
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
        delete formattedData.createdAt;
        formattedData.start = new Date(formattedData.start).toString();
        formattedData.end = new Date(formattedData.end).toString();

        try {
            await api.patch(`/consulta/${dadosAtualizados._id}`, formattedData, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            setSucessoEditar(true);
            renderDadosConsulta(formattedData);
        } catch (e) {
            console.log(e)
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
        if (dadosAtualizados.intervalo === 'Semanal') {
            setFrequenciaOpcoes(Array.from({ length: 25 }, (_, i) => i + 1));
        } else if (dadosAtualizados.intervalo === 'Mensal') {
            setFrequenciaOpcoes(Array.from({ length: 6 }, (_, i) => i + 1));
        } else if (dadosAtualizados.intervalo === 'Sessão Única') {
            setDadosAtualizados((prevState) => ({
                ...prevState,
                frequenciaIntervalo: '1',
            }));
            setFrequenciaOpcoes(Array.from({ length: 1 }, (_, i) => i + 1));
        } else {
            setFrequenciaOpcoes([]);
        }
    }, [dadosAtualizados.intervalo]);

    useEffect(() => {
        buscarPacientes();
        buscarAlunos();
        console.log(dadosAtualizados)
    }, []);

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
                            />

                            <label>Paciente*</label>
                            <select
                                className="professorNome"
                                value={dadosAtualizados.pacienteId}
                                onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, pacienteId: e.target.value })}
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
                                    />
                                </div>
                                <p>às</p>
                                <DatePicker
                                    className="data-nascimento"
                                    format="HH:mm"
                                    placeholder="HH:mm"
                                    style={{ width: "150px" }}
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
                                    <select className="sexo"
                                        value={dadosAtualizados.sala}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, sala: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        {Array.from({ length: 10 }, (_, i) => `Sala ${i + 1}`).map(sala => (
                                            <option key={sala} value={sala}>{sala}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="div-flex">
                                    <label>Tipo da consulta*</label>
                                    <select className="sexo"
                                        value={dadosAtualizados.TipoDeConsulta}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, TipoDeConsulta: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Casal">Casal</option>
                                        <option value="Familiar">Familiar</option>
                                    </select>
                                </div>
                            </div>

                            <label>Aluno responsável*</label>
                            <select className="professorNome" value={dadosAtualizados.alunoId} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, alunoId: e.target.value })}>
                                <option value="#" disabled>Selecione uma opção</option>
                                {alunosNome.map(aluno => (
                                    <option key={aluno._id} value={aluno._id}>
                                        {aluno.nome}
                                    </option>
                                ))}
                            </select>

                            <label>Observações*</label>
                            <input type="text" value={dadosAtualizados.observacao} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, observacao: e.target.value })} />

                            <label>Status da consulta*</label>
                            <select
                                className="professorNome"
                                value={dadosAtualizados.statusDaConsulta}
                                onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, statusDaConsulta: e.target.value })}
                            >
                                <option value="Pendente">Pendente</option>
                                <option value="Concluída">Concluída</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Cancelada">Cancelada</option>
                                <option value="Paciente faltou">Paciente faltou</option>
                                <option value="Aluno faltou">Aluno faltou</option>
                            </select>

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
