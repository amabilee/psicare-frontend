import React,{useState} from "react";
import { api } from "../../services/server";
import "./style.css"

export default function ExcluirProfessor({handleExcluirClose, dadosProfessor, atualizarTableExcluir}){
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);
    

    const handleConfirmarOpen = async() => {
        try {
            const token = localStorage.getItem("user_token")
            console.log(token)

            const deleteIds = async(id) => {
                await api.delete(`/professor/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                        }
                });//função para deletar somente um id de secretario
            }

            if (Array.isArray(dadosProfessor._ids) && dadosProfessor._ids.length > 0){ //verifica se tem mais de um id para deletar
                // of é usado para iterar sobre os valores de arrays e strings
                for (const id of dadosProfessor._ids){ //função para iterar sobre cada array de dadosProfessor._ids, onde para cada ID irá chamar a função de excluir aluno
                    await deleteIds(id);
                }
            } else {
                await deleteIds(dadosProfessor._id)
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
                    <h2>Deseja realmente excluir o(s) professor(es) selecionado(s)?</h2>
                    <div className="div-button-excluir">
                        <button className="button-cancelar" id="cancelar" onClick={handleExcluirClose} >Cancelar</button>
                        <button className="button-excluir" id="excluir" onClick={handleConfirmarOpen} >Excluir</button>
                    </div>
                </div>
                {isConfirmarExluir && (
                    <div className="modal-excluir">
                        <div className="modal-excluir-content">
                            <h1>Excluído!</h1>
                            <h2>Professor(es) excluido(s) com sucesso.</h2>
                            <button className="button-fechar" id="fechar" onClick={handleExcluirClose} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}