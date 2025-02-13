import React from "react";
import voltar from "../../assets/voltar.svg";
import "./style.css";
import Download from "../../assets/download.svg"
import { api } from "../../services/server";

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

    const formatarTexto = (texto) => {
        return texto.split('\n').map((linha, index) => (
            <React.Fragment key={index}>
                {linha}
                <br />
            </React.Fragment>
        ));
    };

    const downloadFile = (arquivo) => {
        console.log(arquivo)
        // const relativePath = arquivo.target.alt;
        const fullURL = `${api.defaults.baseURL}${arquivo}`;
        window.open(fullURL, '_blank');
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
                                <div className="files-box">
                                    {dadosRelatorio.prontuario.map((arquivo, index) => (
                                        <div className="file-container" key={index} onClick={() => downloadFile(arquivo.id)}>
                                            <p style={{ cursor: 'pointer' }}>
                                                {arquivo.nome}
                                            </p>
                                            <button>
                                                <img src={Download} alt={arquivo.id} />
                                            </button>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div className="data-nascimento">
                                <h2>Assinatura do Professor</h2>
                                <div className="files-box">
                                    {dadosRelatorio.assinatura.map((arquivo, index) => (
                                        <div className="file-container" key={index} onClick={() => downloadFile(arquivo.id)}>
                                            <p style={{ cursor: 'pointer' }}>
                                                {arquivo.nome}
                                            </p>
                                            <button>
                                                <img src={Download} alt={arquivo.id} />
                                            </button>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                        <h2>Conteúdo</h2>
                        <div className="coluna5">
                            <div>
                                <h1>{formatarTexto(dadosRelatorio.conteudo)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}