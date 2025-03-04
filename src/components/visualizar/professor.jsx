import voltar from "../../assets/voltar.svg";
import TableProfAluno from "../table/profAlunos";
import "./style.css";

export default function VisualizarProfessor({handleCloseVisualizar, dadosProfessor}){   
    const alunosProfessor = dadosProfessor._id;

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
                        <h1 onClick={handleCloseVisualizar}>Informações sobre professor</h1>
                    </div>
                    <hr />     
                </div>
                <div className="visualizar-info">
                    <div className="coluna1">
                        <div className="nome">
                            <p>Nome</p>
                            <h1>{dadosProfessor.nome}</h1>
                        </div>
                    </div>
                    <div className="coluna2">
                        <div className="email">
                            <p>Email</p>
                            <h1>{dadosProfessor.email}</h1>
                        </div>
                        <div className="telefone">
                            <p>Telefone</p>
                            <h1>{dadosProfessor.telefone}</h1>
                        </div>
                    </div>  
                    <div className="coluna3">
                        <div className="disciplina">
                            <p>Disciplina</p>
                            <h1>{dadosProfessor.disciplina}</h1>
                        </div>
                        <div className="cpf">
                            <p>CPF</p>
                            <h1>{formatarCPF(dadosProfessor.cpf)}</h1>
                        </div>
                    </div>   
                </div>     
            </div>
            <TableProfAluno alunosProfessor={alunosProfessor}/>
        </div>
    )
}