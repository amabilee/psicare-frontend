import React from "react";
import "./style.css"

export default function Editar({handleEditarClose}){
    return(
        <>
            <div className="modal-editar" >
                <div className="modal-content-editar">
                    <h2>Editar Cadastro</h2>
                    <hr /> 
                    <form>
                        <label htmlFor="Nome">Nome Completo*</label>
                        <input type="text" placeholder="Guilherme Poloniato Salomão" />
                        <div className="flex-input">
                            <div className="div-CPF">
                                <label htmlFor="CPF">CPF*</label>
                                <input type="number" className="CPF" id="CPF" placeholder="00000000000" />
                            </div>
                            <div className="div-telefone">
                                <label htmlFor="Telefone">Telefone*</label>
                                <input type="tel" className="telefone" id="telefone" placeholder="(99)9 9999-9999" />
                            </div>
                        </div>                   
                        <label htmlFor="Email">Email*</label>
                        <input type="email" name="email" id="email" placeholder="Gui@gmail.com" />
                        <label htmlFor="turno">Turno*</label>
                        <select className="turno" id="turno">
                            <option value="#"></option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                            <option value="noturno">Noturno</option>
                        </select>
                        <div className="buttons-form">
                            <button className="button-voltar" id="voltar" onClick={handleEditarClose} >Cancelar</button>
                            <button type="submit" className="button-cadastrar" id="cadastrar">Confirmar</button>  
                        </div>  
                    </form>
                </div>
            </div> 
        </>
    )
}