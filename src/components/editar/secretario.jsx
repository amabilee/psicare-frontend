import React, { useState } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css";

import Select from 'react-select'

export default function EditarSecretario({ handleEditarClose, dadosSecretario, renderDadosSecretario }) {
  const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
  const [Editar, setEditar] = useState(true);
  const [SucessoEditar, setSucessoEditar] = useState(false);
  const [message, setMessage] = useState("");
  const [dadosAtualizados, setDadosAtualizados] = useState(dadosSecretario);
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleEditarConfirmar = (newState) => () => {
    if (dadosAtualizados.nome.length <= 6) {
      setState({ ...newState, open: true });
      setMessage("Insira o nome completo.");
      return;
    } else if (!cpf.isValid(dadosAtualizados.cpf)) {
      setState({ ...newState, open: true });
      setMessage("Insira um cpf válido.");
      return;
    } else if (dadosAtualizados.telefone.length != 15) {
      setState({ ...newState, open: true });
      setMessage("Insira um telefone válido.");
      return;
    } else if (!validator.isEmail(dadosAtualizados.email)) {
      setState({ ...newState, open: true });
      setMessage("Insira um email válido.");
      return;
    } else if (dadosAtualizados.turno === "#") {
      setState({ ...newState, open: true });
      setMessage("Selecione um turno.");
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
      await api.patch(`/secretario/${dadosAtualizados._id}`, dadosAtualizados, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      setSucessoEditar(true);
      renderDadosSecretario(dadosAtualizados);
    } catch (e) {
      setState({ ...state, open: true });
      setMessage(e.response.data);
    }
  };

  const formatarCPF = (cpf) => {
    if (cpf.length === 11) {

      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    }
    return cpf;
  };

  const turnoOptions = [
    { value: "matutino", label: "Matutino" },
    { value: "vespertino", label: "Vespertino" },
    { value: "noturno", label: "Noturno" }
  ]

  return (
    <>
      {Editar && (
        <div className="modal-editar">
          <div className="modal-content-editar">
            <h2>Editar Secretário</h2>
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
              <label htmlFor="turno">Turno*</label>
              <Select
                className="tipo-select"
                options={turnoOptions}
                value={turnoOptions.find(option => option.value === dadosAtualizados.turno) || null}
                onChange={(selectedOption) => {
                  setDadosAtualizados({ ...dadosAtualizados, turno: selectedOption.value });
                }}
                placeholder="Selecione uma opção"
                menuPlacement="auto"
              />

              <p className="campo_obrigatorio">*Campo Obrigatório</p>
              <div className="buttons-form">
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
          <div className="modal-content-confirmar modal-content-confirmar-secretario">
            <h2>Confirmar Edição de Secretário</h2>
            <hr />
            <div className="dados-inseridos">
              <div className="coluna1">
                <div className="nome">
                  <p>Nome Completo</p>
                  <h1>{dadosAtualizados.nome}</h1>
                </div>
              </div>
              <div className="coluna2">
                <div className="CPF">
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
                  <p>E-mail</p>
                  <h1>{dadosAtualizados.email}</h1>
                </div>
              </div>
              <div className="coluna4">
                <div>
                  <p>Turno</p>
                  <h1>{dadosAtualizados.turno}</h1>
                </div>
              </div>
            </div>

            <div className="buttons-confirmar buttons-confirmar-secretario">
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
            <h2>Secretário atualizado com sucesso.</h2>
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
