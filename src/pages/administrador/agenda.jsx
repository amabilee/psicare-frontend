import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../services/server";
import SideBar from "../../components/SideBar/sidebar";
import voltar from "../../assets/voltar.svg";
import { IoMdPersonAdd } from "react-icons/io";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMonths, subMonths, parseISO } from "date-fns";
import { UseAuth } from "../../hooks";
import moment from "moment";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
    startOfMonth,
    endOfMonth,
    subDays,
    addDays,
} from "date-fns";

import CadastrarConsulta from "../../components/cadastrar/consulta";
import EditarConsulta from "../../components/editar/consulta";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
});

const messages = {
    allDay: "Dia Inteiro",
    previous: "<",
    next: ">",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    showMore: (total) => `+ ${total} Eventos`,
    noEventsInRange: "Nenhum evento encontrado neste período.",
};

const formats = {
    agendaHeaderFormat: ({ start, end }, culture, localizer) =>
        `${localizer.format(start, "d MMMM, yyyy", culture)} — ${localizer.format(
            end,
            "d MMMM, yyyy",
            culture
        )}`,

    agendaDateFormat: (date, culture, localizer) =>
        localizer.format(date, "dd/MM/yyyy", culture),

    agendaTimeFormat: ({ start, end }, culture, localizer) => {
        const validStart = typeof start === "string" ? parseISO(start) : start;
        const validEnd = typeof end === "string" ? parseISO(end) : end;

        if (!(validStart instanceof Date && !isNaN(validStart)) ||
            !(validEnd instanceof Date && !isNaN(validEnd))) {
            console.error("Start or End is not a valid Date:", { start, end });
            return "Horário inválido";
        }

        return `${localizer.format(validStart, "HH:mm", culture)} - ${localizer.format(
            validEnd,
            "HH:mm",
            culture
        )}`;
    },

    agendaEventFormat: (event) =>
        `Paciente: ${event.paciente || ""}, Estudante: ${event.estudante || ""
        }, Sala: ${event.sala || ""}, Status: ${event.status || "Agendado"}`,
};

export default function Agenda() {
    const { signOut } = UseAuth();
    const [seePopup, setSeePopup] = useState("");
    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [currentView, setCurrentView] = useState("month");
    const [events, setEvents] = useState([]);
    const [userLevel, setUserLevel] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const onSelectEventHandler = (event) => {
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
        handleNavigate('agenda')
    };

    const handleEditarConsulta = () => {
        setIsEditarOpen(true);
    };

    const handleNovoCadastroClick = () => {
        setIsCadastroOpen(true);
    };

    const handleCloseModal = () => {
        setIsCadastroOpen(false);
    };

    const renderDadosConsulta = (dadosAtualizados) => {
        setEvents((prevDados) =>
            prevDados.map((consulta) =>
                consulta._id === dadosAtualizados._id
                    ? {
                        ...dadosAtualizados,
                        start: new Date(dadosAtualizados.start),
                        end: new Date(dadosAtualizados.end),
                    }
                    : consulta
            )
        );
        setSeePopup(dadosAtualizados);
    };

    const handleEditarClose = () => {
        setIsEditarOpen(false);
        handleNavigate(startDate, currentView)
    };

    const handleNavigate = (date, view = currentView) => {

        const parsedDate = typeof date === "string" ? parseISO(date) : date;

        let newStartDate, newEndDate;

        if (view === "month" || view === "agenda") {
            newStartDate = subDays(startOfMonth(parsedDate), 7);
            newEndDate = addDays(endOfMonth(parsedDate), 7);
        } else if (view === "week") {
            newStartDate = startOfWeek(parsedDate);
            newEndDate = addDays(newStartDate, 6);
        } else {
            newStartDate = subDays(parsedDate, 7);
            newEndDate = addDays(parsedDate, 7);
        }

        newStartDate = typeof newStartDate === "string" ? parseISO(newStartDate) : newStartDate;
        newEndDate = typeof newEndDate === "string" ? parseISO(newEndDate) : newEndDate;

        // console.log(newStartDate, newEndDate);

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        buscarConsultas(newStartDate, newEndDate);
    };

    const buscarConsultas = async (start, end) => {
        const token = localStorage.getItem("user_token");
        // console.log("start:", start);
        // console.log("end:", end);

        try {
            let startDateSetting = typeof start === "string" ? parseISO(start) : start;
            let endDateSetting = typeof end === "string" ? parseISO(end) : end;

            if (String(start).length <= 20 && String(end).length <= 20) {
                if (startDate) {
                    startDateSetting = subDays(startOfMonth(startDate), 7);
                    // console.log("Usando startDate como base para start");
                }

                if (endDate) {
                    endDateSetting = addDays(endOfMonth(endDate), 7);
                    // console.log("Usando endDate como base para end");
                }
            } else {
                if (String(start).length <= 20) {
                    startDateSetting = subDays(startOfMonth(endDateSetting), 7);
                    // console.log("Calculando start com base em end");
                }

                if (String(end).length <= 20) {
                    endDateSetting = addDays(endOfMonth(addMonths(startDateSetting, 1)), 7);
                    // console.log("Calculando end com base em start");
                }
            }

            // console.log("startDateSetting:", startDateSetting);
            // console.log("endDateSetting:", endDateSetting);

            const startFormatted = startDateSetting?.toISOString().split("T")[0];
            const endFormatted = endDateSetting?.toISOString().split("T")[0];

            // console.log("startFormatted:", startFormatted);
            // console.log("endFormatted:", endFormatted);

            const response = await api.get(
                `/consulta?start=${startFormatted}&end=${endFormatted}`,
                { headers: { authorization: `Bearer ${token}` } }
            );

            const formattedConsultas = response.data.consultas
                .map((consulta) => ({
                    ...consulta,
                    start: new Date(consulta.start),
                    end: new Date(consulta.end),
                }))
                .filter(Boolean);

            setEvents(formattedConsultas);
        } catch (e) {
            if (e.response?.status === 401) {
                signOut();
            } else {
                console.error("Erro ao buscar consultas:", e);
            }
        }
    };


    const handleShowMore = useCallback((events, date) => {
        setCurrentView("week");
        handleNavigate(date, "week");
    }, []);


    const renderProps = () => {
        buscarConsultas(startDate, endDate);
    }


    useEffect(() => {
        const level = localStorage.getItem("user_level");
        setUserLevel(level);
        handleNavigate(new Date(), "month");
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
                        // defaultDate={new Date()}
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
                        onNavigate={(date) => {
                            // if (this.state.currentView === 'agenda') {
                            //     this.setState({ selectedDate: startOfMonth(date) });
                            // }
                            handleNavigate(date);
                        }}

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
