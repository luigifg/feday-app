import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import EventItem from "../Components/Schedule/EventItems";
import HeaderEvents from "../Components/HeaderEvents";
import { horariosEvento, events } from "../data/EventsData";
import api from "../Axios";
import { navigationEvents } from "../constants/index";
import "../index.css";
import Section from "../Components/Section";
import Footer from "../Components/Footer";

const EventosList = () => {
  const [eventList] = useState(events);
  const [expandedHours, setExpandedHours] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [stagedEvents, setStagedEvents] = useState({});
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/me");
        if (response.status === 200) {
          setUserData(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/signin");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (userData?.id) {
        try {
          const participationsResponse = await api.get(`/participation`, {
            params: {
              userId: userData.id,
            },
          });
          const currentEvents = {};
          participationsResponse.data.data.forEach((participation) => {
            const eventDetails = events.find(
              (e) => e.id === participation.eventId
            );
            currentEvents[participation.scheduleId] = {
              id: participation.id,
              eventId: participation.eventId,
              hour: participation.scheduleId,
              title: participation.title,
              palestrante: participation.speaker,
              room: participation.room,
              dbId: participation.id,
              description: eventDetails.description,
              image: eventDetails?.image || "",
              companyLogo: eventDetails?.companyLogo || "",
            };
          });

          setSelectedEvents(currentEvents);
          setStagedEvents(currentEvents);
        } catch (error) {
          console.error("Erro ao carregar eventos do usuário:", error);
        }
      }
    };

    fetchUserEvents();
  }, [userData?.id]);

  const toggleDropdown = (hour) => {
    setExpandedHours((prev) => ({
      ...prev,
      [hour]: !prev[hour],
    }));
  };

  const getEventsByHour = (hour) => {
    return eventList.filter((event) => event.hour === hour);
  };

  const toggleEventSelection = (event) => {
    setStagedEvents((prev) => {
      const newStagedEvents = { ...prev };
      const currentEvent = prev[event.hour];

      // Se o evento já existe nos eventos selecionados
      if (currentEvent) {
        console.log("Marcando para deleção:", currentEvent.dbId); // Log mantido
        // Apenas marcamos para deleção, mas mantemos o evento visível
        setPendingDeletions(
          (prevDeletions) => new Set([...prevDeletions, currentEvent.dbId])
        );

        // Adicionamos a hora às mudanças pendentes
        setPendingChanges((prev) => new Set([...prev, event.hour]));

        return newStagedEvents;
      } else {
        // Adicionando novo evento
        const eventDetails = events.find((e) => e.id === event.id);
        newStagedEvents[event.hour] = {
          ...event,
          image: eventDetails?.image || "",
          companyLogo: eventDetails?.companyLogo || "",
        };
        setPendingChanges((prev) => new Set([...prev, event.hour]));
        return newStagedEvents;
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Handle deletions
      for (const dbId of pendingDeletions) {
        try {
          await api.delete(`/participation/${dbId}`);
        } catch (deleteError) {
          console.error("Erro ao deletar item:", dbId, deleteError);
          throw deleteError;
        }
      }

      // Handle new creations
      for (const hour of pendingChanges) {
        const stagedEvent = stagedEvents[hour];
        if (stagedEvent && !stagedEvent.dbId) {
          const participationData = {
            userId: userData.id,
            scheduleId: stagedEvent.hour,
            eventId: stagedEvent.id,
            title: stagedEvent.title,
            speaker: stagedEvent.palestrante,
            room: stagedEvent.room,
          };

          await api.post("/participation", participationData);
        }
      }

      // Refresh the events list
      const participationsResponse = await api.get(`/participation`);
      const currentEvents = {};
      participationsResponse.data.data.forEach((participation) => {
        const eventDetails = events.find((e) => e.id === participation.eventId);

        currentEvents[participation.scheduleId] = {
          id: participation.id,
          eventId: participation.eventId,
          hour: participation.scheduleId,
          title: participation.title,
          palestrante: participation.speaker,
          room: participation.room,
          dbId: participation.id,
          description: eventDetails.description,
          image: eventDetails?.image || "",
          companyLogo: eventDetails?.companyLogo || "",
        };
      });

      setSelectedEvents(currentEvents);
      setStagedEvents(currentEvents);
      setPendingDeletions(new Set());
      setPendingChanges(new Set());

      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações. Por favor, tente novamente.");
    }
  };

  const handleCancelChanges = () => {
    setStagedEvents(selectedEvents);
    setPendingDeletions(new Set());
    setPendingChanges(new Set());
  };

  const isEventModified = (hour) => {
    return pendingChanges.has(hour);
  };

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }
  // Função para criar o formato vCard
  const generateVCardData = (user) => {
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${user.name}`,
      `EMAIL:${user.email}`,
      `TEL:${user.phone || ""}`,
      `ORG:${user.company || ""}`,
      "END:VCARD",
    ].join("\n");

    return vCard;
  };

  return (
    <div className="pt-[2.75rem] relative bg-gray-50">
      <HeaderEvents navigation={navigationEvents} />

      <Section
      showVerticalLines={false}
      className="px-[4rem] md:px-[8rem] pt-[3rem] bg-gradient-to-r from-green-400 to-blue-500"
      customPaddings
      id="qrcode"
    >
      {/* Gradient Wrapper */}
      <div className="flex py-8 flex-col md:flex-row items-center justify-between">
        {/* Welcome Message */}
        <div className="text-white mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {userData?.name || "Participante"}!
          </h1>
          <p className="text-lg opacity-90">
            Prepare-se para o Future Day. Explore a programação e escolha seus
            eventos.
          </p>
          <p className="text-lg opacity-90 mt-10 underline">
          Ao lado você encontra o seu QRcode para trocar conexões na feira e
          fazer seu check-in nas salas
          </p>
        </div>

        {/* User QR Code and Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          {userData && (
            <>
              <QRCode
                value={generateVCardData({
                  name: userData.name,
                  email: userData.email,
                  phone: userData.phone,
                  company: userData.company,
                })}
                size={200}
                level={"H"}
                className="mx-auto mb-4"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-600">{userData.position}</p>
                <p className="text-gray-600">{userData.company}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Section>

      <Section
        className="px-[1rem] md:px-[8rem] pt-[3rem] pb-[4rem]"
        crosses
        customPaddings
        id="eventos"
      >
        <h1
          className="text-4xl font-extrabold text-center mb-10 text-gray-800"
          style={{
            background: "linear-gradient(to right, #A8E6CF, #56B87B, #8FC93A)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Eventos Selecionados
        </h1>

        {Object.keys(stagedEvents).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {Object.entries(stagedEvents).map(([hour, event]) => {
                const hourLabel =
                  horariosEvento.find((h) => h.id === hour)?.label || hour;
                const isMarkedForDeletion = pendingDeletions.has(event.dbId);

                return (
                  <div key={hour} className="relative">
                    <div className="absolute -top-3 right-2 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      {hourLabel}
                    </div>
                    <div
                      className={`transition-all duration-300 ${
                        isMarkedForDeletion ? "opacity-50 bg-gray-100" : ""
                      }`}
                    >
                      <EventItem
                        event={event}
                        isSelected={true}
                        onSelect={() => toggleEventSelection(event)}
                        onRemove={() => toggleEventSelection(event)}
                        showRemoveButton={true}
                      />
                    </div>
                    {isMarkedForDeletion && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Marcado para Exclusão
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pendingChanges.size > 0 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Salvar Alterações ({pendingChanges.size})
                </button>
                <button
                  onClick={handleCancelChanges}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Cancelar Alterações
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center bg-gray-100 rounded-xl p-8">
            <p className="text-gray-600 text-lg">
              Você ainda não selecionou nenhum evento. Explore a programação
              abaixo.
            </p>
          </div>
        )}
      </Section>

      <Section
        className="px-[1rem] md:px-[8rem] pt-[3rem] pb-[4rem]"
        crosses
        customPaddings
        id="schedule"
      >
        <h1
          className="text-4xl font-extrabold text-center mb-10 text-gray-800"
          style={{
            background: "linear-gradient(to right, #A8E6CF, #56B87B, #8FC93A)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Programação do Evento
        </h1>

        <p className="text-center mx-15 mb-10">
          Escolha os eventos que voce possui interesse em participar no Future
          Day. Caso queira concorrer a vários sorteios ao final do Evento, se
          inscreva e participe de 6 eventos.
        </p>

        {horariosEvento.map((horario) => {
          const hasSelectedEvent = Boolean(
            selectedEvents[horario.id] &&
              !pendingDeletions.has(selectedEvents[horario.id].dbId)
          );
          const hasStagedEvent = Boolean(
            stagedEvents[horario.id] &&
              !pendingDeletions.has(stagedEvents[horario.id].dbId)
          );
          const isModified = isEventModified(horario.id);

          return (
            <div key={horario.id} className="mb-6">
              <div
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
            ${
              hasSelectedEvent || hasStagedEvent
                ? "bg-blue-600 hover:bg-blue-700"
                : expandedHours[horario.id]
                ? "bg-green-700"
                : "bg-green-500 hover:bg-green-700"
            }`}
                onClick={() => toggleDropdown(horario.id)}
              >
                <div className="flex flex-col">
                  <span className="text-white text-lg font-semibold">
                    {horario.label}
                  </span>
                  {(hasSelectedEvent || hasStagedEvent) && (
                    <span className="text-slate-300 text-sm mt-1 font-bold">
                      Selecionado:{" "}
                      <span className="font-extrabold">
                        {stagedEvents[horario.id]?.palestrante ||
                          selectedEvents[horario.id]?.palestrante}
                      </span>
                    </span>
                  )}
                </div>
                <span className="text-white text-lg font-semibold">
                  {expandedHours[horario.id] ? "▲" : "▼"}
                </span>
              </div>

              {expandedHours[horario.id] && (
                <div className="mt-4 p-6 rounded-2xl bg-slate-20 shadow-custom">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getEventsByHour(horario.id).map((event) => {
                      const isSelectedInHour = stagedEvents[horario.id];
                      const isSavedEvent = Object.values(selectedEvents).some(
                        (savedEvent) => savedEvent.eventId === event.id
                      );
                      const isModified = isSelectedInHour || isSavedEvent;
                      const isSelected =
                        (isSelectedInHour?.id === event.id &&
                          !pendingDeletions.has(isSelectedInHour?.dbId)) ||
                        isSavedEvent;

                      return (
                        <div
                          key={event.id}
                          className={`transition-all duration-300 ${
                            isModified
                              ? isSelected
                                ? "opacity-100 pointer-events-none"
                                : "opacity-50 pointer-events-none"
                              : ""
                          }`}
                        >
                          <EventItem
                            event={event}
                            isSelected={isSelected}
                            onSelect={() => toggleEventSelection(event)}
                            onRemove={() => toggleEventSelection(event)}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {pendingChanges.has(horario.id) && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleSaveChanges}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                      >
                        Salvar Alterações ({pendingChanges.size})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Section>
      <Footer></Footer>
    </div>
  );
};

export default EventosList;
