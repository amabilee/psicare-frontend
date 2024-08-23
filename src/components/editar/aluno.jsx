import React, {useState, useEffect} from "react";
import { api } from "../../services/server";
import {IMaskInput} from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator'; 
import "./style.css";

export default function EditarAluno({handleEditarClose, dadosAluno, renderDadosAluno}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState({});
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosAluno);
    const [professoresNome, setProfessoresNome] = useState({professores: []});
    const [state, setState] = React.useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

  

  const handleClose = () => {
      setState({ ...state, open: false });
  };

  console.log(dadosAluno)

  useEffect(() => {
    buscarProfessores();
  }, []);

    const handleEditarConfirmar = (newState) => () => {
      console.log(dadosAtualizados)
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
      const token = localStorage.getItem("user_token")
      try {
        const enviardadosAtualizados = await api.patch(`/aluno/${dadosAtualizados._id}`, dadosAtualizados, {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });
        console.log(enviardadosAtualizados.data)

        setSucessoEditar(true);
        renderDadosAluno(dadosAtualizados);
      } catch (e){
        console.log("Erro ao atualizar dados:", e)
      }
    };

    const buscarProfessores = async() => {
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
          console.log("Erro ao buscar professores: ", e)
      }
  }

  return (
    <>
    {Editar && (
      <div className="modal-editar">
        <div className="modal-content-editar modal-content-editar-aluno">
          <h2>Editar Aluno</h2>
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
            
            <label htmlFor="professorResponsavel">Professor*</label>
            <select className="professorNome" id="professorNome" value={dadosAtualizados.nomeProfessor} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, nomeProfessor:e.target.value})} required>
                <option value="0" disabled>Selecione uma opção</option>
                {professoresNome.professores.map(professor => (
                  <option key={professor._id}>
                      {professor.nome}
                  </option>
              ))}
            </select>

            <div className="flex-input">
                <div className="div-matricula">
                    <label htmlFor="matricula">Matrícula*</label>
                    <input type="text" className="matricula" id="matricula" value={dadosAtualizados.matricula} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, matricula:e.target.value})} />
                </div>
                <div className="div-periodo">
                    <label htmlFor="periodo">Período*</label>
                    <select className="periodo" id="periodo" value={dadosAtualizados.periodo} onChange={(e) =>  setDadosAtualizados({...dadosAtualizados, periodo:e.target.value})} required>
                        <option value="#" disabled>Selecione uma opção</option>
                        <option value="1°">1°</option>
                        <option value="2°">2°</option>
                        <option value="3°">3°</option>
                        <option value="4°">4°</option>
                        <option value="5°">5°</option>
                        <option value="6°">6°</option>
                        <option value="7°">7°</option>
                        <option value="8°">8°</option>
                        <option value="9°">9°</option>
                        <option value="10°">10°</option>
                    </select>
                </div>
            </div>

            <div className="buttons-form buttons-form-aluno">
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
                          <h1>{dadosAtualizados.cpf}</h1>
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
                          <h1>{dadosAtualizados.periodo}</h1>
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
              <h2>Cadastro atualizado com sucesso.</h2>
              <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
          </div>
        </div>
      )}
    </>
    
  );
}
