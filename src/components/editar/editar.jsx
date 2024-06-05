import React, {useState} from "react";
import "./style.css";

export default function Editar({ handleEditarClose}) {
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [SucessoEditar, setSucessoEditar] = useState(false);

    const handleEditarConfirmar = () => {
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
            <input type="text" placeholder="Guilherme Poloniato Salomão" />
            <div className="flex-input">
              <div className="div-CPF">
                <label htmlFor="CPF">CPF*</label>
                <input
                  type="number"
                  className="CPF"
                  id="CPF"
                  placeholder="00000000000"
                />
              </div>
              <div className="div-telefone">
                <label htmlFor="Telefone">Telefone*</label>
                <input
                  type="tel"
                  className="telefone"
                  id="telefone"
                  placeholder="(99)9 9999-9999"
                />
              </div>
            </div>
            <label htmlFor="Email">Email*</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Gui@gmail.com"
            />
            <label htmlFor="turno">Turno*</label>
            <select className="turno" id="turno">
              <option value="#"></option>
              <option value="matutino">Matutino</option>
              <option value="vespertino">Vespertino</option>
              <option value="noturno">Noturno</option>
            </select>
            <div className="buttons-form">
              <button
                className="button-cancelar"
                id="voltar"
                onClick={handleEditarClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button-confirmar"
                id="cadastrar"
                onClick={handleEditarConfirmar}
              >
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
                        <h1>Guilherme Poloniato Salomão</h1>
                    </div>
                    <div className="flex-row1">
                        <div className="CPF">
                            <p>CPF</p>
                            <h1>000000000-00</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>(62)9 9999-9999</h1>
                        </div>
                    </div>
                    <div className="email">
                        <p>E-mail</p>
                        <h1>Gui@gmail.com</h1>
                    </div>
                    <div className="turno">
                        <p>turno</p>
                        <h1>Matutino</h1>
                    </div>   
                </div> 
                <div className="buttons-confirmar">
                  <button
                    className="button-voltar-confirmar"
                    id="voltar"
                    onClick={handleVoltarConfirmar}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="button-confirmar"
                    id="cadastrar"
                    onClick={handleSucessoConfirmar}
                  >
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
