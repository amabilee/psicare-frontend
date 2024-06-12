import React,{useState, useEffect} from "react";
import { api } from "../../services/server";
import "./style.css"

export default function Excluir({handleExcluirClose, dadosSecretario}){
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);
    

    const handleConfirmarOpen = async() => {
        // console.log(dadosSecretarioDeletar);
        try{
            var excluirDados = await api.delete(`/secretario/${dadosSecretario._id}`)
            console.log(excluirDados.data)

            setIsConfirmarExcluir(true);

        } catch (e) {
            console.log("erro excluir", e)
        }

        
    }

    return(
        <>
            <div className="modal-confirmar">
                <div className="modal-confirmar-content">
                    <h1>Confirmação</h1>
                    <h2>Deseja realmente excluir o(s) registro(s) selecionado(s)?</h2>
                    <div className="div-button-excluir">
                        <button className="button-cancelar" id="cancelar" onClick={handleExcluirClose} >Cancelar</button>
                        <button className="button-excluir" id="excluir" onClick={handleConfirmarOpen} >Excluir</button>
                    </div>
                </div>
                {isConfirmarExluir && (
                    <div className="modal-excluir">
                        <div className="modal-excluir-content">
                            <h1>Excluído!</h1>
                            <h2>Cadastro excluido com sucesso.</h2>
                            <button className="button-fechar" id="fechar" onClick={handleExcluirClose} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}