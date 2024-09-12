import React, {useState} from "react";
import { api } from "../../services/server";
import {IMaskInput} from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css";

export default function EditarProfessor({handleEditarClose, dadosProfessor, renderDadosProfessor}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState({});
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosProfessor);
    const [state, setState] = React.useState({
      open: false,
      vertical: 'top',
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
      } else if (!cpf.isValid(dadosAtualizados.cpf)){
          setState({ ...newState, open: true }); 
          setMessage("Insira um cpf válido.");
      } else if (dadosAtualizados.telefone.length != 15){
          setState({ ...newState, open: true }); 
          setMessage("Insira um telefone válido.");
      } else if (!validator.isEmail(dadosAtualizados.email)){
          setState({ ...newState, open: true });
          setMessage("Insira um email válido.");
      } else if (dadosAtualizados.turno === "#") {
          setState({ ...newState, open: true });
          setMessage("Selecione um turno.");

      } else {
        setIsEditarConfirmar(true);
        setEditar(false);
      }
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = async() => {
      const token = localStorage.getItem("user_token")
      try {
          await api.patch(`/professor/${dadosAtualizados._id}`, dadosAtualizados, {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });

        setSucessoEditar(true);
        renderDadosProfessor(dadosAtualizados);
      } catch (e){
        console.log("Erro ao atualizar dados:", e)
      }
    };

  return (
    <>
    {Editar && (
      <div className="modal-editar">
        <div className="modal-content-editar">
          <h2>Editar Professor</h2>
          <hr />
          <div className="formulario">
            <label htmlFor="Nome">Nome Completo*</label>
            <input type="text" id="nome" value={dadosAtualizados.nome} onChange={(e) => setDadosAtualizados({...dadosAtualizados, nome:e.target.value})}/>
            <div className="flex-input">
              <div className="div-CPF">
                <label htmlFor="CPF">CPF*</label>
                <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosAtualizados.cpf} onChange={(e) => setDadosAtualizados({...dadosAtualizados, cpf:e.target.value})} />
              </div>
              <div className="div-telefone">
                <label htmlFor="Telefone">Telefone*</label>
                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosAtualizados.telefone} onChange={(e) => setDadosAtualizados({...dadosAtualizados, telefone:e.target.value})} />
              </div>
            </div>
            <label htmlFor="Email">Email*</label>
            <input type="email" name="email" id="email" value={dadosAtualizados.email} onChange={(e) => setDadosAtualizados({...dadosAtualizados, email:e.target.value})}/>
            <label htmlFor="disciplina">Disciplina*</label>
            <input type="text" className="disciplina" value={dadosAtualizados.disciplina} onChange={(e) => setDadosAtualizados({...dadosAtualizados, disciplina:e.target.value})}/>
            <p className="campo_obrigatorio">*Campo Obrigatório</p>
            <div className="buttons-form">
              <button className="button-cancelar" id="voltar" onClick={handleEditarClose}>
                Cancelar
              </button>
              <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>
                Confirmar
              </button>
              <Snackbar
                  ContentProps={{sx: {borderRadius: '8px'}}}
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  autoHideDuration={2000}
                  onClose={handleClose}
                  key={vertical + horizontal}
              >
                  <Alert variant="filled" severity="error" onClose={handleClose} action="">
                      {message}
                  </Alert>
              </Snackbar>
            </div>
          </div>
        </div>  
      </div>
    )}
      {isEditarConfirmar && (
        <div className="modal-confirmar">
            <div className="modal-content-confirmar modal-content-confirmar-professor">
                <h2>Confirmar Edição de Professor</h2>
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
                          <h1>{dadosAtualizados.cpf}</h1>
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
                    <div className="disciplina">
                      <p>Disciplina</p>
                      <h1>{dadosAtualizados.disciplina}</h1>
                    </div>  
                  </div>
                     
                </div> 
                <div className="buttons-confirmar buttons-confirmar-professor">
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
              <h2>Professor atualizado com sucesso.</h2>
              <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
          </div>
        </div>
      )}
    </>
    
  );
}
