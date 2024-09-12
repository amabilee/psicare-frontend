import React, {useState, useEffect} from "react";
import SideBar from "../../components/SideBar/sidebar";
import TablePaciente from "../../components/table/paciente";
import 'rsuite/dist/rsuite.css';
import { DatePicker } from 'rsuite';
import CadastrarPaciente from "../../components/cadastrar/paciente";
import filtragem from "../../assets/filtragem.svg";
import {IMaskInput} from "react-imask";
import { IoMdPersonAdd } from "react-icons/io";
import icon_pesquisa from "../../assets/pesquisa.svg"
import "./style.css";

export default function Paciente(){
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isFiltragemOpen, setIsFiltragemOpen] = useState(false);
    const [renderFormTable, setRenderFormTable] = useState();
    const [pesquisaUsuario, setPesquisaUsuario] = useState("");
    const [enviarFiltragem, setEnviarFiltragem] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        encaminhador: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        tipoDeTratamento: "",
        sexo: ""
    })
    const [filtrarPesquisa, setFiltrarPesquisa] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        encaminhador: "",
        dataInicioTratamento: "",
        dataTerminoTratamento: "",
        tipoDeTratamento: "",
        sexo: ""
    })

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const modalFiltragemClick = () => {
        setIsFiltragemOpen(true);
        if(isFiltragemOpen){
            setIsFiltragemOpen(false)
        }
    }

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const handlePesquisar = (e) => {
        setPesquisaUsuario(e.target.value);
    }

    const handleFiltrarPesquisa = () => {   
        setIsFiltragemOpen(false)
        setPesquisaUsuario("")
        setEnviarFiltragem(filtrarPesquisa)
    };

    useEffect(() => {
        if (isFiltragemOpen) {
            setEnviarFiltragem({
                nome: "",
                cpf: "",
                dataNascimento: "",
                encaminhador: "",
                dataInicioTratamento: "",
                dataTerminoTratamento: "",
                tipoDeTratamento: "",
                sexo: ""
            }), setFiltrarPesquisa({
                nome: "",
                cpf: "",
                dataNascimento: "",
                encaminhador: "",
                dataInicioTratamento: "",
                dataTerminoTratamento: "",
                tipoDeTratamento: "",
                sexo: ""
            });
        }
    }, [isFiltragemOpen]);

    return(
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Pacientes</h1>
                <div className="barra_pesquisa">
                    <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                        <IoMdPersonAdd className="icon_cadastro"/>
                        Novo Cadastro 
                    </button>
                    <img src={filtragem} alt="filtragem" className="icon_pesquisa_avançada" onClick={modalFiltragemClick}/>
                    <div className="container">
                        <input type="text" value={pesquisaUsuario} onChange={handlePesquisar} className="pesquisar" />
                        <img src={icon_pesquisa} alt="icon_pesquisa" id="icon_pesquisa" className="icon_pesquisa" />
                    </div> 
                </div>
                {isFiltragemOpen && (
                    <div className="modal-filtragem">
                        <div className="modal-content-filtragem modal-content-filtragem-paciente">
                            <h1>Filtrar por</h1>
                            <hr />
                            <div className="formulario">
                                <label htmlFor="Nome">Nome Completo</label>
                                <input type="text" id="nome" value={filtrarPesquisa.nome} onChange={(e) => setFiltrarPesquisa({...filtrarPesquisa, nome: e.target.value})}/>
                                <div className="coluna1">
                                    <div className="div-CPF">
                                        <label htmlFor="CPF">CPF</label>
                                        <IMaskInput type="text" className="CPF" id="CPF" mask="000.000.000-00" value={filtrarPesquisa.cpf} onChange={(e) => setFiltrarPesquisa({...filtrarPesquisa, cpf: e.target.value})}/>
                                    </div>
                                    <div className="div-dataNascimento">
                                        <label htmlFor="data-nascimento">Data de nascimento</label>
                                        <DatePicker 
                                        className="data-nascimento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        // value={filtrarPesquisa.dataNascimento}
                                        onChange={(e) =>  setFiltrarPesquisa({...filtrarPesquisa, dataNascimento: e})}
                                        />
                                    </div>
                                </div>
                                <label htmlFor="labelEncaminhador">Nome do Encaminhador</label>
                                <input type="text" className="encaminhadorInput" id="encaminhadorInput" 
                                    value={filtrarPesquisa.encaminhador} 
                                    onChange={(e) => setFiltrarPesquisa({...filtrarPesquisa, encaminhador: e.target.value})} 
                                    />
                                <div className="coluna2">
                                    <div className="div-inicioTratamento">
                                        <label htmlFor="inicio-tratamento">Início do Tratamento</label>
                                        <DatePicker 
                                        className="inicio-tratamento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        // value={filtrarPesquisa.dataNascimento}
                                        onChange={(e) =>  setFiltrarPesquisa({...filtrarPesquisa, dataInicioTratamento: e})}
                                        />
                                    </div>
                                    <div className="div-terminoTratamento">
                                        <label htmlFor="termino-tratamento">Término do tratamento</label>
                                        <DatePicker 
                                        className="termino-tratamento"
                                        format="dd/MM/yyyy"
                                        placeholder="dd/mm/aaaa"
                                        // value={filtrarPesquisa.dataNascimento}
                                        onChange={(e) =>  setFiltrarPesquisa({...filtrarPesquisa, dataTerminoTratamento: e})}
                                        />
                                    </div>
                                </div>
                                <label htmlFor="tratamento">Tipo de tratamento</label>
                                <select className="tratamento" name="tratamento" id="tratamento" value={filtrarPesquisa.tipoDeTratamento} onChange={(e) =>  setFiltrarPesquisa({...filtrarPesquisa, tipoDeTratamento:e.target.value})}>
                                    <option value="" disabled>Selecione uma opção</option>
                                    <option value="psicoterapia">Psicoterapia</option>
                                    <option value="plantao">Plantão</option>
                                    <option value="psicodiagnostico">Psicodiagnóstico</option>
                                    <option value="avaliacao diagnostica">Avaliação diagnóstica</option>
                                </select>
                                <label htmlFor="sexo">Sexo</label>
                                <select className="sexo" name="sexo" id="sexo" 
                                value={filtrarPesquisa.sexo} onChange={(e) =>  setFiltrarPesquisa({...filtrarPesquisa, sexo: e.target.value})}
                                >
                                    <option value="" disabled>Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="prefiro nao informar">Prefiro não informar</option>
                                </select>
                                
                                <button className="button-filtro" id="filtro" onClick={handleFiltrarPesquisa}>Aplicar Filtros</button>
                            </div>
                        </div>
                    </div>
                )}
                <TablePaciente renderFormTable={renderFormTable} pesquisar={pesquisaUsuario} filtrarPesquisa={enviarFiltragem}/>
                {isCadastroOpen && (<CadastrarPaciente handleCloseModal={handleCloseModal} renderForm={renderProps}/>)}
            </div>
        </>
    )
}