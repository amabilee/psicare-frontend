import React, {useState} from "react";
import Editar from "../editar/editar";
import "./style.css";


export default function VisualizarSecretario({handleCloseVisualizar}){
    const [isEditarOpen, setIsEditarOpen] = useState(false);

    const handleEditarClick = () => {
        setIsEditarOpen(true);
    }

    const handleEditarClose = () => {
        setIsEditarOpen(false);
    }

    return(
        <>
            <div className="body-visualizar">
                <div className="header-visualizar">
                    <div className="header-visualizar-info">
                        <p>Informações sobre secretário</p>
                        <button className="button-editar" onClick={handleEditarClick}>Editar</button>
                    </div>
                    <hr />
                </div>
                
                <div className="visualizar-info">
                    <div className="nome">
                        <p>Nome</p>
                        <h1>Guilherme Poloniato Salomão</h1>
                    </div>
                    <div className="flex-row1">
                        <div className="email">
                            <p>Email</p>
                            <h1>Gui@gmail.com</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>(62)9 9999-9999</h1>
                        </div>
                    </div>
                    <div className="flex-row2">
                        <div className="tuno">
                            <p>Turno</p>
                            <h1>Noturno</h1>
                        </div>
                        <div className="CPF">
                            <p>CPF</p>
                            <h1>00000000000</h1>
                        </div>
                    </div>   
                </div>     
                <div className="voltar">
                    <button className="button-voltar" onClick={handleCloseVisualizar} >Voltar</button>
                </div>
                {isEditarOpen && <Editar handleEditarClose={handleEditarClose}/>}
            </div>
        </>
    )
}