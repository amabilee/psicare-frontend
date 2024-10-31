import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css";

export default function EditarPaciente({ handleEditarClose, dadosPaciente, renderDadosPaciente }) {
    const [cidades, setCidades] = useState([]);
    const [isEditarConfirmar, setIsEditarConfirmar] = useState(false);
    const [Editar, setEditar] = useState(true);
    const [alunosNome, setAlunosNome] = useState({ alunos: [] })
    const [SucessoEditar, setSucessoEditar] = useState(false);
    const [message, setMessage] = useState("");
    const [dadosAtualizados, setDadosAtualizados] = useState(dadosPaciente);
    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    useEffect(() => {
        buscarAlunos();
    }, [])

    const calcularIdade = (dataNascimento) => {
        const dataAtual = new Date();
        const dataAniversario = new Date(dataNascimento); //converte o argumento fornecido para um objeto date

        let idade = dataAtual.getFullYear() - dataAniversario.getFullYear();
        const mes = dataAtual.getMonth() + 1

        if (mes < dataAniversario.getMonth() || (mes === dataAniversario.getMonth() && dataAtual.getDate() < dataAniversario.getDate())) {
            idade--;
        }
        return idade;
    }

    const handleEditarConfirmar = (newState) => () => {
        const idade = calcularIdade(dadosAtualizados.dataNascimento)
        console.log(dadosAtualizados.telefone)
        if (dadosAtualizados.nome.length <= 6) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome completo.");
        } else if (!cpf.isValid(dadosAtualizados.cpf)) {
            setState({ ...newState, open: true });
            setMessage("Insira um cpf válido.");
        } else if (!dadosAtualizados.dataNascimento) {
            setState({ ...newState, open: true });
            setMessage("Insira uma data de nascimento.");
        } else if (dadosAtualizados.sexo === "") {
            setState({ ...newState, open: true });
            setMessage("Selecione um sexo.");
        } else if (!validator.isEmail(dadosAtualizados.email)) {
            setState({ ...newState, open: true });
            setMessage("Insira um email válido.");
        } else if (dadosAtualizados.telefone === "" || dadosAtualizados.telefone.length != 15) {
            setState({ ...newState, open: true });
            setMessage("Insira um telefone válido.");
        } else if (dadosAtualizados.estadoCivil === "") {
            setState({ ...newState, open: true });
            setMessage("Selecione um estado civil.");
        } else if (dadosAtualizados.profissao <= 4) {
            setState({ ...newState, open: true });
            setMessage("Selecione uma profissao.");
        } else if (dadosAtualizados.religiao <= 4) {
            setState({ ...newState, open: true });
            setMessage("Selecione uma religião.");
        } else if (dadosAtualizados.rendaFamiliar === "") {
            setState({ ...newState, open: true });
            setMessage("Selecione uma renda.");
        } else if (dadosAtualizados.nacionalidade <= 4) {
            setState({ ...newState, open: true });
            setMessage("Selecione uma nacionalidade.");
        } else if (dadosAtualizados.naturalidade <= 4) {
            setState({ ...newState, open: true });
            setMessage("Selecione uma naturalidade.");
        } else if (idade < 18 && dadosAtualizados.nomeDoContatoResponsavel.length <= 4) {
            setState({ ...newState, open: true });
            setMessage("Insira o nome do contato/responsável.");
        } else if (idade < 18 && dadosAtualizados.outroContato.length != 15) {
            setState({ ...newState, open: true });
            setMessage("Insira um telefone do contato/responsável válido.");
        } else if (dadosAtualizados.enderecoCep === "") {
            setState({ ...newState, open: true });
            setMessage("Insira um cep.");
        } else if (dadosAtualizados.enderecoLogradouro === "") {
            setState({ ...newState, open: true });
            setMessage("Insira um Logradouro.");
        } else if (dadosAtualizados.enderecoBairro === "") {
            setState({ ...newState, open: true });
            setMessage("Insira um Bairro.");
        } else if (dadosAtualizados.enderecoCidade === "") {
            setState({ ...newState, open: true });
            setMessage("Insira um Cidade.");
        } else if (dadosAtualizados.enderecoUF === "") {
            setState({ ...newState, open: true });
            setMessage("Selecione uma Unidade Federativa.");
        } else if (!dadosAtualizados.alunoUnieva && !dadosAtualizados.funcionarioUnieva) {
            setState({ ...newState, open: true });
            setMessage("Selecione um encaminhador.");
        } else if (dadosAtualizados.encaminhador === "" && dadosAtualizados.alunoUnieva) {
            setState({ ...newState, open: true });
            setMessage("Selecione um aluno");
        } else if (dadosAtualizados.encaminhador.length <= 4 && dadosAtualizados.funcionarioUnieva) {
            setState({ ...newState, open: true });
            setMessage("Insira o funcionario");
        } else if (!dadosAtualizados.dataInicioTratamento) {
            setState({ ...newState, open: true });
            setMessage("Insira a data do início do tratamento.");
        } else if (!dadosAtualizados.dataTerminoTratamento) {
            setState({ ...newState, open: true });
            setMessage("Insira a data do término do tratamento.");
        } else if (dadosAtualizados.tipoDeTratamento === "") {
            setState({ ...newState, open: true });
            setMessage("Selecione um tipo de tratamento.");
        } else {
            setIsEditarConfirmar(true);
            setEditar(false);
        }
    }

    const handleVoltarConfirmar = () => {
        setIsEditarConfirmar(false);
        setEditar(true);
    }

    const handleSucessoConfirmar = async () => {
        const token = localStorage.getItem("user_token")

        try {
            await api.patch(`/paciente/${dadosAtualizados._id}`, dadosAtualizados, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            setSucessoEditar(true);
            renderDadosPaciente(dadosAtualizados);
        } catch (e) {
            setState({ ...state, open: true });
            setMessage(typeof e.response.data === 'string' ? e.response.data : e.response.data.message);
        }
    };

    const buscarAlunos = async () => {
        const token = localStorage.getItem("user_token")

        try {
            const selectAlunos = await api.get(`/aluno`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            setAlunosNome(selectAlunos.data);
        } catch (e) {
            console.log("Erro ao buscar alunos: ", e)
        }
    }

    const formatarDataNascimento = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const formatarCPF = (cpf) => {
        if (cpf.length === 11) {

            return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
        }
        return cpf;
    };

    const buscarEnderecoPorCep = async (cep) => {
        try {
            const cepFormatado = cep.replace(/-/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await response.json();

            if (data.erro) {
                setDadosAtualizados((prevState) => ({
                    ...prevState,
                    enderecoLogradouro: "",
                    enderecoBairro: "",
                    enderecoComplemento: "",
                    enderecoCidade: "",
                    enderecoUF: "",
                }));
                setCidades([]);
                setState({ vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("CEP inválido! Por favor, preencha os campos manualmente.");
            } else {
                setDadosAtualizados((prevState) => ({
                    ...prevState,
                    enderecoLogradouro: data.logradouro,
                    enderecoBairro: data.bairro,
                    enderecoComplemento: data.complemento,
                    enderecoCidade: data.localidade,
                    enderecoUF: data.uf,
                }));
                handleChangeUF(data.uf)
            }
        } catch (error) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar endereço");
        }
    };

    const buscarCidadesPorUF = async (uf) => {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            if (!response.ok) {
                setState({ vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Erro ao buscar endereço");
            } else {
                const data = await response.json();
                setCidades(data);
            }
        } catch (error) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar cidades");
        }
    };

    const handleChangeUF = (uf) => {
        const ufSelecionado = uf
        setDadosAtualizados((prevDados) => ({
            ...prevDados,
            enderecoUF: ufSelecionado,
        }));

        if (ufSelecionado) {
            buscarCidadesPorUF(ufSelecionado);
        } else {
            setCidades([]);
        }
    };

    const handleCepChange = (e) => {
        const cepValue = e.target.value;
        setDadosAtualizados((prevState) => ({
            ...prevState,
            enderecoCep: cepValue
        }));
        setCidades([]);
        if (cepValue.length === 9) {
            buscarEnderecoPorCep(cepValue);
        }
    };

    return (
        <>
            {Editar && (
                <div className="modal-editar">
                    <div className="modal-content-editar modal-content-editar-paciente">
                        <h2>Editar Paciente</h2>
                        <hr />
                        <div className="formulario">
                            <h2>Informações pessoais</h2>
                            <div className="flex-informacoes-pessoais">
                                <div className="div-flex">
                                    <label htmlFor="Nome">Nome Completo*</label>
                                    <input type="text" className="nome-completo" id="nome" value={dadosAtualizados.nome} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, nome: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="CPF">CPF*</label>
                                    <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosAtualizados.cpf} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, cpf: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="data-nascimento">Data de nascimento*</label>
                                    <DatePicker
                                        className="data-nascimento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        value={new Date(dadosAtualizados.dataNascimento)}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, dataNascimento: e })}
                                    />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="sexo">Sexo*</label>
                                    <select className="sexo" name="sexo" id="sexo"
                                        value={dadosAtualizados.sexo} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, sexo: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Prefiro nãoo informar">Prefiro não informar</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-informacoes-pessoais">
                                <div className="div-flex">
                                    <label htmlFor="Email">Email*</label>
                                    <input type="email" className="email" id="email"
                                        value={dadosAtualizados.email} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, email: e.target.value })}
                                    />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="Telefone">Telefone*</label>
                                    <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosAtualizados.telefone} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, telefone: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="estado-civil">Estado civil*</label>
                                    <select className="estado-civil" name="estado-civil" id="estado-civil"
                                        value={dadosAtualizados.estadoCivil} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, estadoCivil: e.target.value })}
                                    >
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Solteiro">Solteiro</option>
                                        <option value="Casado">Casado</option>
                                        <option value="Separado">Separado</option>
                                        <option value="Divorciado">Divorciado</option>
                                        <option value="Viúvo">Viúvo</option>
                                    </select>
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="profissao">Profissão*</label>
                                    <input type="text" className="profissao" id="profissao" value={dadosAtualizados.profissao} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, profissao: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex-informacoes-pessoais">
                                <div className="div-flex">
                                    <label htmlFor="religiao">Religião*</label>
                                    <input type="text" className="religiao" id="religiao" value={dadosAtualizados.religiao} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, religiao: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="renda">Renda Familiar*</label>
                                    <select className="renda" name="renda" id="renda" value={dadosAtualizados.rendaFamiliar} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, rendaFamiliar: e.target.value })} >
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Menos de R$500">Menos de R$500</option>
                                        <option value="R$500 - $999">R$500 - $999</option>
                                        <option value="R$1,000 - R$1,999">R$1,000 - R$1,999</option>
                                        <option value="R$2,000 - R$2,999">R$2,000 - R$2,999</option>
                                        <option value="R$3,000 - R$4,999">R$3,000 - R$4,999</option>
                                        <option value="R$5,000 ou mais">R$5,000 ou mais</option>
                                    </select>
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="nacionalidade">Nacionalidade*</label>
                                    <input type="text" className="nacionalidade" id="nacionalidade" value={dadosAtualizados.nacionalidade} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, nacionalidade: e.target.value })} />
                                </div>
                                <div className="div-flex-naturalidade">
                                    <label htmlFor="naturalidade">Naturalidade*</label>
                                    <input type="text" className="naturalidade" id="naturalidade" value={dadosAtualizados.naturalidade} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, naturalidade: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex-informacoes-pessoais">
                                <div className="div-flex">
                                    <label htmlFor="nome-contato">Nome do contato/responsável</label>
                                    <input type="text" className="nome-contato" id="nome-contato" value={dadosAtualizados.nomeDoContatoResponsavel} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, nomeDoContatoResponsavel: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="outro">Telefone contato/responsável</label>
                                    <IMaskInput type="text" className="outro" id="outro" mask="(00)0 0000-0000" value={dadosAtualizados.outroContato} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, outroContato: e.target.value })} />
                                </div>

                            </div>

                            <h2>Endereço</h2>

                            <div className="flex-endereco">
                                <div className="div-flex">
                                    <label htmlFor="cep">CEP*</label>
                                    <IMaskInput
                                        type="text"
                                        className="cep"
                                        id="cep"
                                        mask="00000-000"
                                        value={dadosAtualizados.enderecoCep}
                                        onChange={handleCepChange} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="bairro">Bairro*</label>
                                    <input
                                        type="text"
                                        className="bairro"
                                        id="bairro"
                                        disabled={String(dadosAtualizados.enderecoCep).length === 9 ? false : true}
                                        value={String(dadosAtualizados.enderecoCep).length === 9 ? dadosAtualizados.enderecoBairro : ""}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, enderecoBairro: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="logradouro">Logradouro*</label>
                                    <input
                                        type="text"
                                        className="logradouro"
                                        id="logradouro"
                                        disabled={String(dadosAtualizados.enderecoCep).length === 9 ? false : true}
                                        value={String(dadosAtualizados.enderecoCep).length === 9 ? dadosAtualizados.enderecoLogradouro : ""}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, enderecoLogradouro: e.target.value })} />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="complemento">Complemento</label>
                                    <input
                                        type="text"
                                        className="complemento"
                                        id="complemento"
                                        disabled={String(dadosAtualizados.enderecoCep).length === 9 ? false : true}
                                        value={String(dadosAtualizados.enderecoCep).length === 9 ? dadosAtualizados.enderecoComplemento : ""}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, enderecoComplemento: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex-endereco">
                                <div className="div-flex">
                                    <label htmlFor="uf">UF*</label>
                                    <select
                                        className="uf"
                                        name="uf"
                                        id="uf"
                                        disabled={String(dadosAtualizados.enderecoCep).length === 9 ? false : true}
                                        value={String(dadosAtualizados.enderecoCep).length === 9 ? dadosAtualizados.enderecoUF : ""}
                                        onChange={(e) => handleChangeUF(e.target.value)}
                                    >
                                        <option value="" disabled></option>
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AP">AP</option>
                                        <option value="AM">AM</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="MG">MG</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PR">PR</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RS">RS</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="SC">SC</option>
                                        <option value="SP">SP</option>
                                        <option value="SE">SE</option>
                                        <option value="TO">TO</option>
                                    </select>
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="cidade">Cidade*</label>
                                    <select
                                        type="text"
                                        className="cidade"
                                        id="cidade"
                                        value={dadosAtualizados.enderecoCidade}
                                        disabled={!dadosAtualizados.enderecoUF}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, enderecoCidade: e.target.value })}
                                    >
                                        <option value="">Selecione a cidade</option>
                                        {cidades.map((cidade) => (
                                            <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <h2>Informações de tratamento</h2>

                            <div className="flex-informacoes-tratamento">
                                <div className="div-flex">
                                    <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                                    {dadosAtualizados.alunoUnieva ? (
                                        <select
                                            className="encaminhadorSelect"
                                            id="encaminhadorSelect"
                                            value={dadosAtualizados.alunoId._id}
                                            onChange={(e) => {
                                                const selectedOptionText = e.target.options[e.target.selectedIndex].text;
                                                setDadosAtualizados({
                                                    ...dadosAtualizados,
                                                    encaminhador: selectedOptionText,
                                                    alunoId: e.target.value
                                                });

                                                console.log(selectedOptionText, e.target.value);
                                            }}
                                            disabled={!dadosAtualizados.alunoUnieva}
                                        >
                                            <option value="" disabled>Selecione uma opção</option>
                                            {alunosNome.alunos.map(aluno => (
                                                <option
                                                    key={aluno.nome}
                                                    value={aluno._id}
                                                >
                                                    {aluno.nome}
                                                </option>
                                            ))}
                                        </select>

                                    ) : (
                                        <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                            value={dadosAtualizados.encaminhador}
                                            onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, encaminhador: e.target.value })}
                                            disabled={!dadosAtualizados.funcionarioUnieva}
                                        />
                                    )}
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="status">Status Encaminhador*</label>
                                    <select className="status" name="status" id="status"
                                        value={dadosAtualizados.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosAtualizados.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : dadosAtualizados.encaminhador ? "" : ""}
                                        onChange={(e) => { setDadosAtualizados({ ...dadosAtualizados, alunoUnieva: e.target.value === "Aluno da UniEVANGÉLICA", funcionarioUnieva: e.target.value === "Funcionário da Associação Educativa Evangélica", encaminhador: "" }) }}>
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Aluno da UniEVANGÉLICA">Aluno da UniEVANGÉLICA</option>
                                        <option value="Funcionário da Associação Educativa Evangélica">Funcionário da Associação Educativa Evangélica</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-informacoes-tratamento">
                                <div className="div-flex">
                                    <label htmlFor="inicio-tratamento">Início do Tratamento*</label>
                                    <DatePicker
                                        className="inicio-tratamento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        value={new Date(dadosAtualizados.dataInicioTratamento)}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, dataInicioTratamento: e })}
                                    />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="termino-tratamento">Término do tratamento*</label>
                                    <DatePicker
                                        className="termino-tratamento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        value={new Date(dadosAtualizados.dataTerminoTratamento)}
                                        onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, dataTerminoTratamento: e })}
                                    />
                                </div>
                                <div className="div-flex">
                                    <label htmlFor="tratamento">Tipo de tratamento*</label>
                                    <select className="tratamento" name="tratamento" id="tratamento" value={dadosAtualizados.tipoDeTratamento} onChange={(e) => setDadosAtualizados({ ...dadosAtualizados, tipoDeTratamento: e.target.value })}>
                                        <option value="" disabled>Selecione uma opção</option>
                                        <option value="Psicoterapia">Psicoterapia</option>
                                        <option value="Plantão">Plantão</option>
                                        <option value="Psicodiagnóstico">Psicodiagnóstico</option>
                                        <option value="Avaliação diagnóstica">Avaliação diagnóstica</option>
                                    </select>
                                </div>
                            </div>
                            <p className="campo_obrigatorio">*Campo Obrigatório</p>

                            <div className="buttons-form buttons-form-paciente">
                                <button className="button-cancelar" id="voltar" onClick={handleEditarClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleEditarConfirmar({ vertical: 'bottom', horizontal: 'center' })}>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isEditarConfirmar && (
                <div className="modal-confirmar">
                    <div className="modal-content-confirmar modal-content-confirmar-paciente">
                        <h2>Confirmar Edição de Paciente</h2>
                        <hr />

                        <div className="dados-inseridos">
                            <h2>Informacoes Pessoais</h2>
                            <div className="coluna1">
                                <div className="nome">
                                    <p>Nome Completo</p>
                                    <h1>{dadosAtualizados.nome}</h1>
                                </div>
                                <div className="CPF">
                                    <p>CPF</p>
                                    <h1>{formatarCPF(dadosAtualizados.cpf)}</h1>
                                </div>
                                <div className="data-nascimento">
                                    <p>Data Nascimento</p>
                                    <h1>{formatarDataNascimento(dadosAtualizados.dataNascimento)}</h1>
                                </div>
                                <div className="sexo">
                                    <p>Sexo</p>
                                    <h1>{dadosAtualizados.sexo}</h1>
                                </div>
                            </div>
                            <div className="coluna2">
                                <div className="email">
                                    <p>Email</p>
                                    <h1>{dadosAtualizados.email}</h1>
                                </div>
                                <div className="telefone">
                                    <p>Telefone</p>
                                    <h1>{dadosAtualizados.telefone}</h1>
                                </div>
                                <div className="estadoCivil">
                                    <p>Estado Civil</p>
                                    <h1>{dadosAtualizados.estadoCivil}</h1>
                                </div>
                                <div className="profissao">
                                    <p>Profissão</p>
                                    <h1>{dadosAtualizados.profissao}</h1>
                                </div>
                            </div>
                            <div className="coluna3">
                                <div className="religiao">
                                    <p>Religião</p>
                                    <h1>{dadosAtualizados.religiao}</h1>
                                </div>
                                <div className="renda">
                                    <p>Renda Familiar</p>
                                    <h1>{dadosAtualizados.rendaFamiliar}</h1>
                                </div>
                                <div className="nacionalidade">
                                    <p>Nacionalidade</p>
                                    <h1>{dadosAtualizados.nacionalidade}</h1>
                                </div>
                                <div className="naturalidade">
                                    <p>Naturalidade</p>
                                    <h1>{dadosAtualizados.naturalidade}</h1>
                                </div>
                            </div>
                            <div className="coluna4">
                                <div className="nomeContato">
                                    <p>Nome do contato/responsável</p>
                                    <h1>{dadosAtualizados.nomeDoContatoResponsavel === "" ? ("Não informado") : (dadosAtualizados.nomeDoContatoResponsavel)}</h1>
                                </div>
                                <div className="outro">
                                    <p>Telefone contato/responsável</p>
                                    <h1>{dadosAtualizados.outroContato === "" ? ("Não informado") : (dadosAtualizados.outroContato)}</h1>
                                </div>
                            </div>

                            <h2>Endereço</h2>
                            <div className="coluna5">
                                <div className="cep">
                                    <p>CEP</p>
                                    <h1>{dadosAtualizados.enderecoCep}</h1>
                                </div>
                                <div className="logradouro">
                                    <p>Logradouro</p>
                                    <h1>{dadosAtualizados.enderecoLogradouro}</h1>
                                </div>
                                <div className="Bairro">
                                    <p>Bairro</p>
                                    <h1>{dadosAtualizados.enderecoBairro}</h1>
                                </div>
                            </div>
                            <div className="coluna6">
                                <div className="cidade">
                                    <p>Cidade</p>
                                    <h1>{dadosAtualizados.enderecoCidade}</h1>
                                </div>
                                <div className="complemento">
                                    <p>Complemento</p>
                                    <h1>{dadosAtualizados.enderecoComplemento === "" ? ("Não informado") : (dadosAtualizados.enderecoComplemento)}</h1>
                                </div>
                                <div className="UF">
                                    <p>UF</p>
                                    <h1>{dadosAtualizados.enderecoUF}</h1>
                                </div>
                            </div>
                            <h2>Informações de Tratamento</h2>
                            <div className="coluna7">
                                <div className="nome-encaminhador">
                                    <p>Nome do Encaminhador</p>
                                    <h1>{dadosAtualizados.encaminhador}</h1>
                                </div>
                                <div className="status-encaminhador">
                                    <p>Status do encaminhador</p>
                                    <h1>{dadosAtualizados.alunoUnieva ? "Aluno da UniEVANGÉLICA" : dadosAtualizados.funcionarioUnieva ? "Funcionário da Associação Educativa Evangélica" : ""}</h1>
                                </div>
                            </div>
                            <div className="coluna8">
                                <div className="inicioTratamento">
                                    <p>Início do Tratamento</p>
                                    <h1>{formatarDataNascimento(dadosAtualizados.dataInicioTratamento)}</h1>
                                </div>
                                <div className="terminoTratamento">
                                    <p>Término do Tratamento</p>
                                    <h1>{formatarDataNascimento(dadosAtualizados.dataTerminoTratamento)}</h1>
                                </div>
                                <div className="tipoTratamento">
                                    <p>Tipo de Tratamento</p>
                                    <h1>{dadosAtualizados.tipoDeTratamento}</h1>
                                </div>
                            </div>

                            <div className="buttons-confirmar buttons-confirmar-paciente">
                                <button className="button-voltar-confirmar" id="voltar" onClick={handleVoltarConfirmar} >
                                    Voltar
                                </button>
                                <button type="submit" className="button-confirmar" id="cadastrar" onClick={handleSucessoConfirmar}>
                                    Confirmar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            {SucessoEditar && (
                <div className="modal-sucesso">
                    <div className="modal-sucesso-content">
                        <h1>Sucesso!</h1>
                        <h2>Paciente atualizado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleEditarClose} >Fechar</button>
                    </div>
                </div>
            )}
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity="error" onClose={handleClose} action="">
                    {message}
                </Alert>
            </Snackbar>
        </>

    );
}
