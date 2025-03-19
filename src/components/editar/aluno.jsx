import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css";

import Select from 'react-select'

export default function EditarAluno({ handleEditarClose, dadosAluno, renderDadosAluno }) {
  const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
  const [Editar, setEditar] = useState(true);
  const [SucessoEditar, setSucessoEditar] = useState(false);
  const [message, setMessage] = useState("");
  const [dadosAtualizados, setDadosAtualizados] = useState(dadosAluno);
  const [professoresNome, setProfessoresNome] = useState({ professores: [] });
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    buscarProfessores();
  }, []);

  const handleEditarConfirmar = () => () => {
    if (dadosAtualizados.nome.length <= 6) {
      setState({ ...state, open: true });
      setMessage("Insira o nome completo.");
      return;
    } else if (!cpf.isValid(dadosAtualizados.cpf)) {
      setState({ ...state, open: true });
      setMessage("Insira um cpf válido.");
      return;
    } else if (dadosAtualizados.telefone.length != 15) {
      setState({ ...state, open: true });
      setMessage("Insira um telefone válido.");
      return;
    } else if (!validator.isEmail(dadosAtualizados.email)) {
      setState({ ...state, open: true });
      setMessage("Insira um email válido.");
      return;
    } else if (dadosAtualizados.turno === "#") {
      setState({ ...state, open: true });
      setMessage("Selecione um turno.");
      return;
    } else if (dadosAtualizados.professorId == "") {
      setState({ ...state, open: true });
      setMessage("Selecione um professor.");
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
    try {
      await api.patch(`/aluno/${dadosAtualizados._id}`, dadosAtualizados, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      setSucessoEditar(true);
      renderDadosAluno(dadosAtualizados);
    } catch (e) {
      setState({ ...state, open: true });
      setMessage(e.response.data);
    }
  };

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
      setState({ ...state, open: true });
      setMessage("Erro ao buscar professores");
    }
  }

  const formatarCPF = (cpf) => {
    if (cpf.length === 11) {

      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    }
    return cpf;
  };

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

  const professorOptions = [
    ...professoresNome.professores.map((professor) => ({
      value: professor._id,
      label: professor.nome,
    })),
    !professoresNome.professores.some((professor) => professor._id === dadosAtualizados.professorId) &&
      dadosAtualizados.professorId
      ? {
        value: dadosAtualizados.professorId,
        label: dadosAtualizados.nomeProfessor || "Professor desconhecido",
      }
      : null,
  ].filter(Boolean);


  return (
    <>
      {Editar && (
        <div className="modal-editar">
          <div className="modal-content-editar modal-content-editar-aluno">
            <h2>Editar Aluno</h2>
            <hr />
            <div className="formulario">
              <label htmlFor="Nome">Nome Completo*</label>
              <input type="text" id="nome" value={dadosAtualizados.nome} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, nome: e.target.value })} maxLength={100} />
              <div className="flex-input">
                <div className="div-CPF">
                  <label htmlFor="CPF">CPF*</label>
                  <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosAtualizados.cpf} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, cpf: e.target.value })} />
                </div>
                <div className="div-telefone">
                  <label htmlFor="Telefone">Telefone*</label>
                  <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosAtualizados.telefone} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, telefone: e.target.value })} />
                </div>
              </div>
              <label htmlFor="Email">Email*</label>
              <input type="email" name="email" id="email" value={dadosAtualizados.email} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, email: e.target.value })} maxLength={150} />

              <label htmlFor="professorResponsavel">Professor*</label>
              <Select
                className="paciente-select"
                options={professorOptions}
                value={professorOptions.find(option => option.value === dadosAtualizados.professorId) || null}
                onChange={(selectedOption) => {
                  setDadosAtualizados({
                    ...dadosAtualizados,
                    professorId: selectedOption.value,
                    nomeProfessor: selectedOption.label,
                  });
                }}
                placeholder="Selecione uma opção"
                menuPlacement="auto"
              />

              {!professoresNome.professores.some(professor => professor._id === dadosAtualizados.professorId) &&
                dadosAtualizados.professorId && (
                  <p className="warning-message">O professor selecionado não está mais ativo. Caso seja alterado, não será possível selecioná-lo novamente.</p>
                )
              }

              <div className="flex-input">
                <div className="div-matricula">
                  <label htmlFor="matricula">Matrícula*</label>
                  <input type="text" className="matricula" id="matricula" maxLength='7' value={dadosAtualizados.matricula} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, matricula: e.target.value.replace(/[^0-9]/g, "") })} />
                </div>
                <div className="div-periodo">
                  <label htmlFor="periodo">Período*</label>
                  <Select
                    className="tipo-select"
                    options={periodoOptions}
                    value={periodoOptions.find(option => option.value === dadosAtualizados.periodo) || null}
                    onChange={(selectedOption) => {
                      setDadosAtualizados({ ...dadosAtualizados, periodo: selectedOption.value });
                    }}
                    placeholder="Selecione uma opção"
                    menuPlacement="auto"
                  />
                </div>
              </div>
              <p className="campo_obrigatorio">*Campo Obrigatório</p>
              <div className="buttons-form buttons-form-aluno">
                <button className="button-cancelar" id="voltar" onClick={handleEditarClose}>
                  Cancelar
                </button>
                <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditarConfirmar && (
        <div className="modal-confirmar">
          <div className="modal-content-confirmar modal-content-confirmar-aluno">
            <h2>Confirmar Edição de Aluno</h2>
            <hr />
            <div className="dados-inseridos">
              <div className="coluna1">
                <div className="nome">
                  <p>Nome Completo</p>
                  <h1>{dadosAtualizados.nome}</h1>
                </div>
              </div>
              <div className="coluna2">
                <div className="cpf-aluno">
                  <p>CPF</p>
                  <h1>{formatarCPF(dadosAtualizados.cpf)}</h1>
                </div>
                <div className="telefone">
                  <p>Telefone</p>
                  <h1>{dadosAtualizados.telefone}</h1>
                </div>
              </div>
              <div className="coluna3">
                <div className="email">
                  <p>Email</p>
                  <h1>{dadosAtualizados.email}</h1>
                </div>

              </div>
              <div className="coluna4">
                <div className="professorNome">
                  <p>Professor</p>
                  <h1>{dadosAtualizados.nomeProfessor}</h1>
                </div>
              </div>
              <div className="coluna5">
                <div className="matricula">
                  <p>Matrícula</p>
                  <h1>{dadosAtualizados.matricula}</h1>
                </div>
                <div className="periodo">
                  <p>Periodo</p>
                  <h1>{dadosAtualizados.periodo}°</h1>
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
