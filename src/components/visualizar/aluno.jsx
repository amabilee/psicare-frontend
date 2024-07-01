import React from "react";
import "./style.css";


export default function VisualizarAluno({handleCloseVisualizar, dadosAluno}){

    return(
        <div className="visualizar">
            <div className="body-visualizar">
                <div className="header-visualizar">
                    <div className="header-visualizar-info">
                        <h1>Informações sobre aluno</h1>
                        <div className="voltar">
                            <button className="button-voltar" onClick={handleCloseVisualizar} >Voltar</button>
                        </div>
                    </div>
                    <hr />     
                </div>
                <div className="visualizar-info">
                    <div className="coluna1">
                        <div className="nome">
                            <p>Nome</p>
                            <h1>{dadosAluno.nome}</h1>
                        </div>
                        <div className="matricula">
                            <p>Matrícula</p>
                            <h1>{dadosAluno.matricula}</h1>
                        </div>
                        <div className="periodo">
                            <p>Periodo</p>
                            <h1>{dadosAluno.periodo}</h1>
                        </div>
                    </div>
                    <div className="coluna2">
                        <div className="email">
                            <p>Email</p>
                            <h1>{dadosAluno.email}</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>{dadosAluno.telefone}</h1>
                        </div>
                    </div>  
                    <div className="coluna3">
                        <div className="cpf-aluno">
                            <p>CPF</p>
                            <h1>{dadosAluno.cpf}</h1>
                        </div>
                        <div className="professorNome">
                            <p>Professor</p>
                            <h1>{dadosAluno.professorNome}</h1>
                        </div>
                    </div>   
                </div>     
                
            </div>
            
        </div>
    )
}