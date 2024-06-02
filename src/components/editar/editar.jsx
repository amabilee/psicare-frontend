import React from "react";
import "./style.css"

export default function Editar({handleEditarClose}){
    return(
        <>
            <div className="modal" >
                <div className="modal-content">
                    <h2>Editar Cadastro</h2>
                    <hr /> 
                    <form>
                        <label htmlFor="Nome">Nome Completo*</label>
                        <input type="text" placeholder="Guilherme Poloniato Salomão" />
                        <div className="flex-input">
                            <div className="CPF">
                                <label htmlFor="CPF">CPF*</label>
                                <input type="number" name="CPF" id="CPF" placeholder="00000000000" />
                            </div>
                            <div className="telefone">
                                <label htmlFor="Telefone">Telefone*</label>
                                <input type="tel" name="telefone" id="telefone" placeholder="(99)9 9999-9999" />
                            </div>
                        </div>                   
                        <label htmlFor="Email">Email*</label>
                        <input type="email" name="email" id="email" placeholder="Gui@gmail.com" />
                        <label htmlFor="turno">Turno*</label>
                        <select name="turno" id="turno">
                            <option value="#"></option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                            <option value="noturno">Noturno</option>
                        </select>
                        <div className="buttons-form">
                            <button id="voltar"onClick={handleEditarClose} >Cancelar</button>
                            <button type="submit" id="cadastrar">Cadastrar</button>  
                        </div>
                    </form>
                    {/* {isSucessModalOpen && (
                        <div className="modal-sucesso">
                            <div className="modal-sucesso-content">
                                <h1>Sucesso!</h1>
                                <h2>Cadastro realizado com sucesso.</h2>
                                <button id="fechar">Fechar</button>
                            </div>
                        </div>
                    )} */}
                </div>
            </div> 
        </>
    )
}