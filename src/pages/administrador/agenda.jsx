import React, { useState } from "react";
import SideBar from "../../components/SideBar/sidebar";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
    showMore: (total) => `+ (${total}) Eventos`,
};

export default function Agenda() {
    const [seePopup, setSeePopup] = useState('');
    const [currentView, setCurrentView] = useState('month');
    const [events, setEvents] = useState([
        {
            id: 0,
            nome: "Dor de cabeça",
            paciente: "Lucas Souza Santos",
            observacao: "Paciente não gosta de barulhos altos",
            sala: "H101",
            allDay: false,
            start: new Date(2024, 9, 7, 14, 30, 0),
            end: new Date(2024, 9, 7, 15, 30, 0),
        },
        {
            id: 1,
            nome: "Dor de barriga",
            paciente: "Marília Castro Neves",
            observacao: "Paciente não gosta de barulhos altos",
            sala: "H101",
            allDay: true,
            start: new Date(2024, 9, 8),
            end: new Date(2024, 9, 8),
        },
        {
            id: 2,
            nome: "Ansiedade",
            paciente: "Maria Fernanda",
            observacao: "Paciente tem dificuldade para relaxar.",
            sala: "H102",
            allDay: false,
            start: new Date(2024, 9, 8, 10, 0, 0),
            end: new Date(2024, 9, 8, 11, 0, 0),
        },
        {
            id: 3,
            nome: "Depressão",
            paciente: "Carlos Almeida",
            observacao: "Paciente está se sentindo isolado.",
            sala: "H103",
            allDay: false,
            start: new Date(2024, 9, 9, 16, 0, 0),
            end: new Date(2024, 9, 9, 17, 0, 0),
        },
        {
            id: 4,
            nome: "Estresse",
            paciente: "Ana Clara",
            observacao: "Paciente reporta dificuldades no trabalho.",
            sala: "H104",
            allDay: false,
            start: new Date(2024, 9, 10, 9, 30, 0),
            end: new Date(2024, 9, 10, 10, 30, 0),
        },
        {
            id: 5,
            nome: "Terapia de Casal",
            paciente: "Juliano e Fernanda",
            observacao: "Casal está passando por dificuldades de comunicação.",
            sala: "H105",
            allDay: false,
            start: new Date(2024, 9, 11, 15, 0, 0),
            end: new Date(2024, 9, 11, 16, 0, 0),
        },
        {
            id: 6,
            nome: "Autoconhecimento",
            paciente: "Bruno Costa",
            observacao: "Paciente quer explorar suas emoções.",
            sala: "H106",
            allDay: false,
            start: new Date(2024, 9, 12, 11, 0, 0),
            end: new Date(2024, 9, 12, 12, 0, 0),
        },
        {
            id: 7,
            nome: "Fobias",
            paciente: "Mariana Lima",
            observacao: "Paciente tem medo de lugares fechados.",
            sala: "H107",
            allDay: false,
            start: new Date(2024, 9, 13, 13, 30, 0),
            end: new Date(2024, 9, 13, 14, 30, 0),
        },
        {
            id: 8,
            nome: "Transtorno Obsessivo-Compulsivo",
            paciente: "Ricardo Mendes",
            observacao: "Paciente apresenta rituais diários.",
            sala: "H108",
            allDay: false,
            start: new Date(2024, 9, 14, 9, 0, 0),
            end: new Date(2024, 9, 14, 10, 0, 0),
        },
        {
            id: 9,
            nome: "Luto",
            paciente: "Sofia Ribeiro",
            observacao: "Paciente está lidando com a perda de um familiar.",
            sala: "H109",
            allDay: false,
            start: new Date(2024, 9, 15, 14, 0, 0),
            end: new Date(2024, 9, 15, 15, 0, 0),
        },
        {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 10, 30, 0),
            end: new Date(2024, 9, 16, 11, 30, 0),
        }
    ]);

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

    return (
        <>
            <SideBar />
            <div className="body_admin">
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
                        culture="pt-BR"
                        showMultiDayTimes
                        defaultDate={new Date(2024, 9, 7)}
                        style={{ minHeight: 690, borderRadius: '8px' }}
                        eventPropGetter={(event) => {
                            const backgroundColor = currentView !== 'agenda' ? '#E4CDED' : 'transparent';
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
                        components={{
                            event: ({ event }) => (
                                <div>
                                    {currentView === 'month' ? (
                                        <p>{event.paciente}</p>
                                    ) : event.allDay ? (
                                        <p>
                                            {event.paciente}
                                            <span> ({event.nome}) </span>
                                            <span>
                                                - {moment(event.start).format('h:mm')} - {moment(event.end).format('h:mm')} - {event.sala}
                                            </span>
                                        </p>
                                    ) : (
                                        <p>
                                            {event.paciente}
                                            <span> ({event.nome}) </span>
                                            <span>
                                                - {moment(event.start).format('h:mm')} - {moment(event.end).format('h:mm')} - </span>
                                            Sala {event.sala}
                                        </p>
                                    )}
                                </div>
                            ),
                        }}
                    />
                    {seePopup && (
                        <div className="popUpAgendaContainer">
                            <div className="popUpBody">
                                <div className="popUpTop">
                                    <p>{seePopup.nome}</p>
                                    <p onClick={() => setSeePopup('')}>Sair</p>
                                </div>
                                <div className="popUpContent">
                                    <p>Descrição da consulta</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}