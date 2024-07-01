import React, {useState} from "react";
import { api } from "../../services/server";
import {IMaskInput} from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css";

export default function EditarSecretario({handleEditarClose, dadosSecretario, renderDadosSecretario}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState({});
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosSecretario);
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
        console.log(dadosAtualizados);
      }
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = async() => {
      try {
        const enviardadosAtualizados = await api.patch(`/secretario/${dadosAtualizados._id}`, dadosAtualizados);
        console.log(enviardadosAtualizados.data)

        setSucessoEditar(true);
        renderDadosSecretario(dadosAtualizados);
      } catch (e){
        console.log("Erro ao atualizar dados:", e)
      }
    };

  return (
    <>
    {Editar && (
      <div className="modal-editar">
        <div className="modal-content-editar">
          <h2>Editar Secretário</h2>
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
            <label htmlFor="turno">Turno*</label>
            <select className="turno" id="turno" value={dadosAtualizados.turno} onChange={(e) => setDadosAtualizados({...dadosAtualizados, turno:e.target.value})} required>
              <option value="#" disabled>Selecione uma opção</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
            </select>
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
            <div className="modal-content-confirmar">
                <h2>Confirmar Edição de Secretário</h2>
                <hr />
                <div className="dados-inseridos">
                    <div className="nome">
                        <p>Nome Completo</p>
                        <h1>{dadosAtualizados.nome}</h1>
                    </div>
                    <div className="flex-row1">
                        <div className="CPF">
                            <p>CPF</p>
                            <h1>{dadosAtualizados.cpf}</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>{dadosAtualizados.telefone}</h1>
                        </div>
                    </div>
                    <div className="email">
                        <p>E-mail</p>
                        <h1>{dadosAtualizados.email}</h1>
                    </div>
                    <div className="turno">
                        <p>turno</p>
                        <h1>{dadosAtualizados.turno}</h1>
                    </div>   
                </div> 
                <div className="buttons-confirmar">
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
              <h2>Cadastro atualizado com sucesso.</h2>
              <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
          </div>
        </div>
      )}
    </>
    
  );
}
