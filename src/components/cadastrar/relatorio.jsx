import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css"

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';

export default function CadastrarRelatorio({ handleCloseModal, renderForm }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [pacientesNome, setPacientesNome] = useState({ pacientes: [] });
    const [alunosNome, setAlunosNome] = useState({ alunos: [] });
    const [dadosForm, setDadosForm] = useState({
        pacienteId: "",
        alunoId: "",
        alunoUnieva: false,
        funcionarioUnieva: false,
        nome_funcionario: "",
        conteudo: "",
        dataCriacao: ""
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
        // if (dadosForm.nome.length <= 6) {
        //     setState({ ...newState, open: true });
        //     setMessage("Insira o nome completo.");
        // } else if (!cpf.isValid(dadosForm.cpf)) {
        //     setState({ ...newState, open: true });
        //     setMessage("Insira um cpf válido.");
        // } else if (dadosForm.telefone.length != 15) {
        //     setState({ ...newState, open: true });
        //     setMessage("Insira um telefone válido.");
        // } else if (dadosForm.professorId === "#") {
        //     setState({ ...newState, open: true });
        //     setMessage("Selecione um professor.")
        // } else if (dadosForm.matricula.length < 7) {
        //     setState({ ...newState, open: true });
        //     setMessage("Insira a matrícula.");
        // } else if (dadosForm.periodo === 0) {
        //     setState({ ...newState, open: true });
        //     setMessage("Selecione um periodo.")
        // }
        console.log(dadosForm)
        // else {
        // const token = localStorage.getItem("user_token")
        // console.log(dadosForm)
        // try {
        //     const dadosEnviados = await api.post("/relatorio", dadosForm, {
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


    const buscarPacientes = async () => {
        const token = localStorage.getItem("user_token")
        try {
            const selectPacientes = await api.get(`/paciente`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setPacientesNome(selectPacientes.data);
        } catch (e) {
            if (e.response.status == 401) {
                signOut()
            } else {
                console.log("Erro ao buscar pacientes", e)
            }
        }
    }

    const buscarAlunos = async () => {
        const token = localStorage.getItem("user_token")
        try {
            const selectAlunos = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });
            setAlunosNome(selectAlunos.data);
        } catch (e) {
            if (e.response.status == 401) {
                signOut()
            } else {
                console.log("Erro ao buscar alunos", e)
            }
        }
    }

    return (
        <>
            <div className="modal" >
                <div className="modal-content modal-content-relatorio">
                    <h2>Cadastro de relatório</h2>
                    <hr />
                    <div className="formulario">
                        <h2>Informações de tratamento</h2>
                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="pacienteNome">Paciente*</label>
                                <select id="pacienteNome" value={dadosForm.pacienteId} onChange={(e) => setDadosForm({ ...dadosForm, pacienteId: e.target.value })} required>
                                    <option value="#" disabled>Selecione uma opção</option>
                                    {pacientesNome.pacientes.map(paciente => (
                                        <option key={paciente._id} value={paciente._id}>
                                            {paciente.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="div-flex">
                                <label htmlFor="status">Status Encaminhador*</label>
                                <select className="status" name="status" id="status"
                                    value={dadosForm.alunoUnieva ? "Aluno" : dadosForm.funcionarioUnieva ? "Funcionário" : ""}
                                    onChange={(e) => {
                                        setDadosForm({
                                            ...dadosForm,
                                            alunoUnieva: e.target.value === "Aluno",
                                            funcionarioUnieva: e.target.value === "Funcionário",
                                            encaminhador: "",
                                            alunoId: ""
                                        })
                                    }}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="Aluno">Aluno</option>
                                    <option value="Funcionário">Funcionário</option>
                                </select>
                            </div>
                            <div className="div-flex">
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                                {dadosForm.alunoUnieva ? (
                                    <select
                                        className="encaminhadorSelect" id="encaminhadorSelect"
                                        value={dadosForm.alunoId}
                                        onChange={(e) => setDadosForm({ ...dadosForm, alunoId: e.target.value })}
                                        disabled={!dadosForm.alunoUnieva}>
                                        <option value="" disabled>Selecione uma opção</option>
                                        {alunosNome.alunos.map(aluno => (
                                            <option key={aluno._id} value={aluno._id}>
                                                {aluno.nome}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                        value={dadosForm.nome_funcionario}
                                        onChange={(e) => setDadosForm({ ...dadosForm, nome_funcionario: e.target.value })}
                                        disabled={!dadosForm.funcionarioUnieva}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Informações de relatório</h2>
                        <div className="div-flex input-data">
                            <label>Data de criação*</label>
                            <DatePicker
                                // className="data-nascimento"
                                format="dd/MM/yyyy"
                                placeholder="dd/mm/aaaa"
                                onChange={(e) => setDadosForm({ ...dadosForm, dataCriacao: e })}
                            />
                        </div>
                        <div className="flex-informacoes-relatorio">
                            <div className="div-flex">
                                <label htmlFor="conteudoRelatorio">Conteúdo*</label>
                                <textarea
                                    name="conteudoRelatorio"
                                    value={dadosForm.conteudo}
                                    onChange={(e) => setDadosForm({ ...dadosForm, conteudo: e.target.value })}
                                >
                                </textarea>
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