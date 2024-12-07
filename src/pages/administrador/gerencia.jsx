import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import { api } from "../../services/server";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Download from "../../assets/download.svg"

import "./style.css";

import { UseAuth } from '../../hooks';

import Loader from '../../components/loader/index';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Gerencia() {
    const { signOut } = UseAuth();
    const [loading, setLoading] = useState(true);

    const [userLevel, setUserLevel] = useState(null);
    const [intervalSetting, setIntervalSetting] = useState('0')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

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
        },
        tratamento: {
            iniciaram: {
                psicoterapia: 2,
                plantao: 4,
                psicodiagnostico: 9,
                avaliacao_diagnostica: 1
            },
            terminaram: {
                psicoterapia: 1,
                plantao: 8,
                psicodiagnostico: 2,
                avaliacao_diagnostica: 1
            },
            acontecem: {
                psicoterapia: 19,
                plantao: 2,
                psicodiagnostico: 9,
                avaliacao_diagnostica: 7
            }
        }
    };

    const handleDownloadClick = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.setFont("times", "bold");
        doc.text("Relatório de Indicadores e Desempenho da Clínica", 105, 10, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("times", "normal")
        doc.line(10, 16, 200, 16);
        doc.text("Dados gerais", 10, 20);
        doc.line(10, 22, 200, 22);

        const qntInfo = [
            { label: "Alunos", value: data.aluno },
            { label: "Professores", value: data.professor },
            { label: "Pacientes", value: data.paciente },
            { label: "Relatórios", value: data.relatorio }
        ];

        let yPosition = 28;
        doc.setFontSize(10);
        qntInfo.forEach((item) => {
            doc.setFont("times", "bold");
            doc.text(`${item.label}:`, 10, yPosition);
            doc.setFont("times", "normal");
            doc.text(String(item.value) || "Não informado", 80, yPosition);
            yPosition += 8;
        });

        yPosition += 5;
        doc.line(10, yPosition, 200, yPosition);
        yPosition += 5;


        doc.setFontSize(12);
        doc.setFont("times", "normal")
        doc.text("Detalhamento dos relatórios", 10, yPosition);
        doc.line(10, yPosition + 2, 200, yPosition + 2);

        yPosition += 10;

        const relatorioInfo = [
            { label: "Total de relatórios", value: data.relatorio },
            { label: "Relatórios com assinatura", value: data.relatorio_assinado },
            { label: "Relatórios sem assinatura", value: `${data.relatorio - data.relatorio_assinado}` },
        ];

        doc.setFontSize(10);
        relatorioInfo.forEach((item) => {
            doc.setFont("times", "bold");
            doc.text(`${item.label}:`, 10, yPosition);
            doc.setFont("times", "normal");
            doc.text(String(item.value) || "Não informado", 80, yPosition);
            yPosition += 8;
        });

        yPosition += 5;
        doc.line(10, yPosition, 200, yPosition);
        yPosition += 5;


        // Detalhamento dos atendimentos
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        doc.text(`Detalhamento dos atendimentos (${formatarData(startDate)} - ${formatarData(endDate)})`, 10, yPosition);
        doc.line(10, yPosition + 2, 200, yPosition + 2);

        const consultaInfo = [
            { status: "Pendente", count: data.consulta.pendente },
            { status: "Aluno faltou", count: data.consulta.aluno_faltou },
            { status: "Paciente faltou", count: data.consulta.paciente_faltou },
            { status: "Cancelada", count: data.consulta.cancelada },
            { status: "Concluída", count: data.consulta.concluida },
            { status: "Em andamento", count: data.consulta.andamento }
        ];

        // Gerando a primeira tabela
        const tableColumn = ["Status", "Quantidade"];
        const tableRows = consultaInfo.map((item) => [item.status, item.count]);
        yPosition += 10
        // Renderizando a tabela e atualizando yPosition
        const table1 = doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: yPosition,
            margin: { top: 10 },
            styles: { font: "times", fontSize: 10 },
            headStyles: { fillColor: [10, 10, 10], textColor: [255, 255, 255], fontStyle: "bold" },
            bodyStyles: { textColor: [0, 0, 0], fontStyle: "normal" },
        });

        // Fallback para yPosition
        yPosition = (table1.finalY || doc.lastAutoTable?.finalY || yPosition) + 10;

        // Linha separadora
        doc.line(10, yPosition, 200, yPosition);
        yPosition += 5;

        // Detalhamento dos tratamentos
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        doc.text(`Detalhamento dos tratamentos (${formatarData(startDate)} - ${formatarData(endDate)})`, 10, yPosition);
        doc.line(10, yPosition + 2, 200, yPosition + 2);

        const tratamentoInfo = [
            { tipo: "Psicoterapia", iniciaram: data.tratamento.iniciaram.psicoterapia, terminaram: data.tratamento.terminaram.psicoterapia, acontecem: data.tratamento.acontecem.psicoterapia },
            { tipo: "Plantão", iniciaram: data.tratamento.iniciaram.plantao, terminaram: data.tratamento.terminaram.plantao, acontecem: data.tratamento.acontecem.plantao },
            { tipo: "Psicodiagnóstico", iniciaram: data.tratamento.iniciaram.psicodiagnostico, terminaram: data.tratamento.terminaram.psicodiagnostico, acontecem: data.tratamento.acontecem.psicodiagnostico },
            { tipo: "Avaliação Diagnóstica", iniciaram: data.tratamento.iniciaram.avaliacao_diagnostica, terminaram: data.tratamento.terminaram.avaliacao_diagnostica, acontecem: data.tratamento.acontecem.avaliacao_diagnostica },
        ];

        // Gerando a segunda tabela
        const tableColumn2 = ["Tipo", "Iniciaram", "Terminaram", "Acontecem"];
        const tableRows2 = tratamentoInfo.map((item) => [
            item.tipo,
            item.iniciaram,
            item.terminaram,
            item.acontecem
        ]);

        let table2 = doc.autoTable({
            head: [tableColumn2],
            body: tableRows2,
            startY: yPosition + 10,
            margin: { top: 10 },
            styles: { font: "times", fontSize: 10 },
            headStyles: { fillColor: [10, 10, 10], textColor: [255, 255, 255], fontStyle: "bold" },
            bodyStyles: { textColor: [0, 0, 0], fontStyle: "normal" },
        });

        // Atualizando yPosition novamente caso precise adicionar mais conteúdo
        yPosition = (table2.finalY || doc.lastAutoTable?.finalY || yPosition) + 10;



        doc.save(`Relatorio_Indicadores_Clinica.pdf`);
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

    const TOTAL = Object.values(data.consulta).reduce((sum, value) => sum + value, 0);

    const pieData = [
        { id: 'Pendente', label: 'Pendente', value: data.consulta.pendente, color: '#EB11FF' },
        { id: 'Aluno faltou', label: 'Aluno faltou', value: data.consulta.aluno_faltou, color: '#E77DFF' },
        { id: 'Paciente faltou', label: 'Paciente faltou', value: data.consulta.paciente_faltou, color: '#BC2EDC' },
        { id: 'Cancelada', label: 'Cancelada', value: data.consulta.cancelada, color: '#710198' },
        { id: 'Concluída', label: 'Concluída', value: data.consulta.concluida, color: '#5430A9' },
        { id: 'Em andamento', label: 'Em andamento', value: data.consulta.andamento, color: '#9B68FF' },
    ];

    const getArcLabel = (params) => {
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
        changeInterval(1, '0')
    }, []);

    const desiredOrder = ["Psicoterapia", "Plantão", "Psicodiagnóstico", "Avaliação\nDiagnóstica"];

    const treatmentData = desiredOrder.map((type, index) => ({
        type,
        iniciaram: data.tratamento.iniciaram[Object.keys(data.tratamento.iniciaram)[index]],
        terminaram: data.tratamento.terminaram[Object.keys(data.tratamento.terminaram)[index]],
        acontecem: data.tratamento.acontecem[Object.keys(data.tratamento.acontecem)[index]],
    }));

    const changeInterval = (type, e) => {
        let selectedOption
        if (type == 1) {
            selectedOption = e;
        } else {
            selectedOption = e.target.value
        }
        setIntervalSetting(selectedOption);

        const today = new Date();
        let start, end;

        switch (selectedOption) {
            case '0':
                start = new Date(today);
                start.setDate(today.getDate() - 7);
                end = today;
                break;
            case '1':
                start = new Date(today);
                start.setDate(today.getDate() - 15);
                end = today;
                break;
            case '2':
                start = new Date(today);
                start.setMonth(today.getMonth() - 1);
                end = today;
                break;
            case '3':
                start = new Date(today);
                start.setMonth(today.getMonth() - 6);
                end = today;
                break;
            case '4':
                start = new Date('2000-01-01');
                end = today;
                break;
            default:
                start = end = today;
                break;
        }

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
    };

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };


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
                            <button className="export-button" onClick={handleDownloadClick}>Exportar<img src={Download} /></button>
                        </div>
                        <div className="atendimentos-report">
                            <select value={intervalSetting} onChange={(e) => changeInterval(0, e)}>
                                <option value={'0'}>Última semana</option>
                                <option value={'1'}>Últimos 15 dias</option>
                                <option value={'2'}>Último mês</option>
                                <option value={'3'}>Últimos 6 meses</option>
                                <option value={'4'}>Para sempre</option>
                            </select>
                            <div className="pie-chart-container">
                                <h2>Atendimentos: ({formatarData(startDate)} - {formatarData(endDate)})</h2>
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
                                        }

                                    }}
                                    width={500}
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
                            <div className="div-flex">
                                <h2>Tratamentos na Clínica: ({formatarData(startDate)} - {formatarData(endDate)})</h2>
                                <BarChart
                                    dataset={treatmentData}
                                    series={[
                                        {
                                            dataKey: 'iniciaram',
                                            stack: 'Tratamentos',
                                            label: 'Iniciaram',
                                        },
                                        {
                                            dataKey: 'terminaram',
                                            stack: 'Tratamentos',
                                            label: 'Terminaram',
                                        },
                                        {
                                            dataKey: 'acontecem',
                                            stack: 'Tratamentos',
                                            label: 'Em andamento',
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            scaleType: 'band',
                                            dataKey: 'type',
                                            tickLabelStyle: { fontSize: 19, fontWeight: 700 },
                                        }
                                    ]}
                                    yAxis={[
                                        {
                                            tickLabelStyle: { fontSize: 19, fontWeight: 700 },
                                        }
                                    ]}
                                    slotProps={{
                                        legend: {
                                            position: { vertical: 'bottom', horizontal: 'middle' },
                                            fontSize: 20,
                                        }
                                    }}
                                    margin={{ bottom: 120 }}
                                    width={750}
                                    height={400}
                                />


                            </div>
                        </div>
                        <div className="relatorio-report">
                            <div className="div-flex">
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
                            <div className="div-flex">
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
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
