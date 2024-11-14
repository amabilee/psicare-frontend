import React,{useState} from "react";
import { api } from "../../services/server";
import "./style.css"

export default function ExcluirRelatorio({handleExcluirClose, dadosRelatorio, atualizarTableExcluir}){
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);
    

    const handleConfirmarOpen = async () => {
        try {
            const token = localStorage.getItem("user_token");
            
            const mudarEstado = {
                ...dadosRelatorio,
                ativoRelatorio: false
            };

            console.log(mudarEstado)
    
            const deleteIds = async (id) => {
                console.log(`Tentando excluir ID: ${id}`);
                const response = await api.patch(`/relatorio/${id}`, mudarEstado, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
                console.log("Resposta do servidor:", response.data);
            };
    
            if (Array.isArray(dadosRelatorio._ids) && dadosRelatorio._ids.length > 0) {
                for (const id of dadosRelatorio._ids) { 
                    await deleteIds(id);
                }
            } else if (dadosRelatorio._id) {
                await deleteIds(dadosRelatorio._id);
            } else {
                console.error("Nenhum ID disponível para exclusão.");
            }
    
            atualizarTableExcluir();
            setIsConfirmarExcluir(true);
        } catch (e) {
            console.error("Erro ao deletar:", e);
        }
    };
     

    return(
        <>
            <div className="modal-confirmar">
                <div className="modal-confirmar-content">
                    <h1>Confirmação</h1>
                    <h2>Deseja realmente excluir o(s) relatórios(es) selecionado(s)?</h2>
                    <div className="div-button-excluir">
                        <button className="button-cancelar" id="cancelar" onClick={handleExcluirClose} >Cancelar</button>
                        <button className="button-excluir" id="excluir" onClick={handleConfirmarOpen} >Excluir</button>
                    </div>
                </div>
                {isConfirmarExluir && (
                    <div className="modal-excluir">
                        <div className="modal-excluir-content">
                            <h1>Excluído!</h1>
                            <h2>Relatório(s) excluido(s) com sucesso.</h2>
                            <button className="button-fechar" id="fechar" onClick={handleExcluirClose} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}