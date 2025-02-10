import React, { useState } from "react";
import { api } from "../../services/server";
import "./style.css"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ExcluirAluno({ handleExcluirClose, dadosAluno, atualizarTableExcluir }) {
    const [isConfirmarExluir, setIsConfirmarExcluir] = useState(false);

    const [message, setMessage] = useState("");
    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    }, []);
    const { vertical, horizontal, open } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleConfirmarOpen = async () => {
        try {
            const token = localStorage.getItem("user_token")

            const deleteIds = async (id) => {
                await api.delete(`/aluno/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
            }

            if (Array.isArray(dadosAluno._ids) && dadosAluno._ids.length > 0) {
                for (const id of dadosAluno._ids) {
                    await deleteIds(id);
                }
            } else {
                await deleteIds(dadosAluno._id)
            }

            atualizarTableExcluir();
            setIsConfirmarExcluir(true);
        } catch (e) {
            setState({ ...state, open: true });
            setMessage("Ocorreu um erro ao excluir");
        }
    }

    return (
        <>
            <div className="modal-confirmar">
                <div className="modal-confirmar-content">
                    <h1>Confirmação</h1>
                    <h2>Deseja realmente excluir o(s) aluno(s) selecionado(s)?</h2>
                    <div className="div-button-excluir">
                        <button className="button-cancelar" id="cancelar" onClick={handleExcluirClose} >Cancelar</button>
                        <button className="button-excluir" id="excluir" onClick={handleConfirmarOpen} >Excluir</button>
                    </div>
                </div>
                {isConfirmarExluir && (
                    <div className="modal-excluir">
                        <div className="modal-excluir-content">
                            <h1>Excluído!</h1>
                            <h2>Aluno(s) excluido(s) com sucesso.</h2>
                            <button className="button-fechar" id="fechar" onClick={handleExcluirClose} >Fechar</button>
                        </div>
                    </div>
                )}
            </div>
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity="error" onClose={handleClose} action="">
                    {typeof message === 'string' ? message : ''}
                </Alert>

            </Snackbar>
        </>
    )
}