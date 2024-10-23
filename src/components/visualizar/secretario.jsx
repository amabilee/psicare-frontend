import React from "react";
import voltar from "../../assets/voltar.svg";
import "./style.css";


export default function VisualizarSecretario({handleCloseVisualizar, dadosSecretario}){

    const formatarCPF = (cpf) => {
        if (cpf.length === 11) {
    
          return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
        }
        return cpf;
      };

    return(
        <div className="visualizar">
            <div className="body-visualizar">
                <div className="header-visualizar">
                    <div className="header-visualizar-info">
                        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={handleCloseVisualizar} />
                        <h1 onClick={handleCloseVisualizar}>Informações sobre secretário</h1>
                    </div>
                    <hr />     
                </div>
                
                <div className="visualizar-info">
                    <div className="coluna1">
                        <div className="nome">
                            <p>Nome</p>
                            <h1>{dadosSecretario.nome}</h1>
                        </div>
                    </div>
                    <div className="coluna2">
                        <div className="email">
                            <p>Email</p>
                            <h1>{dadosSecretario.email}</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>{dadosSecretario.telefone}</h1>
                        </div>
                    </div>  
                    <div className="coluna3">
                        <div>
                            <p>Turno</p>
                            <h1 
                                style={{textTransform: "capitalize"}}
                            >
                            {dadosSecretario.turno}
                            </h1>
                        </div>
                        <div className="cpf">
                            <p>CPF</p>
                            <h1>{formatarCPF(dadosSecretario.cpf)}</h1>
                        </div>
                    </div>   
                </div>     
                
            </div>
            
        </div>
    )
}