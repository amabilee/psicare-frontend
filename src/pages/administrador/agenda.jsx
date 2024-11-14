import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../services/server";
import SideBar from "../../components/SideBar/sidebar";
import voltar from "../../assets/voltar.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { UseAuth } from '../../hooks';
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
    const { signOut } = UseAuth();
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
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    const handleEditarConsulta = () => {
        setIsEditarOpen(true);
    }

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const renderProps = () => {
        handleNavigate(startDate, 'month', 'render');
    }

    useEffect(() => {
        const level = localStorage.getItem('user_level');
        setUserLevel(level);
        const currentDate = parseISO(new Date().toISOString().split('T')[0]);
        handleNavigate(currentDate, 'month');
    }, []);


    const renderDadosConsulta = (dadosAtualizados) => {
        setEvents((prevDados) =>
            prevDados.map((consulta) =>
                consulta._id === dadosAtualizados._id ? {
                    ...dadosAtualizados,
                    start: new Date(dadosAtualizados.start),
                    end: new Date(dadosAtualizados.end),
                } : consulta
            )
        );
        setSeePopup(dadosAtualizados);
    };

    const handleEditarClose = () => {
        setIsEditarOpen(false);
    };

    const handleNavigate = (date) => {
        let newStartDate = startOfMonth(date);
        let newEndDate = endOfMonth(date);
        newStartDate = subDays(newStartDate, 7);
        newEndDate = addDays(newEndDate, 7);

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        buscarConsultas(newStartDate, newEndDate);
    };

    const buscarConsultas = async (start, end) => {
        const token = localStorage.getItem("user_token");

        try {
            let startFormatted = start.toISOString().split('T')[0];
            let endFormatted = end.toISOString().split('T')[0];

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
            if (e.response.status === 401) {
                signOut();
            } else {
                console.log("Erro ao buscar consultas: ", e);
            }
        }
    };

    const handleShowMore = useCallback((events, date) => {
        setCurrentView('week');
        handleNavigate(date);
    }, []);

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
                        view={currentView}
                        defaultDate={new Date()}
                        style={{ minHeight: 690, borderRadius: '8px' }}
                        eventPropGetter={(event) => {
                            const backgroundColor = currentView === 'agenda' ? 'transparent' :
                                event.statusDaConsulta === 'Pendente' ? '#FFDBA0' :
                                    event.statusDaConsulta === 'Concluída' ? '#B3FFA0' :
                                        event.statusDaConsulta === 'Cancelada' || event.statusDaConsulta === 'Paciente faltou' || event.statusDaConsulta === 'Aluno faltou ' ? '#FFA0A0' :
                                            event.statusDaConsulta === 'Em andamento' ? '#92D9FF' :
                                                'rgb(226 189 239)'

                            return {
                                style: {
                                    border: '1px solid #EDEDED',
                                    backgroundColor,
                                    borderRadius: '4px',
                                    minHeight: '10px',
                                },
                            };
                        }}
                        onSelectSlot={(slot) => handleOpenDialog(slot)}
                        onSelectEvent={(event) => handleOpenEvent(event)}
                        onView={handleViewChange}
                        onNavigate={handleNavigate}
                        onShowMore={handleShowMore}
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
                                <div className="popUpTop">
                                    <div className="header-visualizar-info">
                                        <img src={voltar} alt="seta-voltar" className="seta-voltar" onClick={() => setSeePopup('')} />
                                        <h1 onClick={() => setSeePopup('')}>Informações do agendamento</h1>
                                    </div>
                                    <div
                                        className={
                                            seePopup.statusDaConsulta === 'Pendente' ? 'background-consulta-pendente' :
                                                seePopup.statusDaConsulta === 'Concluída' ? 'background-consulta-concluida' :
                                                    seePopup.statusDaConsulta === 'Cancelada' || seePopup.statusDaConsulta === 'Paciente faltou' || seePopup.statusDaConsulta === 'Aluno faltou' ? 'background-consulta-cancelada' :
                                                        seePopup.statusDaConsulta === 'Em andamento' ? 'background-consulta-andamento' :
                                                            ''
                                        }
                                    >
                                        <p>
                                            {seePopup.statusDaConsulta}
                                        </p>
                                    </div>
                                </div>
                                <div className="popUpContent">
                                    <div className="linha">
                                        <div>
                                            <p>Título da consulta</p>
                                            <h1>{seePopup.Nome}</h1>
                                        </div>
                                        <div>
                                            <p>Responsável</p>
                                            <h1>{seePopup.nomeAluno}</h1>
                                        </div>
                                        <div>
                                            <p>Tipo da consulta</p>
                                            <h1>{seePopup.TipoDeConsulta}</h1>
                                        </div>
                                    </div>
                                    <div className="linha">
                                        <div>
                                            <p>Paciente</p>
                                            <h1>{seePopup.nomePaciente}</h1>
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
                                            <h1>{moment(seePopup.createAt).format('DD/MM/YYYY')}</h1>
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
                                        {(userLevel === '0' || userLevel === '1') && (
                                            <div>
                                                <button onClick={handleEditarConsulta}>Editar</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isCadastroOpen && (
                        <CadastrarConsulta handleCloseModal={handleCloseModal} renderTable={renderProps} />
                    )}
                    {isEditarOpen && (
                        <EditarConsulta
                            handleEditarClose={handleEditarClose}
                            dadosConsulta={seePopup}
                            renderDadosConsulta={renderDadosConsulta}
                        />
                    )}
                </div>
            </div >
        </>
    );
}
