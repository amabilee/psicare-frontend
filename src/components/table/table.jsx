import React from "react";
import editar from "../../assets/editar-icon.svg";
import excluir from "../../assets/excluir-icon.svg";
import "./style.css";

export default function Table(){
    return(
        <>
            <table>
                <thead> {/* cabeçalho */}
                    <tr> {/* começar uma linha */}
                        <th>ID</th> {/* celula do cabeçalho */}
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Turno</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody> {/* conteudo da tabela */}
                    <tr>
                        <td className="conteudo">001</td> {/* celula do conteudo */}
                        <td className="conteudo">Guilherme</td> 
                        <td className="conteudo">00000000000</td> 
                        <td className="conteudo">Noturno</td> 
                        <td className="icones-acao">
                            <img src={editar} alt="editar" id="icon-acao" />
                            <img src={excluir} alt="excluir" id="icon-acao" />
                        </td>
                    </tr>
                    <tr>
                        <td className="conteudo">002</td> {/* celula do conteudo */}
                        <td className="conteudo">Gustavo</td> 
                        <td className="conteudo">00000000000</td> 
                        <td className="conteudo">Noturno</td> 
                        <td className="icones-acao">
                            <img src={editar} alt="editar" id="icon-acao" />
                            <img src={excluir} alt="excluir" id="icon-acao" />
                        </td>
                    </tr>
                    <tr>
                        <td className="conteudo">003</td> {/* celula do conteudo */}
                        <td className="conteudo">Lucianno</td> 
                        <td className="conteudo">00000000000</td> 
                        <td className="conteudo">Noturno</td> 
                        <td className="icones-acao">
                            <img src={editar} alt="editar" id="icon-acao" />
                            <img src={excluir} alt="excluir" id="icon-acao" />
                        </td>
                    </tr>
                    <tr>
                        <td className="conteudo">004</td> {/* celula do conteudo */}
                        <td className="conteudo">Cesar</td> 
                        <td className="conteudo">00000000000</td> 
                        <td className="conteudo">Matutino</td> 
                        <td className="icones-acao">
                            <img src={editar} alt="editar" id="icon-acao" />
                            <img src={excluir} alt="excluir" id="icon-acao" />
                        </td>
                    </tr>
                </tbody>
                <caption>1/100</caption>
            </table>
        </>
    )
}