import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css"
import ClipIcon from '../../assets/relatorio/clip.svg'
import TrashIcon from '../../assets/excluir-icon.svg'

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';

export default function EditarRelatorio({ handleEditarClose, dadosRelatorio, renderDadosRelatorio }) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosRelatorio);
    const [pacientesNome, setPacientesNome] = useState({ pacientes: [] });
    const [alunosNome, setAlunosNome] = useState({ alunos: [] });
    const [userLevel, setUserLevel] = useState(null);

    console.log(dadosRelatorio)

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

    const handleEditarConfirmar = () => () => {
        if (!dadosAtualizados.pacienteId) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um paciente.");
        }
        if (userLevel === '0' && !dadosAtualizados.alunoUnieva && !dadosAtualizados.funcionarioUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione o status do encaminhador.");
        }
        if (userLevel === '0' && dadosAtualizados.alunoUnieva && !dadosAtualizados.alunoId) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um aluno.");
        }
        if (userLevel === '0' && dadosAtualizados.funcionarioUnieva && !dadosAtualizados.nome_funcionario) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o nome do funcionário.");
        }
        if (!dadosAtualizados.conteudo) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o conteúdo do relatório.");
        }
        if (!dadosAtualizados.dataCriacao) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Escreva a data de criação.");
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
        console.log(dadosAtualizados)
        const token = localStorage.getItem("user_token");
        try {
            const formData = new FormData();
            formData.append("pacienteId", dadosAtualizados.pacienteId);
            if (userLevel == '0') {
                formData.append("alunoId", dadosAtualizados.alunoId);
                formData.append("alunoUnieva", dadosAtualizados.alunoUnieva);
                formData.append("funcionarioUnieva", dadosAtualizados.funcionarioUnieva);
                formData.append("nome_funcionario", dadosAtualizados.nome_funcionario);
            }
            formData.append("conteudo", dadosAtualizados.conteudo);
            formData.append("dataCriacao", dadosAtualizados.dataCriacao);
            dadosAtualizados.prontuario.forEach((file) => {
                formData.append('prontuario', file);
            });

            const dadosEnviados = await api.patch(`/relatorio/${dadosAtualizados._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            });

            console.log(dadosEnviados);
            setSucessoEditar(true);
            renderDadosRelatorio(dadosEnviados);
        } catch (e) {
            setState({ ...state, open: true });
            setMessage(e.response.data.error);
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setDadosAtualizados({ ...dadosAtualizados, prontuario: [...dadosAtualizados.prontuario, ...files] });
        console.log(files)
    };

    const handleRemoveFile = (index) => {
        const updatedProntuario = dadosAtualizados.prontuario.filter((_, i) => i !== index);
        setDadosAtualizados({ ...dadosAtualizados, prontuario: updatedProntuario });
        console.log(updatedProntuario)
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

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <>
            {Editar && (
                <div className="modal-editar" >
                    <div className="modal-content modal-content-relatorio">
                        <h2>Edição de relatório</h2>
                        <hr />
                        <div className="formulario">
                            <h2>Informações de tratamento</h2>
                            <div className="flex-informacoes-tratamento">
                                <div className="div-flex">
                                    <label htmlFor="pacienteNome">Paciente*</label>
                                    <select id="pacienteNome" value={dadosAtualizados.pacienteId} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, pacienteId: e.target.value })} required>
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
                                                value={dadosAtualizados.alunoUnieva ? "Aluno" : dadosAtualizados.funcionarioUnieva ? "Funcionário" : ""}
                                                onChange={(e) => {
                                                    setDadosAtualizados({
                                                        ...dadosAtualizados,
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
                                            {dadosAtualizados.alunoUnieva ? (
                                                <select
                                                    className="encaminhadorSelect" id="encaminhadorSelect"
                                                    value={dadosAtualizados.alunoId}
                                                    onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, alunoId: e.target.value })}
                                                    disabled={!dadosAtualizados.alunoUnieva}>
                                                    <option value="" disabled>Selecione uma opção</option>
                                                    {alunosNome.alunos.map(aluno => (
                                                        <option key={aluno._id} value={aluno._id}>
                                                            {aluno.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                                    value={dadosAtualizados.nome_funcionario}
                                                    onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, nome_funcionario: e.target.value })}
                                                    disabled={!dadosAtualizados.funcionarioUnieva}
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
                                    value={new Date(dadosAtualizados.dataCriacao)}
                                    onChange={(e) =>
                                        setDadosAtualizados({ ...dadosAtualizados, dataCriacao: e })
                                    }
                                />
                            </div>
                            <div className="flex-informacoes-relatorio">
                                <div className="div-flex">
                                    <label htmlFor="conteudoRelatorio">Conteúdo*</label>
                                    <div className="textarea-container">
                                        <textarea
                                            name="conteudoRelatorio"
                                            value={dadosAtualizados.conteudo}
                                            onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, conteudo: e.target.value })}
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
                                            {dadosAtualizados.prontuario.map((arquivo, index) => (
                                                <div key={index}>
                                                    <p>{arquivo.nome ? arquivo.nome : arquivo.name}</p>
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
                                <button className="button-voltar" id="voltar" onClick={handleEditarClose} >Cancelar</button>
                                <button className="button-cadastrar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isEditarConfirmar && (
                <div className="modal-confirmar">
                    <div className="modal-content-confirmar modal-content-confirmar-relatorio">
                        <h2>Confirmar Edição de Relatório</h2>
                        <hr />
                        <div className="dados-inseridos">
                            <div className="coluna1">
                                <div className="nome">
                                    <p>Paciente</p>
                                    <h1>
                                        {pacientesNome.pacientes.find(paciente => paciente._id === dadosAtualizados.pacienteId)?.nome || "Nome não encontrado"}
                                    </h1>
                                </div>
                                <div className="nome">
                                    <p>Encaminhador</p>
                                    <h1>
                                        {alunosNome.alunos.find(aluno => aluno._id === dadosAtualizados.alunoId)?.nome || "Nome não encontrado"}
                                    </h1>
                                </div>
                            </div>
                            <div className="coluna2">
                                <div className="cpf-aluno">
                                    <p>Data de criação</p>
                                    <h1>{formatarData(dadosAtualizados.dataCriacao)}</h1>
                                </div>
                                <div className="telefone">
                                    <p>Conteudo</p>
                                    <h1>{dadosAtualizados.conteudo}</h1>
                                </div>
                            </div>
                            <div className="coluna3">
                                <div className="email">
                                    <p>Prontuário</p>
                                    {dadosAtualizados.prontuario.map((arquivo, index) => (
                                        <h1 key={index}> {arquivo.nome ? arquivo.nome : arquivo.name}</h1>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="buttons-confirmar buttons-confirmar-relatorio">
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
                        <h2>Relatório editado com sucesso.</h2>
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
                <Alert variant="filled" severity="error" onClose={handleClose} action="">
                    {typeof message === 'string' ? message : ''}
                </Alert>

            </Snackbar>
        </>
    )
}