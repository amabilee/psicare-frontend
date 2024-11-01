import React from "react";
import voltar from "../../assets/voltar.svg";
import "./style.css";

export default function VisualizarRelatorio({ handleCloseVisualizar, dadosRelatorio }) {

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const getAge = dateString => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const teste = `Introdução\nMaria Silva iniciou a terapia cognitivo-comportamental em 01/05/2022, com queixa de ansiedade, sentimentos de desesperança, e dificuldade em lidar com situações estressantes no trabalho e na vida pessoal. Durante as primeiras sessões, a paciente relatou dificuldade em controlar os pensamentos negativos, especialmente em relação a sua capacidade de enfrentar desafios.\nHistória clínica\nA paciente já havia tentado tratar sua ansiedade com outros profissionais de saúde mental, mas nunca havia experimentado a terapia cognitivo-comportamental. Ela relatou um histórico de eventos estressantes em sua vida, incluindo um relacionamento abusivo no passado e dificuldades financeiras recentes. Além disso, a paciente informou que possui familiares com histórico de transtornos de ansiedade.\nTratamento\nO tratamento consistiu em sessões semanais de 1 hora, nas quais foram utilizadas técnicas de terapia cognitivo-comportamental para ajudar a paciente a identificar e questionar seus pensamentos negativos. A paciente também recebeu orientações sobre técnicas de relaxamento e habilidades de resolução de problemas para lidar com situações estressantes.\nResultados\nAo longo das sessões, a paciente relatou uma melhora significativa em sua ansiedade e uma maior capacidade de lidar com situações estressantes. Ela também relatou uma melhora na autoestima e na capacidade de se afirmar em situações difíceis no trabalho. Na última sessão, a paciente demonstrou satisfação com os resultados obtidos e relatou sentir-se mais confiante em relação ao futuro.\nConclusão\nA terapia cognitivo-comportamental se mostrou eficaz no tratamento da ansiedade e sintomas relacionados em Maria Silva. A paciente demonstrou uma melhora significativa em seus sintomas, que pode ser atribuída às técnicas e habilidades ensinadas ao longo das sessões. A paciente também mostrou-se satisfeita com o tratamento e com a sua capacidade de lidar com situações estressantes de maneira mais saudável e assertiva.`;

    const formatarTexto = (texto) => {
        return texto.split('\n').map((linha, index) => (
            <React.Fragment key={index}>
                {linha}
                <br />
            </React.Fragment>
        ));
    };


    return (
        <div className="visualizar">
            <div className="body-visualizar">
                <div className="header-visualizar">
                    <div className="header-visualizar-info">
                        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={handleCloseVisualizar} />
                        <h1 onClick={handleCloseVisualizar}>Informações sobre relatório</h1>
                    </div>
                    <hr />
                    <div className="visualizar-info visualizar-info-relatorio">
                        <h2>Paciente</h2>
                        <div className="coluna1">
                            <div className="nome">
                                <p>Nome Completo</p>
                                <h1>{dadosRelatorio.nomePaciente}</h1>
                            </div>
                            <div className="data-nascimento">
                                <p>Data Nascimento</p>
                                <h1>{formatarData(dadosRelatorio.dataNascimentoPaciente)}</h1>
                            </div>
                            <div className="sexo">
                                <p>Idade</p>
                                <h1>{getAge(dadosRelatorio.dataNascimentoPaciente)}</h1>
                            </div>
                        </div>
                        <div className="coluna2">
                            <div className="data-nascimento">
                                <p>Início do Tratamento</p>
                                <h1>{formatarData(dadosRelatorio.dataInicioTratamento)}</h1>
                            </div>
                            <div className="data-nascimento">
                                <p>Término do Tratamento</p>
                                <h1>{formatarData(dadosRelatorio.dataTerminoTratamento)}</h1>
                            </div>
                            <div className="estadoCivil">
                                <p>Tipo de tratamento</p>
                                <h1>{dadosRelatorio.tipoTratamento}</h1>
                            </div>
                        </div>
                        <div className="coluna3">
                            <div className="religiao">
                                <p>Nome encaminhador</p>
                                <h1>{dadosRelatorio.alunoUnieva ? dadosRelatorio.nomeAluno : dadosRelatorio.nome_funcionario}</h1>
                            </div>
                            <div className="status-encaminhador">
                                <p>Status do encaminhador</p>
                                <h1>{dadosRelatorio.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosRelatorio.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : ""}</h1>
                            </div>
                        </div>
                        <div className="coluna4">
                            <div className="data-nascimento">
                                <h2>Aprofundamento da Consulta</h2>
                                <p>Data de criação do relatório</p>
                                <h1>{formatarData(dadosRelatorio.dataCriacao)}</h1>
                            </div>
                            <div className="data-nascimento">
                                <p>Ultima atualização</p>
                                <h1>{formatarData(dadosRelatorio.ultimaAtualizacao)}</h1>
                            </div>
                            <div className="data-nascimento">
                                <h2>Arquivos Submetidos</h2>
                                <p>Data de criação do relatório</p>
                                <h1>{formatarData(dadosRelatorio.dataCriacao)}</h1>
                            </div>
                            <div className="data-nascimento">
                                <h2>Assinatura do Professor</h2>
                                <p>Data de criação do relatório</p>
                                <h1>{formatarData(dadosRelatorio.dataCriacao)}</h1>
                            </div>
                        </div>
                        <h2>Conteúdo</h2>
                        <div className="coluna5">
                            <div>
                                <h1>{formatarTexto(teste)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}