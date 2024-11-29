import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css"
import ClipIcon from '../../assets/relatorio/clip.svg'
import TrashIcon from '../../assets/excluir-icon.svg'

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';

export default function CadastrarRelatorio({ handleCloseModal, renderForm }) {
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [userLevel, setUserLevel] = useState(null);
    const [pacientesNome, setPacientesNome] = useState({ pacientes: [] });
    const [alunosNome, setAlunosNome] = useState({ alunos: [] });
    const [dadosForm, setDadosForm] = useState({
        pacienteId: "#",
        alunoId: "",
        alunoUnieva: false,
        funcionarioUnieva: false,
        nome_funcionario: "",
        conteudo: "",
        dataCriacao: "",
        prontuario: []
    });

    useEffect(() => {
        buscarPacientes();
        buscarAlunos();
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
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

    const handleFormSubmit = () => async () => {
        const token = localStorage.getItem("user_token");
        if (!dadosForm.pacienteId) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um paciente.");
            return;
        }
        if (userLevel === '0' && !dadosForm.alunoUnieva && !dadosForm.funcionarioUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione o status do encaminhador.");
            return;
        }
        if (userLevel === '0' && dadosForm.alunoUnieva && !dadosForm.alunoId) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um aluno.");
            return;
        }
        if (userLevel === '0' && dadosForm.funcionarioUnieva && !dadosForm.nome_funcionario) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o nome do funcionário.");
            return;
        }
        if (!dadosForm.conteudo) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o conteúdo do relatório.");
            return;
        }
        if (!dadosForm.dataCriacao) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Escreva a data de criação.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("pacienteId", dadosForm.pacienteId);
            if (userLevel == '0') {
                formData.append("alunoId", dadosForm.alunoId);
                formData.append("alunoUnieva", dadosForm.alunoUnieva);
                formData.append("funcionarioUnieva", dadosForm.funcionarioUnieva);
                formData.append("nome_funcionario", dadosForm.nome_funcionario);
            }
            formData.append("conteudo", dadosForm.conteudo);
            formData.append("dataCriacao", dadosForm.dataCriacao);
            dadosForm.prontuario.forEach((file) => {
                formData.append('prontuario', file);
            });

            const dadosEnviados = await api.post("/relatorio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            });

            setIsSucessModalOpen(true);
            renderForm(true);
        } catch (e) {
            setState({ ...state, open: true });
            setMessage(e.response.data.error);
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setDadosForm({ ...dadosForm, prontuario: [...dadosForm.prontuario, ...files] });
    };

    const handleRemoveFile = (index) => {
        const updatedProntuario = dadosForm.prontuario.filter((_, i) => i !== index);
        setDadosForm({ ...dadosForm, prontuario: updatedProntuario });
    };


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
                                    <option value="#">Selecione uma opção</option>
                                    {pacientesNome.pacientes.map(paciente => (
                                        <option key={paciente._id} value={paciente._id}>
                                            {paciente.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(userLevel === '0') && (
                                <>
                                    <div className="div-flex">
                                        <label htmlFor="status">Status Encaminhador*</label>
                                        <select className="status" name="status" id="status"
                                            value={dadosForm.alunoUnieva ? "Aluno" : dadosForm.funcionarioUnieva ? "Funcionário" : ""}
                                            onChange={(e) => {
                                                setDadosForm({
                                                    ...dadosForm,
                                                    alunoUnieva: e.target.value === "Aluno",
                                                    funcionarioUnieva: e.target.value === "Funcionário",
                                                    nome_funcionario: "",
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
                                </>
                            )}
                        </div>
                        <h2>Informações de relatório</h2>
                        <div className="div-flex input-data">
                            <label>Data de criação*</label>
                            <DatePicker
                                format="dd/MM/yyyy"
                                placeholder="dd/mm/aaaa"
                                onChange={(e) => setDadosForm({ ...dadosForm, dataCriacao: e })}
                            />
                        </div>
                        <div className="flex-informacoes-relatorio">
                            <div className="div-flex">
                                <label htmlFor="conteudoRelatorio">Conteúdo*</label>
                                <div className="textarea-container">
                                    <textarea
                                        name="conteudoRelatorio"
                                        value={dadosForm.conteudo}
                                        onChange={(e) => setDadosForm({ ...dadosForm, conteudo: e.target.value })}
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        style={{ display: 'none' }}
                                        id="fileUpload"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="fileUpload" className="clip-icon-label">
                                        <img src={ClipIcon} alt="Attach" className="clip-icon" />
                                    </label>
                                    <div className="files-added">
                                        {dadosForm.prontuario.map((arquivo, index) => (
                                            <div key={index}>
                                                <p>{arquivo.name}</p>
                                                <img src={TrashIcon}
                                                    alt="Remove"
                                                    className="trash-icon"
                                                    onClick={() => handleRemoveFile(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                        <h2>Relatório cadastrado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )}
        </>
    )
}