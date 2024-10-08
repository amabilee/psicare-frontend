import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/sidebar";
import voltar from "../../assets/voltar.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

import CadastrarConsulta from "../../components/cadastrar/consulta";

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
        localizer.format(start, 'd MMMM, yyyy', culture) + ' — ' +
        localizer.format(end, 'd MMMM, yyyy', culture),

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
    const [currentView, setCurrentView] = useState('month');
    const [events, setEvents] = useState([
        {
            id: 0,
            nome: "Dor de cabeça",
            paciente: "Lucas Souza Santos",
            estudante: "Estudante 1",
            sala: "H101",
            status: "Pendente",
            tipo: 'Individual',
            intervalo: 'Sessão única',
            observacao: 'Paciente não gosta de barulhos altos, Paciente não gosta de barulhos altos',
            allDay: false,
            start: new Date(2024, 9, 7, 14, 30, 0),
            end: new Date(2024, 9, 7, 15, 30, 0),
        },
        {
            id: 1,
            nome: "Dor de barriga",
            paciente: "Marília Castro Neves",
            estudante: "Estudante 2",
            sala: "H102",
            status: "Concluída",
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
            paciente: "Fernanda Castro Neves",
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
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 11, 30, 0),
            end: new Date(2024, 9, 16, 12, 30, 0),
        },
        {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 12, 35, 0),
            end: new Date(2024, 9, 16, 13, 30, 0),
        }, {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 13, 35, 0),
            end: new Date(2024, 9, 16, 14, 30, 0),
        },
        {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 14, 35, 0),
            end: new Date(2024, 9, 16, 15, 30, 0),
        }, {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 15, 35, 0),
            end: new Date(2024, 9, 16, 16, 30, 0),
        }
        , {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 16, 35, 0),
            end: new Date(2024, 9, 16, 17, 30, 0),
        }
        , {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 17, 35, 0),
            end: new Date(2024, 9, 16, 18, 30, 0),
        },
        {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 19, 35, 0),
            end: new Date(2024, 9, 16, 20, 30, 0),
        },
        {
            id: 10,
            nome: "Desenvolvimento Pessoal",
            paciente: "Gabriel Martins Neves",
            observacao: "Paciente quer trabalhar em suas habilidades sociais.",
            sala: "H110",
            allDay: false,
            start: new Date(2024, 9, 16, 21, 35, 0),
            end: new Date(2024, 9, 16, 22, 30, 0),
        }
    ]);

    const [userLevel, setUserLevel] = useState(null);

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
    }, []);

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
        console.log(seePopup)
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
                        components={{
                            event: ({ event }) => (
                                <div>
                                    {currentView === 'month' ? (
                                        <p>{event.paciente}</p>
                                    ) : currentView == 'week' ? (
                                        event.allDay ? (
                                            <p>
                                                {event.paciente}
                                                <br />
                                                <span> {event.nome} </span>
                                                <span>
                                                    <br /> Sala {event.sala}
                                                </span>
                                            </p>
                                        ) : (
                                            <p>
                                                {event.paciente}
                                            </p>
                                        )
                                    ) : (
                                        <p>
                                            <p><span>Paciente:</span> {event.paciente || ''}</p>
                                            <p><span>Estudante:</span> {event.estudante || ''}</p>
                                            <p><span>Sala:</span> {event.sala || ''}</p>
                                            <p><span>Status:</span> {event.status || 'Agendado'}</p>
                                        </p>
                                    )
                                    }
                                </div>
                            ),
                        }}
                    />
                    {seePopup && (
                        <div className="popUpAgendaContainer">
                            <div className="popUpBody">
                                <div className="popUpTop">
                                    <div className="header-visualizar-info">
                                        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={() => setSeePopup('')} />
                                        <h1 onClick={() => setSeePopup('')}>Informações do agendamento</h1>
                                    </div>
                                    <div
                                        className={
                                            seePopup.status === 'Pendente' ? 'background-consulta-pendente' :
                                                seePopup.status === 'Concluída' ? 'background-consulta-concluida' :
                                                    ''
                                        }
                                    >
                                        <p>
                                            {seePopup.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="popUpContent">
                                    <div className="linha">
                                        <div>
                                            <p>Título da consulta</p>
                                            <h1>{seePopup.nome}</h1>
                                        </div>
                                        <div>
                                            <p>Responsável</p>
                                            <h1>{seePopup.estudante}</h1>
                                        </div>
                                        <div>
                                            <p>Tipo da consulta</p>
                                            <h1>{seePopup.tipo}</h1>
                                        </div>
                                    </div>
                                    <div className="linha">
                                        <div>
                                            <p>Paciente</p>
                                            <h1>{seePopup.paciente}</h1>
                                        </div>
                                        <div>
                                            <p>Local</p>
                                            <h1>{seePopup.sala}</h1>
                                        </div>
                                        <div>
                                            <p>Intervalo</p>
                                            <h1>{seePopup.intervalo}</h1>
                                        </div>
                                    </div>
                                    <div className="linha">
                                        <div>
                                            <p>Data da consulta</p>
                                            <h1>{moment(seePopup.start).format('DD/MM/YYYY')}</h1>
                                        </div>
                                        <div>
                                            <p>Intervalo de tempo</p>
                                            <h1>{moment(seePopup.start).format('HH:mm')} - {moment(seePopup.end).format('HH:mm')}</h1>
                                        </div>
                                        <div>
                                            <p>Observação</p>
                                            <h1>{seePopup.observacao}</h1>
                                        </div>
                                    </div>
                                    <div className="linha">
                                        <div>
                                            <button onClick={handleEditarConsulta}>Editar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isCadastroOpen && (<CadastrarConsulta handleCloseModal={handleCloseModal} renderForm={renderProps} />)}
                </div>
            </div>
        </>
    );
}