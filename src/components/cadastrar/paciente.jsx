import { useState, useEffect } from "react";
import { api } from "../../services/server";
import { IMaskInput } from "react-imask";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import validator from "validator";
import { cpf } from 'cpf-cnpj-validator';
import "./style.css"
import Select from 'react-select'

export default function CadastrarPaciente({ handleCloseModal, renderForm }) {
    const [cidades, setCidades] = useState([]);
    const [isSucessModalOpen, setIsSucessModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [alunosNome, setAlunosNome] = useState({ alunos: [] })
    const [dadosForm, setDadosForm] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        email: "",
        telefone: "",
        sexo: "",
        estadoCivil: "",
        religiao: "",
        rendaFamiliar: "",
        profissao: "",
        outroContato: "",
        nomeDoContatoResponsavel: "",
        naturalidade: "",
        nacionalidade: "",
        enderecoCep: "",
        enderecoLogradouro: "",
        enderecoBairro: "",
        enderecoComplemento: "",
        enderecoCidade: "",
        enderecoUF: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        encaminhador: "",
        tipoDeTratamento: "",
        alunoUnieva: false,
        funcionarioUnieva: false,
        ativoPaciente: true,
        alunoId: ""
    });

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;

    useEffect(() => {
        buscarAlunos();
    }, [])

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const calcularIdade = (dataNascimento) => {
        const dataAtual = new Date();
        const dataAniversario = new Date(dataNascimento);

        let idade = dataAtual.getFullYear() - dataAniversario.getFullYear();
        const mes = dataAtual.getMonth() + 1
        if (mes < dataAniversario.getMonth() || (mes === dataAniversario.getMonth() && dataAtual.getDate() < dataAniversario.getDate())) {
            idade--;
        }
        return idade;
    }

    const HandleFormSubmit = () => async () => {
        const idade = calcularIdade(dadosForm.dataNascimento)
        if (dadosForm.nome.length <= 6) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira o nome completo.");
            return;
        } else if (!cpf.isValid(dadosForm.cpf)) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um cpf válido.");
            return;
        } else if (!validator.isDate(dadosForm.dataNascimento)) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira uma data de nascimento.");
            return;
        } else if (dadosForm.sexo === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um sexo.");
            return;
        } else if (!validator.isEmail(dadosForm.email)) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um email válido.");
            return;
        } else if (dadosForm.telefone.length != 15) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um telefone válido.");
            return;
        } else if (dadosForm.estadoCivil === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um estado civil.");
            return;
        } else if (dadosForm.profissao <= 4) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma profissao.");
            return;
        } else if (dadosForm.religiao <= 4) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma religião.");
            return;
        } else if (dadosForm.rendaFamiliar === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma renda.");
            return;
        } else if (dadosForm.nacionalidade <= 4) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma nacionalidade.");
            return;
        } else if (dadosForm.naturalidade <= 4) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma naturalidade.");
            return;
        } else if (idade < 18 && dadosForm.nomeDoContatoResponsavel.length <= 4) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira o nome do contato/responsável.");
            return;
        } else if (idade < 18 && dadosForm.outroContato.length != 15) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um telefone do contato/responsável válido.");
            return;
        } else if (dadosForm.enderecoCep === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um cep.");
            return;
        } else if (dadosForm.enderecoLogradouro === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um Logradouro.");
            return;
        } else if (dadosForm.enderecoBairro === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um Bairro.");
            return;
        } else if (dadosForm.enderecoCidade === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira um Cidade.");
            return;
        } else if (dadosForm.enderecoUF === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione uma Unidade Federativa.");
            return;
        } else if (!dadosForm.alunoUnieva && !dadosForm.funcionarioUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um encaminhador.");
            return;
        } else if (!dadosForm.alunoId === "" && dadosForm.alunoUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione o AlunoUnieva");
            return;
        } else if (dadosForm.encaminhador.length <= 4 && dadosForm.funcionarioUnieva) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira o funcionario");
            return;
        } else if (!validator.isDate(dadosForm.dataInicioTratamento)) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira a data do início do tratamento.");
            return;
        }
        else if (!validator.isDate(dadosForm.dataTerminoTratamento)) {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Insira a data do término do tratamento.");
            return;
        } else if (dadosForm.tipoDeTratamento === "") {
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Selecione um tipo de tratamento.");
            return;
        } else if (dadosForm.dataInicioTratamento.getTime() >= dadosForm.dataTerminoTratamento.getTime()) {
            setState({ ...state, open: true });
            setMessage("A data de início do tratamento deve ser menor que a de término.");
            return
        } else {
            const token = localStorage.getItem("user_token")
            const dataNascimentoFormatada = new Date(dadosForm.dataNascimento).toISOString().split('T')[0]
            const dataInicioFormatada = new Date(dadosForm.dataInicioTratamento).toISOString().split('T')[0]
            const dataTerminoFormatada = new Date(dadosForm.dataTerminoTratamento).toISOString().split('T')[0]
            const dadosFormAtualizados = {
                ...dadosForm,
                alunoId: dadosForm.alunoUnieva ? dadosForm.encaminhador : "",
                dataNascimento: dataNascimentoFormatada,
                dataInicioTratamento: dataInicioFormatada,
                dataTerminoTratamento: dataTerminoFormatada
            };
            try {
                await api.post("/paciente", dadosFormAtualizados, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `Bearer ${token}`
                    }
                });
                setIsSucessModalOpen(true);
                renderForm(true)
            } catch (e) {
                setState({ vertical: 'bottom', horizontal: 'center', open: true });
                setMessage(e.response.data.error);
            }
        }
    }

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
            setState({ vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar alunos");
        }
    }

    const buscarEnderecoPorCep = async (cep) => {
        try {
            const cepFormatado = cep.replace(/-/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await response.json();

            if (data.erro) {
                setDadosForm((prevState) => ({
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
                setDadosForm((prevState) => ({
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
        setDadosForm((prevDados) => ({
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
        setDadosForm((prevState) => ({
            ...prevState,
            enderecoCep: cepValue
        }));
        setCidades([]);
        if (cepValue.length === 9) {
            buscarEnderecoPorCep(cepValue);
        }
    };

    const estados = [
        { value: "AC", label: "AC" },
        { value: "AL", label: "AL" },
        { value: "AP", label: "AP" },
        { value: "AM", label: "AM" },
        { value: "BA", label: "BA" },
        { value: "CE", label: "CE" },
        { value: "DF", label: "DF" },
        { value: "ES", label: "ES" },
        { value: "GO", label: "GO" },
        { value: "MA", label: "MA" },
        { value: "MT", label: "MT" },
        { value: "MS", label: "MS" },
        { value: "MG", label: "MG" },
        { value: "PA", label: "PA" },
        { value: "PB", label: "PB" },
        { value: "PR", label: "PR" },
        { value: "PE", label: "PE" },
        { value: "PI", label: "PI" },
        { value: "RJ", label: "RJ" },
        { value: "RN", label: "RN" },
        { value: "RS", label: "RS" },
        { value: "RO", label: "RO" },
        { value: "RR", label: "RR" },
        { value: "SC", label: "SC" },
        { value: "SP", label: "SP" },
        { value: "SE", label: "SE" },
        { value: "TO", label: "TO" }
    ];

    const cidadeOptions = cidades.map((cidade) => ({
        value: cidade.nome,
        label: cidade.nome,
    }));


    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    const sexOptions = [
        { value: "Masculino", label: "Masculino" },
        { value: "Feminino", label: "Feminino" },
        { value: "prefiro nao informar", label: "Prefiro não informar" },
    ]

    const tratamentoOptions = [
        { value: "Psicoterapia", label: "Psicoterapia" },
        { value: "Plantão", label: "Plantão" },
        { value: "Psicodiagnóstico", label: "Psicodiagnóstico" },
        { value: "Avaliação Diagnóstica", label: "Avaliação diagnóstica" }
    ]

    const civilOptions = [
        { value: "Solteiro", label: "Solteiro" },
        { value: "Casado", label: "Casado" },
        { value: "Separado", label: "Separado" },
        { value: "Divorciado", label: "Divorciado" },
        { value: "Viúvo", label: "Viúvo" }
    ]

    const rendaOptions = [
        { value: "Menos de R$500", label: "Menos de R$500" },
        { value: "R$500 - $999", label: "R$500 - $999" },
        { value: "R$1,000 - R$1,999", label: "R$1,000 - R$1,999" },
        { value: "R$2,000 - R$2,999", label: "R$2,000 - R$2,999" },
        { value: "R$3,000 - R$4,999", label: "R$3,000 - R$4,999" },
        { value: "R$5,000 ou mais", label: "R$5,000 ou mais" }
    ]

    const statusOptions = [
        { value: "Aluno da UniEVANGÉLICA", label: "Aluno da UniEVANGÉLICA" },
        { value: "Funcionário da Associação Educativa Evangélica", label: "Funcionário da Associação Educativa Evangélica" }
    ]

    const alunoOptions = alunosNome.alunos.map((aluno) => ({
        value: aluno._id,
        label: aluno.nome,
    }));

    return (
        <>
            <div className="modal" id="modal">
                <div className="modal-content modal-content-paciente">
                    <h2>Cadastro de paciente</h2>
                    <hr />
                    <div className="formulario">
                        <h2>Informações Pessoais</h2>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="Nome">Nome Completo*</label>
                                <input type="text" className="nome-completo" id="nome" value={dadosForm.nome} onChange={(e) => setDadosForm({ ...dadosForm, nome: e.target.value })} maxLength={100} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="CPF">CPF*</label>
                                <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={dadosForm.cpf} onChange={(e) => setDadosForm({ ...dadosForm, cpf: e.target.value })} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="data-nascimento">Data de nascimento*</label>
                                <DatePicker
                                    className="data-nascimento"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/mm/aaaa"
                                    onChange={(e) => { setDadosForm({ ...dadosForm, dataNascimento: e }) }}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="sexo">Sexo*</label>
                                <Select
                                    className="sex-select"
                                    options={sexOptions}
                                    value={sexOptions.find(option => option.value === dadosForm.sexo) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, sexo: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="Email">Email*</label>
                                <input type="email" className="email" id="email"
                                    value={dadosForm.email} onChange={(e) => setDadosForm({ ...dadosForm, email: e.target.value })}
                                    maxLength={150}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="Telefone">Telefone*</label>
                                <IMaskInput type="text" className="telefone" id="telefone" mask="(00)0 0000-0000" value={dadosForm.telefone} onChange={(e) => setDadosForm({ ...dadosForm, telefone: e.target.value })} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="estado-civil">Estado civil*</label>
                                <Select
                                    className="sex-select"
                                    options={civilOptions}
                                    value={civilOptions.find(option => option.value === dadosForm.estadoCivil) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, estadoCivil: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="profissao">Profissão*</label>
                                <input type="text" className="profissao" id="profissao" value={dadosForm.profissao} onChange={(e) => setDadosForm({ ...dadosForm, profissao: e.target.value })} maxLength={80} />
                            </div>
                        </div>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="religiao">Religião*</label>
                                <input type="text" className="religiao" id="religiao" value={dadosForm.religiao} onChange={(e) => setDadosForm({ ...dadosForm, religiao: e.target.value })} maxLength={50} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="renda">Renda Familiar*</label>
                                <Select
                                    className="sex-select"
                                    options={rendaOptions}
                                    value={rendaOptions.find(option => option.value === dadosForm.rendaFamiliar) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, rendaFamiliar: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="nacionalidade">Nacionalidade*</label>
                                <input type="text" className="nacionalidade" id="nacionalidade" value={dadosForm.nacionalidade} onChange={(e) => setDadosForm({ ...dadosForm, nacionalidade: e.target.value })} maxLength={50} />
                            </div>
                            <div className="div-flex-naturalidade">
                                <label htmlFor="naturalidade">Naturalidade*</label>
                                <input type="text" className="naturalidade" id="naturalidade" value={dadosForm.naturalidade} onChange={(e) => setDadosForm({ ...dadosForm, naturalidade: e.target.value })} maxLength={50} />
                            </div>
                        </div>
                        <div className="flex-informacoes-pessoais">
                            <div className="div-flex">
                                <label htmlFor="nome-contato">Nome do contato/responsável</label>
                                <input type="text" className="nome-contato" id="nome-contato" value={dadosForm.nomeDoContatoResponsavel} onChange={(e) => setDadosForm({ ...dadosForm, nomeDoContatoResponsavel: e.target.value })} maxLength={100} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="outro">Telefone contato/responsável</label>
                                <IMaskInput type="text" className="outro" id="outro" mask="(00)0 0000-0000" value={dadosForm.outroContato} onChange={(e) => setDadosForm({ ...dadosForm, outroContato: e.target.value })} />
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
                                    value={dadosForm.enderecoCep}
                                    onChange={handleCepChange} />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="bairro">Bairro*</label>
                                <input type="text"
                                    className="bairro"
                                    id="bairro"
                                    disabled={String(dadosForm.enderecoCep).length === 9 ? false : true}
                                    value={String(dadosForm.enderecoCep).length === 9 ? dadosForm.enderecoBairro : ""}
                                    onChange={(e) => setDadosForm({ ...dadosForm, enderecoBairro: e.target.value })}
                                    maxLength={100}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="logradouro">Logradouro*</label>
                                <input type="text"
                                    className="logradouro"
                                    id="logradouro"
                                    disabled={String(dadosForm.enderecoCep).length === 9 ? false : true}
                                    value={String(dadosForm.enderecoCep).length === 9 ? dadosForm.enderecoLogradouro : ""}
                                    onChange={(e) => setDadosForm({ ...dadosForm, enderecoLogradouro: e.target.value })}
                                    maxLength={150}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="complemento">Complemento</label>
                                <input type="text"
                                    className="complemento"
                                    id="complemento"
                                    disabled={String(dadosForm.enderecoCep).length === 9 ? false : true}
                                    maxLength={100}
                                    value={String(dadosForm.enderecoCep).length === 9 ? dadosForm.enderecoComplemento : ""}
                                    onChange={(e) => setDadosForm({ ...dadosForm, enderecoComplemento: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex-endereco" style={{ justifyContent: "flex-start" }}>
                            <div className="div-flex">
                                <label htmlFor="uf">UF*</label>
                                <Select
                                    className="uf"
                                    name="uf"
                                    id="uf"
                                    options={estados}
                                    menuPlacement="top"
                                    isDisabled={String(dadosForm.enderecoCep).length === 9 ? false : true}
                                    value={String(dadosForm.enderecoCep).length === 9 ? (estados.find((estado) => estado.value === dadosForm.enderecoUF)) : ""}
                                    onChange={(selectedOption) => handleChangeUF(selectedOption.value)}
                                    placeholder="Selecione um estado"
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="cidade">Cidade*</label>
                                <Select
                                    className="cidade"
                                    id="cidade"
                                    options={cidadeOptions}
                                    isDisabled={!dadosForm.enderecoUF}
                                    value={cidadeOptions.find((cidade) => cidade.value === dadosForm.enderecoCidade) || ""}
                                    onChange={(selectedOption) =>
                                        setDadosForm({ ...dadosForm, enderecoCidade: selectedOption.value })
                                    }
                                    placeholder="Selecione a cidade"
                                    menuPlacement="top"
                                />
                            </div>
                        </div>

                        <h2>Informações de tratamento</h2>

                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador*</label>
                                {dadosForm.alunoUnieva ? (
                                    <Select
                                        className="aluno-select"
                                        options={alunoOptions}
                                        disabled={!dadosForm.alunoUnieva}
                                        value={alunoOptions.find(option => option.value === dadosForm.encaminhador) || null}
                                        onChange={(selectedOption) => {
                                            setDadosForm({ ...dadosForm, encaminhador: selectedOption.value });
                                        }}
                                        placeholder="Selecione uma opção"
                                        menuPlacement="top"
                                    />
                                ) : (
                                    <input type="text" className="encaminhadorInput" id="encaminhadorInput"
                                        value={dadosForm.encaminhador}
                                        onChange={(e) => setDadosForm({ ...dadosForm, encaminhador: e.target.value })}
                                        disabled={!dadosForm.funcionarioUnieva}
                                        maxLength={100}
                                    />
                                )}
                            </div>
                            <div className="div-flex">
                                <label htmlFor="status">Status Encaminhador*</label>
                                <Select
                                    className="status-select"
                                    options={statusOptions}
                                    value={statusOptions.find(option => option.value === dadosForm.alunoUnieva) || statusOptions.find(option => option.value === dadosForm.funcionarioUnieva) || null}
                                    onChange={(selectedOption) => {
                                        selectedOption.value == "Aluno da UniEVANGÉLICA" ?
                                        setDadosForm({ ...dadosForm, alunoUnieva: "Aluno da UniEVANGÉLICA", funcionarioUnieva: "", encaminhador: "", alunoId: ""}) : 
                                        setDadosForm({ ...dadosForm, alunoUnieva: "", funcionarioUnieva: "Funcionário da Associação Educativa Evangélica", encaminhador: "", alunoId: ""})
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                        <div className="flex-informacoes-tratamento">
                            <div className="div-flex">
                                <label htmlFor="inicio-tratamento">Início do Tratamento*</label>
                                <DatePicker
                                    className="inicio-tratamento"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/mm/aaaa"
                                    onOpen={() => setIsDatePickerOpen(true)}
                                    onClose={() => setIsDatePickerOpen(false)}
                                    onChange={(e) => { setDadosForm({ ...dadosForm, dataInicioTratamento: e }) }}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="termino-tratamento">Término do tratamento*</label>
                                <DatePicker
                                    className="termino-tratamento"
                                    format="dd/MM/yyyy"
                                    placeholder="dd/mm/aaaa"
                                    onOpen={() => setIsDatePickerOpen(true)}
                                    onClose={() => setIsDatePickerOpen(false)}
                                    onChange={(e) => { setDadosForm({ ...dadosForm, dataTerminoTratamento: e }) }}
                                />
                            </div>
                            <div className="div-flex">
                                <label htmlFor="tratamento">Tipo de tratamento*</label>
                                <Select
                                    className="tratamento-select"
                                    options={tratamentoOptions}
                                    value={tratamentoOptions.find(option => option.value === dadosForm.tipoDeTratamento) || null}
                                    onChange={(selectedOption) => {
                                        setDadosForm({ ...dadosForm, tipoDeTratamento: selectedOption.value });
                                    }}
                                    placeholder="Selecione uma opção"
                                    menuPlacement="top"
                                />
                            </div>
                        </div>
                        <p className="campo_obrigatorio">*Campo Obrigatório</p>

                        <div className="buttons-form buttons-form-paciente">
                            <button className="button-voltar" id="voltar" onClick={handleCloseModal} >Cancelar</button>
                            <button className="button-cadastrar" id="cadastrar" onClick={HandleFormSubmit({ vertical: 'bottom', horizontal: 'center' })}>Cadastrar</button>
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
                        </div>
                    </div>
                </div>
            </div >
            {isSucessModalOpen && (
                <div className="modal-sucesso">
                    <div className="modal-sucesso-content">
                        <h1>Sucesso!</h1>
                        <h2>Paciente cadastrado com sucesso.</h2>
                        <button className="button-fechar" id="fechar" onClick={handleCloseModal} >Fechar</button>
                    </div>
                </div>
            )}
            <style>
                {isDatePickerOpen &&
                    `.rs-picker-popup.rs-picker-popup-date {
                        margin-top: -200px !important;
                        margin-left: 270px !important;
                    }`
                }
            </style>
        </>
    )

}