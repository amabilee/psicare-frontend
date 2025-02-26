import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css"
import ClipIcon from '../../assets/relatorio/clip.svg'
import TrashIcon from '../../assets/excluir-icon.svg'
import Download from "../../assets/download.svg"

import { UseAuth } from '../../hooks';

import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';

export default function EditarRelatorio({ handleEditarClose, dadosRelatorio, renderDadosRelatorio }) {
    const { signOut } = UseAuth();
    const [isSending, setIsSending] = useState(false)
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosRelatorio);
    const [pacientesNome, setPacientesNome] = useState({ pacientes: [] });
    const [alunosNome, setAlunosNome] = useState({ alunos: [] });
    const [userLevel, setUserLevel] = useState(null);

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
            return;
        }
        if (userLevel === '0' && !dadosAtualizados.alunoUnieva && !dadosAtualizados.funcionarioUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione o status do encaminhador.");
            return;
        }
        if (userLevel === '0' && dadosAtualizados.alunoUnieva && !dadosAtualizados.alunoId) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um aluno.");
            return;
        }
        if (userLevel === '0' && dadosAtualizados.funcionarioUnieva && !dadosAtualizados.nome_funcionario) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o nome do funcionário.");
            return;
        }
        if (!dadosAtualizados.conteudo) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Preencha o conteúdo do relatório.");
            return;
        }
        if (!dadosAtualizados.dataCriacao) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Escreva a data de criação.");
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
        const token = localStorage.getItem("user_token");
        try {

            const removedProntuarios = getRemovedFiles(dadosRelatorio.prontuario, dadosAtualizados.prontuario);
            const removedAssinaturas = getRemovedFiles(dadosRelatorio.assinatura, dadosAtualizados.assinatura);

            const deleteFiles = async (files) => {
                for (const file of files) {
                    const fileId = file.id.split('/').pop();
                    await api.delete(`/relatorio/arquivo/${fileId}`, {
                        headers: {
                            "authorization": `Bearer ${token}`
                        }
                    });
                }
            };

            await deleteFiles(removedProntuarios);
            await deleteFiles(removedAssinaturas);

            const formData = new FormData();
            formData.append("pacienteId", dadosAtualizados.pacienteId);
            if (userLevel == '0') {
                formData.append("alunoUnieva", dadosAtualizados.alunoUnieva);
                if (dadosAtualizados.alunoUnieva) {
                    formData.append("alunoId", dadosAtualizados.alunoId);
                }
                formData.append("funcionarioUnieva", dadosAtualizados.funcionarioUnieva);
                if (dadosAtualizados.funcionarioUnieva) {
                    formData.append("nome_funcionario", dadosAtualizados.nome_funcionario);
                }
            }
            formData.append("conteudo", dadosAtualizados.conteudo);
            formData.append("dataCriacao", dadosAtualizados.dataCriacao);
            dadosAtualizados.prontuario.forEach((file) => {
                formData.append('prontuario', file);
            });
            dadosAtualizados.assinatura.forEach((file) => {
                formData.append('assinatura', file);
            });
            setIsSending(true);
            await api.patch(`/relatorio/${dadosAtualizados._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "authorization": `Bearer ${token}`
                }
            });
        } catch (e) {
            if (!e.response.data.message.includes("Aluno não")) {
                setState({ ...state, open: true });
                setMessage(e.response.data.message);
            }
        } finally {
            setSucessoEditar(true);
            renderDadosRelatorio(dadosAtualizados);
            setIsSending(false);
        }
    }

    const handleFileChange = (e) => {
        let files = Array.from(e.target.files);
        setDadosAtualizados({ ...dadosAtualizados, prontuario: [...dadosAtualizados.prontuario, ...files] });
    };

    const handleFileChangeAssinatura = (e) => {
        let filesAssinatura = Array.from(e.target.files);
        setDadosAtualizados({ ...dadosAtualizados, assinatura: [...dadosAtualizados.assinatura, ...filesAssinatura] });
    };

    const handleRemoveFile = (index) => {
        const updatedProntuario = dadosAtualizados.prontuario.filter((_, i) => i !== index);
        setDadosAtualizados({ ...dadosAtualizados, prontuario: updatedProntuario });
    };

    const handleRemoveFileAssinatura = (index) => {
        const updatedAssinatura = dadosAtualizados.assinatura.filter((_, i) => i !== index);
        setDadosAtualizados({ ...dadosAtualizados, assinatura: updatedAssinatura });
    };

    const handleDownloadFile = (index) => {
        const updatedProntuario = dadosAtualizados.prontuario[index];
        const fullURL = `${api.defaults.baseURL}${updatedProntuario.id}`;

        window.open(fullURL, '_blank');
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
                setState({ ...state, open: true });
                setMessage("Erro ao buscar pacientes");
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
            } else if (!e.response.data.message.includes("Acesso negado")) {
                setState({ ...state, open: true });
                setMessage("Erro ao buscar alunos");
            }
        }
    }

    const getRemovedFiles = (originalFiles, updatedFiles) => {
        const updatedFileIds = updatedFiles.map(file => file.id || file.nome);
        return originalFiles.filter(file => !updatedFileIds.includes(file.id || file.nome));
    };


    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
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
                                {userLevel === '2' ? (
                                    <>
                                        <div className="div-flex">
                                            <label htmlFor="pacienteNome">Paciente</label>
                                            <h3>{dadosAtualizados.nomePaciente}</h3>
                                        </div>
                                        <div className="div-flex">
                                            <label htmlFor="pacienteNome">Encaminhador</label>
                                            <h3>{dadosAtualizados.nomeAluno ? dadosAtualizados.nomeAluno : dadosAtualizados.nome_funcionario}</h3>
                                        </div>
                                        <div className="div-flex">
                                            <label>Data de criação</label>
                                            <h3>{formatarData(dadosAtualizados.dataCriacao)}</h3>
                                        </div>
                                    </>
                                ) : (
                                    <div className="div-flex">
                                        <label htmlFor="pacienteNome">Paciente*</label>
                                        <select id="pacienteNome" value={dadosAtualizados.pacienteId} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, pacienteId: e.target.value })} required>
                                            <option value="#">Selecione uma opção</option>
                                            {pacientesNome.pacientes.map(paciente => (
                                                <option key={paciente._id} value={paciente._id}>
                                                    {paciente.nome}
                                                </option>
                                            ))}

                                            {!pacientesNome.pacientes.some(paciente => paciente._id === dadosAtualizados.pacienteId) &&
                                                dadosAtualizados.pacienteId && (
                                                    <option value={dadosAtualizados.pacienteId}>
                                                        {dadosAtualizados.nomePaciente}
                                                    </option>
                                                )
                                            }
                                        </select>

                                        {!pacientesNome.pacientes.some(paciente => paciente._id === dadosAtualizados.pacienteId) &&
                                            dadosAtualizados.pacienteId && (
                                                <p className="warning-message">O paciente selecionado não está mais ativo.<br/>Caso seja alterado, não será possível selecioná-lo novamente.</p>
                                            )
                                        }
                                    </div>
                                )}
                                {(userLevel === '0') && (
                                    <>
                                        <div className="div-flex">
                                            <label htmlFor="status">Status Encaminhador*</label>
                                            <select className="status" name="status" id="status"
                                                value={dadosAtualizados.alunoUnieva ? "Aluno" : dadosAtualizados.funcionarioUnieva ? "Funcionário" : ""}
                                                onChange={(e) => {
                                                    setDadosAtualizados({
                                                        ...dadosAtualizados,
                                                        alunoUnieva: e.target.value === "Aluno" ? true : false,
                                                        funcionarioUnieva: e.target.value === "Funcionário" ? true : false,
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
                                                <>
                                                    <select
                                                        className="encaminhadorSelect" id="encaminhadorSelect"
                                                        value={dadosAtualizados.alunoId}
                                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, alunoId: e.target.value })}
                                                        disabled={!dadosAtualizados.alunoUnieva}>
                                                        <option value="">Selecione uma opção</option>
                                                        {alunosNome.alunos
                                                            .filter(aluno =>
                                                                pacientesNome.pacientes.some(paciente => paciente.alunoId === aluno._id)
                                                            )
                                                            .map(aluno => (
                                                                <option key={aluno._id} value={aluno._id}>
                                                                    {aluno.nome}
                                                                </option>
                                                            ))}

                                                        {!alunosNome.alunos.some(aluno => aluno._id === dadosAtualizados.alunoId) &&
                                                            dadosAtualizados.alunoId && (
                                                                <option value={dadosAtualizados.alunoId}>
                                                                    {dadosAtualizados.nomeAluno}
                                                                </option>
                                                            )
                                                        }

                                                    </select>
                                                    {!alunosNome.alunos.some(aluno => aluno._id === dadosAtualizados.alunoId) &&
                                                        dadosAtualizados.alunoId && (
                                                            <p className="warning-message">O aluno selecionado não está mais ativo ou vinculado a este paciente. Caso seja alterado, não será possível selecioná-lo novamente.</p>
                                                        )
                                                    }
                                                </>

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
                            {userLevel != '2' && (
                                <div className="div-flex input-data">
                                    <>
                                        <label>Data de criação*</label>
                                        <DatePicker
                                            format="dd/MM/yyyy"
                                            placeholder="dd/mm/aaaa"
                                            value={new Date(dadosAtualizados.dataCriacao)}
                                            onChange={(e) =>
                                                setDadosAtualizados({ ...dadosAtualizados, dataCriacao: e })
                                            }
                                        />
                                    </>
                                </div>
                            )}
                            <div className="flex-informacoes-relatorio">
                                {userLevel === '2' ? (
                                    <>
                                        <label htmlFor="conteudoRelatorio">Conteúdo</label>
                                        <h3 className="conteudo-wrap">{dadosAtualizados.conteudo.split('\n').map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}</h3>
                                        <div className="files-added">
                                            {dadosAtualizados.prontuario.map((arquivo, index) => (
                                                <div key={index} onClick={() => handleDownloadFile(index)}>
                                                    <p>{arquivo.nome ? arquivo.nome : arquivo.name}</p>
                                                    <img src={Download}
                                                        alt="Remove"
                                                        className="trash-icon"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="div-flex">
                                            <label htmlFor="conteudoRelatorio">Conteúdo*</label>
                                            <textarea
                                                name="conteudoRelatorio"
                                                value={dadosAtualizados.conteudo}
                                                onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, conteudo: e.target.value })}
                                            />
                                        </div>
                                        <div className="div-flex">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                multiple
                                                style={{ display: 'none' }}
                                                id="fileUploadProntuario"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="fileUploadProntuario" className="clip-icon-label">
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
                                    </>
                                )}
                            </div>
                            {userLevel != '3' && (
                                <>
                                    <h2 htmlFor="conteudoRelatorio">Assinatura</h2>
                                    <div className="input-file-relatorio">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            style={{ display: 'none' }}
                                            id="fileUploadAssinatura"
                                            onChange={handleFileChangeAssinatura}
                                        />
                                        <label htmlFor="fileUploadAssinatura" className="">
                                            Anexar arquivo <img src={ClipIcon} alt="Attach" className="" />
                                        </label>
                                    </div>
                                    <div className="files-added" style={{ marginBottom: '40px' }}>
                                        {dadosAtualizados.assinatura.map((arquivo, index) => (
                                            <div key={index}>
                                                <p>{arquivo.nome ? arquivo.nome : arquivo.name}</p>
                                                <img src={TrashIcon}
                                                    alt="Remove"
                                                    className="trash-icon"
                                                    onClick={() => handleRemoveFileAssinatura(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div className="buttons-form buttons-form-aluno">
                                <button className="button-voltar" id="voltar" onClick={handleEditarClose} >Cancelar</button>
                                <button className="button-cadastrar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }
            {
                isEditarConfirmar && (
                    <div className="modal-confirmar">
                        <div className="modal-content-confirmar modal-content-confirmar-relatorio">
                            <h2>Confirmar Edição de Relatório</h2>
                            <hr />
                            <div className="dados-inseridos">
                                <div className="coluna1">
                                    <div className="nome">
                                        <p>Paciente</p>
                                        <h1>
                                            {pacientesNome.pacientes.find(paciente => paciente._id === dadosAtualizados.pacienteId)?.nome || dadosAtualizados.nomePaciente|| "Nome não encontrado"}
                                        </h1>
                                    </div>
                                    {userLevel != '3' &&
                                        <div className="nome">
                                            <p>Encaminhador</p>
                                            <h1>
                                                {
                                                alunosNome.alunos.find(aluno => aluno._id === dadosAtualizados.alunoId)?.nome
                                                || dadosAtualizados.nome_funcionario ? dadosAtualizados.nome_funcionario
                                                : dadosAtualizados.nomeAluno
                                            }
                                            </h1>
                                        </div>
                                    }
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
                                        {dadosAtualizados.prontuario[0] ? dadosAtualizados.prontuario.map((arquivo, index) => (
                                            <h1 key={index}> {arquivo.nome ? arquivo.nome : arquivo.name}</h1>
                                        )) : <h1>Não foram anexados arquivos</h1>}
                                    </div>
                                    {userLevel != '3' && (
                                        <div className="email">
                                            <p>Assinatura</p>
                                            {dadosAtualizados.assinatura[0] ? dadosAtualizados.assinatura.map((arquivo, index) => (
                                                <h1 key={index}> {arquivo.nome ? arquivo.nome : arquivo.name}</h1>
                                            )) : <h1>Não foram anexados arquivos</h1>}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="buttons-confirmar buttons-confirmar-relatorio">
                                <button className="button-voltar-confirmar" id="voltar" disabled={isSending} onClick={handleVoltarConfirmar} >
                                    Voltar
                                </button>
                                <button type="submit" className="button-confirmar" id="cadastrar" disabled={isSending} onClick={handleSucessoConfirmar}>
                                    {isSending ? 'Enviando alterações...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                SucessoEditar && (
                    <div className="modal-sucesso">
                        <div className="modal-sucesso-content">
                            <h1>Sucesso!</h1>
                            <h2>Relatório editado com sucesso.</h2>
                            <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
                        </div>
                    </div>
                )
            }
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