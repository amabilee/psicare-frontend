import React, {useState} from "react";
import "./style.css"

export default function CadastrarSecretario({ handleCloseModal }){
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);

    const HandleFormSubmit = (event) => {
        event.preventDefault(); //previnir o comportamento padrão do formulário
        setIsSucessModalOpen(true);
    }

    return(
        <div className="modal" onClick={handleCloseModal} >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Cadastro de secretário</h2>
                <hr /> 
                <form>
                    <label htmlFor="Nome">Nome Completo*</label>
                    <input type="text" />
                    <div className="flex-input">
                        <div className="CPF">
                            <label htmlFor="CPF">CPF*</label>
                            <input type="number" name="numero" id="numero" />
                        </div>
                        <div className="telefone">
                            <label htmlFor="Telefone">Telefone*</label>
                            <input type="tel" name="telefone" id="telefone" />
                        </div>
                    </div>                   
                    <label htmlFor="Email">Email*</label>
                    <input type="email" name="email" id="email" />
                    <label htmlFor="turno">Turno*</label>
                    <select name="turno" id="turno">
                        <option value="#"></option>
                        <option value="matutino">Matutino</option>
                        <option value="vespertino">Vespertino</option>
                        <option value="noturno">Noturno</option>
                    </select>
                    <div className="buttons-form"  onClick={HandleFormSubmit}>
                        <button id="voltar" onClick={handleCloseModal} >Voltar</button>
                        <button type="submit" id="cadastrar">Cadastrar</button>  
                    </div>
                </form>
                {isSucessModalOpen && (
                    <div className="modal-sucesso">
                        <div className="modal-sucesso-content">
                            <h1>Sucesso!</h1>
                            <h2>Cadastro realizado com sucesso.</h2>
                            <button id="fechar" onClick={handleCloseModal} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>       
    )
}