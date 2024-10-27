import React, { useState, useEffect } from "react";
import { api } from "../../services/server";
import SideBar from "../../components/SideBar/sidebar";
import voltar from "../../assets/voltar.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { startOfMonth, endOfMonth, subDays, addDays, addMonths } from 'date-fns';

import CadastrarConsulta from "../../components/cadastrar/consulta";
import EditarConsulta from "../../components/editar/consulta";

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
});

const messages = {
    allDay: 'Dia Inteiro',
    previous: '<',
    next: '>',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    showMore: (total) => `+ ${total} Eventos`,
    noEventsInRange: 'Nenhum evento encontrado neste período.',
};

let formats = {
    agendaHeaderFormat: ({ start, end }, culture, localizer) =>
        `${localizer.format(start, 'd MMMM, yyyy', culture)} — ${localizer.format(end, 'd MMMM, yyyy', culture)}`,

    agendaDateFormat: (date, culture, localizer) =>
        localizer.format(date, 'dd/MM/yyyy', culture),

    agendaTimeFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, 'HH:mm', culture) + ' - ' +
        localizer.format(end, 'HH:mm', culture),

    agendaEventFormat: (event) =>
        `Paciente: ${event.paciente || ''}, Estudante: ${event.estudante || ''}, 
      Sala: ${event.sala || ''}, Status: ${event.status || 'Agendado'}`,
};

export default function Agenda() {
    const [seePopup, setSeePopup] = useState('');
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('month');
    const [events, setEvents] = useState([]);
    const [userLevel, setUserLevel] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const onSelectEventHandler = (event) => {
        console.log(event);
        setSeePopup(event);
    };

    const handleOpenDialog = (slot) => {
        console.log("Slot selecionado:", slot);
    };

    const handleOpenEvent = (event) => {
        setSeePopup(event);
        console.log("Evento selecionado:", event);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleEditarConsulta = () => {
        console.log(seePopup);
        setIsEditarOpen(true);
    }

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const renderProps = (codigo) => {
        setRenderFormTable(codigo);
    }

    const buscarConsultas = async () => {
        const token = localStorage.getItem("user_token");

        try {
            const startFormatted = startDate.toISOString().split('T')[0];
            const endFormatted = endDate.toISOString().split('T')[0];

            const consultas = await api.get(`/consulta?start=${startFormatted}&end=${endFormatted}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`,
                }
            });

            const formattedConsultas = consultas.data.consultas.map((consulta) => ({
                ...consulta,
                start: new Date(consulta.start),
                end: new Date(consulta.end),
            }));

            setEvents(formattedConsultas);
        } catch (e) {
            console.log("Erro ao buscar consultas: ", e);
        }
    };



    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
        buscarConsultas();
    }, [startDate, endDate]);

    const renderDadosConsulta = (dadosAtualizados) => {
        setEvents((prevDados) => {
            return {
                ...prevDados.map((consulta) =>
                    consulta._id === dadosAtualizados._id ? dadosAtualizados : consulta
                ),
            };
        });
    };

    const handleEditarClose = () => {
        setIsEditarOpen(false);
    };

    const handleNavigate = (date, view) => {
        let newStartDate;
        let newEndDate;

        if (view === 'month') {
            newStartDate = startOfMonth(date);
            newEndDate = endOfMonth(date);
        } else if (view === 'week') {
            newStartDate = subDays(date, 7);
            newEndDate = addDays(date, 7);
        } else if (view === 'agenda') {
            newStartDate = startOfMonth(date);
            newEndDate = endOfMonth(addMonths(date, 1));
        }

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        console.log(date, view);
        console.log(newStartDate, newEndDate);
        buscarConsultas();
    };



    return (
        <>
            <SideBar />
            <div className="body_admin">
                <h1 className="h1">Agenda</h1>
                <div className={(userLevel === '2' || userLevel === '3') ? "barra_pesquisa-visualizar" : "barra_pesquisa"}>
                    {(userLevel === '0' || userLevel === '1') && (
                        <button className="button_cadastro" onClick={handleNovoCadastroClick} >
                            <IoMdPersonAdd className="icon_cadastro" />
                            Nova Consulta
                        </button>
                    )}
                </div>
                <div className="" style={{ minHeight: 580 }}>
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        messages={messages}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        views={['month', 'week', 'agenda']}
                        step={120}
                        formats={formats}
                        culture="pt-BR"
                        showMultiDayTimes
                        defaultDate={new Date(2024, 9, 7)}
                        style={{ minHeight: 690, borderRadius: '8px' }}
                        eventPropGetter={(event) => {
                            const backgroundColor = currentView !== 'agenda' ? 'rgb(226 189 239)' : 'transparent';
                            return {
                                style: {
                                    backgroundColor,
                                    borderRadius: '8px',
                                    minHeight: '10px',
                                },
                            };
                        }}
                        onSelectSlot={(slot) => handleOpenDialog(slot)}
                        onSelectEvent={(event) => handleOpenEvent(event)}
                        onView={handleViewChange}
                        onNavigate={handleNavigate}
                        components={{
                            event: ({ event }) => (
                                <div>
                                    {currentView === 'month' ? (
                                        <p>{event.nomePaciente}</p>
                                    ) : currentView == 'week' ? (
                                        event.allDay ? (
                                            <p>
                                                {event.nomePaciente}
                                                <br />
                                                <span> {event.Nome} </span>
                                                <span>
                                                    <br /> Sala {event.sala}
                                                </span>
                                            </p>
                                        ) : (
                                            <p>
                                                {event.nomePaciente}
                                            </p>
                                        )
                                    ) : (
                                        <div>
                                            <p><span>Paciente:</span> {event.nomePaciente || ''}</p>
                                            <p><span>Estudante:</span> {event.nomeAluno || ''}</p>
                                            <p><span>Sala:</span> {event.sala || ''}</p>
                                            <p><span>Status:</span> {event.statusDaConsulta || 'Agendado'}</p>
                                        </div>

                                    )
                                    }
                                </div>
                            ),
                        }}
                    />
                    {seePopup && (
                        <div className="popUpAgendaContainer">
                            <div className="popUpBody">
                                <div className="popUpHeader">
                                    <span>Detalhes da Consulta</span>
                                    <button onClick={() => setSeePopup('')} className="btn_close">
                                        <img src={voltar} alt="Voltar" />
                                    </button>
                                </div>
                                <div className="dados-consulta">
                                    <p><strong>Nome do Paciente:</strong> {seePopup.nomePaciente || ''}</p>
                                    <p><strong>Estudante:</strong> {seePopup.nomeAluno || ''}</p>
                                    <p><strong>Data da Consulta:</strong> {moment(seePopup.start).format("DD/MM/YYYY")}</p>
                                    <p><strong>Hora:</strong> {moment(seePopup.start).format("HH:mm")}</p>
                                    <p><strong>Sala:</strong> {seePopup.sala || ''}</p>
                                    <p><strong>Status:</strong> {seePopup.status || ''}</p>
                                </div>
                                <button onClick={handleEditarConsulta}>Editar</button>
                            </div>
                        </div>
                    )}
                    {isCadastroOpen && (
                        <CadastrarConsulta handleClose={handleCloseModal} setRenderFormTable={renderProps} />
                    )}
                    {isEditarOpen && (
                        <EditarConsulta
                            handleClose={handleEditarClose}
                            dados={seePopup}
                            renderDadosConsulta={renderDadosConsulta}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
