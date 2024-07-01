import React,{useState} from "react";
import { api } from "../../services/server";
import "./style.css"

export default function ExcluirSecretario({handleExcluirClose, dadosSecretario, atualizarTableExcluir}){
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);
    

    const handleConfirmarOpen = async() => {
        try {
            if (Array.isArray(dadosSecretario._ids) && dadosSecretario._ids.length > 0){ //verifica se tem mais de um id para deletar
                const data = dadosSecretario._ids ? { ids: dadosSecretario._ids} : {ids: [dadosSecretario._id]}; //se dadosSecretarios não for nulo retorna uma array de IDs, caso for nulo retorna uma array com único ID
                const response = await api.delete(`/secretario`, {data});
                console.log(response)
            } else {
                await api.delete(`/secretario/${dadosSecretario._id}`);//função para deletar somente um id de secretario
            }
            atualizarTableExcluir();
            setIsConfirmarExcluir(true);
        } catch (e) {
            console.log("deu erro ao deletar: ", e)
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