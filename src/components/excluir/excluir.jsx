import React,{useState} from "react";
import "./style.css"

export default function Excluir({handleExcluirClose}){
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);

    const handleConfirmarOpen = () => {
        setIsConfirmarExcluir(true);
    }

    return(
        <>
            <div className="modal-confirmar">
                <div className="modal-confirmar-content">
                    <h1>Confirmação</h1>
                    <h2>Deseja realmente excluir o(s) registro(s) selecionado(s)?</h2>
                    <div className="button-excluir">
                        <button id="cancelar" onClick={handleExcluirClose} >Cancelar</button>
                        <button id="excluir" onClick={handleConfirmarOpen} >Excluir</button>
                    </div>
                </div>
                {isConfirmarExluir && (
                    <div className="modal-excluir">
                        <div className="modal-excluir-content">
                            <h1>Excluído!</h1>
                            <h2>Cadastro excluido com sucesso.</h2>
                            <button id="fechar" onClick={handleExcluirClose} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}