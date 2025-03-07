import TableAlunoPaciente from "../table/alunoPacientes";
import voltar from "../../assets/voltar.svg";
import "./style.css";


export default function VisualizarAluno({handleCloseVisualizar, dadosAluno}){
    const pacienteAlunos = dadosAluno._id;
    
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
                        <h1 onClick={handleCloseVisualizar}>Informações sobre aluno</h1>
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
                            <h1>{dadosAluno.periodo.includes("°") || dadosAluno.periodo.includes("º") ? dadosAluno.periodo : `${dadosAluno.periodo}°`}</h1>
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
                            <h1>{formatarCPF(dadosAluno.cpf)}</h1>
                        </div>
                        <div className="professorNome">
                            <p>Professor</p>
                            <h1>{dadosAluno.nomeProfessor}</h1>
                        </div>
                    </div>   
                </div>     
                <TableAlunoPaciente pacienteAlunos={pacienteAlunos}/>
            </div>
        </div>
    )
}