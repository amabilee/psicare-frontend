import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import { api } from "../../services/server";

import Download from "../../assets/download.svg"

import "./style.css";

import { UseAuth } from '../../hooks';

import Loader from '../../components/loader/index';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function Gerencia() {
    const { signOut } = UseAuth();
    const [loading, setLoading] = useState(true);

    const [userLevel, setUserLevel] = useState(null);

    const data = {
        aluno: 50,
        professor: 12,
        paciente: 50,
        relatorio: 400,
        relatorio_assinado: 320,
        consulta: {
            pendente: 12,
            aluno_faltou: 9,
            paciente_faltou: 9,
            cancelada: 4,
            concluida: 9,
            andamento: 4
        }
    };

    let typeConsulta = [
        { name: 'Pendente', qnt: data.consulta.pendente },
        { name: 'Aluno faltou', qnt: data.consulta.aluno_faltou },
        { name: 'Paciente faltou', qnt: data.consulta.paciente_faltou },
        { name: 'Cancelada', qnt: data.consulta.cancelada },
        { name: 'Concluída', qnt: data.consulta.concluida },
        { name: 'Em andamento', qnt: data.consulta.andamento },
        { name: 'Total', qnt: (data.consulta.pendente + data.consulta.aluno_faltou + data.consulta.paciente_faltou + data.consulta.cancelada + data.consulta.concluida + data.consulta.andamento) }
    ]

    const TOTAL = Object.values(data.consulta)
        .reduce((sum, value) => sum + value, 0);


    const pieData = [
        { id: 'Pendente', label: 'Pendente', value: data.consulta.pendente, color: '#EB11FF' },
        { id: 'Aluno faltou', label: 'Aluno faltou', value: data.consulta.aluno_faltou, color: '#E77DFF' },
        { id: 'Paciente faltou', label: 'Paciente faltou', value: data.consulta.paciente_faltou, color: '#BC2EDC' },
        { id: 'Cancelada', label: 'Cancelada', value: data.consulta.cancelada, color: '#710198' },
        { id: 'Concluída', label: 'Concluída', value: data.consulta.concluida, color: '#5430A9' },
        { id: 'Em andamento', label: 'Em andamento', value: data.consulta.andamento, color: '#9B68FF' },
    ];

    const getArcLabel = (params) => {
        console.log(TOTAL)
        const percent = (params.value / TOTAL) * 100;
        return `${percent.toFixed(0)}%`;
    };

    const settings = {
        width: 200,
        height: 200,
        value: (data.relatorio_assinado / data.relatorio) * 100,
    };



    const detectarLoading = (childData) => {
        setLoading(childData);
    };

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
        detectarLoading();
    }, []);

    return (
        <>
            <SideBar />
            <div className="body_admin">
                <div className={(userLevel === '2' || userLevel === '3') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                    <h1 className="h1">Dashboard</h1>
                </div>
                {loading ? (
                    <div className="loading-container">
                        <Loader />
                    </div>
                ) : (
                    <div className="gerencia-container">
                        <div className="cards-quantity">
                            <div className="card-box">
                                <h2>{data.aluno}</h2>
                                <p>Alunos</p>
                            </div>
                            <div className="card-box">
                                <h2>{data.professor}</h2>
                                <p>Professores</p>
                            </div>
                            <div className="card-box">
                                <h2>{data.paciente}</h2>
                                <p>Pacientes</p>
                            </div>
                            <div className="card-box">
                                <h2>{data.relatorio}</h2>
                                <p>Relatórios</p>
                            </div>
                            <div className="card-box">
                                <h2>{data.relatorio_assinado}</h2>
                                <p>Relatórios com assinatura</p>
                            </div>
                            <button className="export-button">Exportar<img src={Download}/></button>
                        </div>
                        <div className="atendimentos-report">
                            <select>
                                <option>Última semana</option>
                                <option>Últimos 15 dias</option>
                                <option>Último mês</option>
                                <option>Últimos 6 meses</option>
                                <option>Para sempre</option>
                            </select>
                            <div className="pie-chart-container">
                                <h2>Atendimentos</h2>
                                <PieChart
                                    series={[
                                        {
                                            outerRadius: 100,
                                            data: pieData,
                                            arcLabel: getArcLabel,
                                        },
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: 'white',
                                            fontSize: 14,
                                        },
                                        [`& .${legendClasses.mark}`]: {
                                            ry: 10,
                                        },

                                    }}
                                    width={550}
                                    height={280}
                                    slotProps={{
                                        legend: {
                                            position: {
                                                vertical: 'middle',
                                                horizontal: 'right',
                                            },
                                            itemMarkWidth: 20,
                                            itemMarkHeight: 20,
                                            markGap: 20,
                                            itemGap: 20,
                                            rx: 10,
                                            ry: 10,
                                        }
                                    }}
                                />
                            </div>
                            <div className="table-atendimentos">
                                <table className="table">
                                    <thead>
                                        <tr className="tr-body">
                                            <th>Status de atendimento</th>
                                            <th>Quantidade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {!data || !data.consulta ? (
                                            <tr>
                                                <td colSpan="2" className="nenhum-Dado">
                                                    Nenhum dado encontrado.
                                                </td>
                                            </tr>
                                        ) : (Array.isArray(typeConsulta) &&
                                            typeConsulta.map((type, index) => (
                                                <tr key={index} >
                                                    <td className="table-content" id="td-nome">
                                                        {type.name}
                                                    </td>
                                                    <td className="table-content">
                                                        {type.qnt}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="relatorio-report">
                            <h2>Relatórios com assinatura</h2>
                            <Gauge
                                {...settings}
                                cornerRadius="50%"
                                sx={(theme) => ({
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 25,
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: '#710198',
                                    },
                                    [`& .${gaugeClasses.referenceArc}`]: {
                                        fill: '#E9E9E9',
                                    },
                                    [`& .${gaugeClasses.valueText} text`]: {
                                        fill: '#710198',
                                    }
                                })}
                                text={
                                    ({ value }) => `${value}%`
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
