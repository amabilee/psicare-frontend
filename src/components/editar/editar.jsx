import React, {useState} from "react";
import {IMaskInput} from "react-imask";
import "./style.css";

export default function Editar({handleEditarClose, dadosSecretario}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosSecretario);

    const handleEditarConfirmar = () => {
      console.log(dadosAtualizados)
        setIsEditarConfirmar(true);
        setEditar(false);
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = () => {
      setSucessoEditar(true);
    }
    
  return (
    <>
    {Editar && (
      <div className="modal-editar">
        <div className="modal-content-editar">
          <h2>Editar Cadastro</h2>
          <hr />
          <form>
            <label htmlFor="Nome">Nome Completo*</label>
            <input type="text" value={dadosAtualizados.nome} onChange={(e) => setDadosAtualizados({...dadosAtualizados, nome:e.target.value})}/>
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
            <select className="turno" id="turno" value={dadosAtualizados.turno} onChange={(e) => setDadosAtualizados({...dadosAtualizados, turno:e.target.value})}>
              <option value="#"></option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
            </select>
            <div className="buttons-form">
              <button className="button-cancelar" id="voltar" onClick={handleEditarClose}>
                Cancelar
              </button>
              <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleEditarConfirmar}>
                Confirmar
              </button>
            </div>
          </form>
        </div>  
      </div>
    )}
      {isEditarConfirmar && (
        <div className="modal-confirmar">
            <div className="modal-content-confirmar">
                <h2>Cadastro de Secretário</h2>
                <hr />
                <h3>Confirme os dados inseridos</h3>
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
