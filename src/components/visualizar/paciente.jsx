import voltar from "../../assets/voltar.svg";
import "./style.css";

export default function VisualizarPaciente({ handleCloseVisualizar, dadosPaciente }) {

    const formatarDataNascimento = (data) => {
        const dataObj = new Date(String(data).replace("T00", "T11"))
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const formatarCPF = (cpf) => {
        if (cpf.length === 11) {

            return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
        }
        return cpf;
    };
    return (
        <div className="visualizar">
            <div className="body-visualizar">
                <div className="header-visualizar header-visualizar-paciente">
                    <div className="header-visualizar-info">
                        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={handleCloseVisualizar} />
                        <h1 onClick={handleCloseVisualizar}>Informações sobre paciente</h1>
                    </div>
                    <hr />
                    <div className="visualizar-info visualizar-info-paciente">
                        <h2>Informações Pessoais</h2>
                        <div className="coluna1">
                            <div className="nome">
                                <p>Nome Completo</p>
                                <h1>{dadosPaciente.nome}</h1>
                            </div>
                            <div className="CPF">
                                <p>CPF</p>
                                <h1>{formatarCPF(dadosPaciente.cpf)}</h1>
                            </div>
                            <div className="data-nascimento">
                                <p>Data Nascimento</p>
                                <h1>{formatarDataNascimento(dadosPaciente.dataNascimento)}</h1>
                            </div>
                            <div className="sexo">
                                <p>Sexo</p>
                                <h1>{dadosPaciente.sexo}</h1>
                            </div>
                        </div>
                        <div className="coluna2">
                            <div className="email">
                                <p>Email</p>
                                <h1>{dadosPaciente.email}</h1>
                            </div>
                            <div className="telefone">
                                <p>Telefone</p>
                                <h1>{dadosPaciente.telefoneContato ? dadosPaciente.telefoneContato : dadosPaciente.telefone}</h1>
                            </div>
                            <div className="estadoCivil">
                                <p>Estado Civil</p>
                                <h1>{dadosPaciente.estadoCivil}</h1>
                            </div>
                            <div className="profissao">
                                <p>Profissão</p>
                                <h1>{dadosPaciente.profissao}</h1>
                            </div>
                        </div>
                        <div className="coluna3">
                            <div className="religiao">
                                <p>Religião</p>
                                <h1>{dadosPaciente.religiao}</h1>
                            </div>
                            <div className="renda">
                                <p>Renda Familiar</p>
                                <h1>{dadosPaciente.rendaFamiliar}</h1>
                            </div>
                            <div className="nacionalidade">
                                <p>Nacionalidade</p>
                                <h1>{dadosPaciente.nacionalidade}</h1>
                            </div>
                            <div className="naturalidade">
                                <p>Naturalidade</p>
                                <h1>{dadosPaciente.naturalidade}</h1>
                            </div>
                        </div>
                        <div className="coluna4">
                            <div className="nomeContato">
                                <p>Nome do contato/responsável</p>
                                <h1>{dadosPaciente.nomeDoContatoResponsavel === "" ? ("Não informado") : (dadosPaciente.nomeDoContatoResponsavel)}</h1>
                            </div>
                            <div className="outro">
                                <p>Telefone contato/responsável</p>
                                <h1>{dadosPaciente.outroContato === "" ? ("Não informado") : (dadosPaciente.outroContato)}</h1>
                            </div>
                        </div>

                        <h2>Endereço</h2>
                        <div className="coluna5">
                            <div className="cep">
                                <p>CEP</p>
                                <h1>{dadosPaciente.enderecoCep}</h1>
                            </div>
                            <div className="logradouro">
                                <p>Logradouro</p>
                                <h1>{dadosPaciente.enderecoLogradouro}</h1>
                            </div>
                            <div className="Bairro">
                                <p>Bairro</p>
                                <h1>{dadosPaciente.enderecoBairro}</h1>
                            </div>
                            <div className="cidade">
                                <p>Cidade</p>
                                <h1>{dadosPaciente.enderecoCidade}</h1>
                            </div>
                            <div className="UF">
                                <p>UF</p>
                                <h1>{dadosPaciente.enderecoUF}</h1>
                            </div>
                            <div className="complemento">
                                <p>Complemento</p>
                                <h1>{dadosPaciente.enderecoComplemento === "" || !dadosPaciente.enderecoComplemento ? ("Não informado") : (dadosPaciente.enderecoComplemento)}</h1>
                            </div>

                        </div>
                        <h2>Informações de Tratamento</h2>
                        <div className="coluna6">
                            <div className="nome-encaminhador">
                                <p>Nome do Encaminhador</p>
                                <h1>{dadosPaciente.encaminhador}</h1>
                            </div>
                            <div className="status-encaminhador">
                                <p>Status do encaminhador</p>
                                <h1>{dadosPaciente.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosPaciente.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : ""}</h1>
                            </div>
                            <div className="inicioTratamento">
                                <p>Início do Tratamento</p>
                                <h1>{formatarDataNascimento(dadosPaciente.dataInicioTratamento)}</h1>
                            </div>
                            <div className="terminoTratamento">
                                <p>Término do Tratamento</p>
                                <h1>{formatarDataNascimento(dadosPaciente.dataTerminoTratamento)}</h1>
                            </div>
                            <div className="tipoTratamento">
                                <p>Tipo de Tratamento</p>
                                <h1>{dadosPaciente.tipoDeTratamento}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}