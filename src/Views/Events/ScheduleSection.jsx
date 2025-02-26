import React, { useState, useEffect } from "react";
import Section from "../../Components/Section";
import EventItem from "../../Components/design/EventItems";
import { horariosEvento, events } from "../../data/EventsData";
import api from "../../constants/Axios";
import { useEvents } from "./EventsContext";
import SpeakerModal from "../../Components/design/SpeakerModal.jsx";

const ScheduleSection = () => {
  const [eventList] = useState(events);
  const [expandedHours, setExpandedHours] = useState({});
  const [userData, setUserData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const {
    refreshTrigger,
    refreshEvents,
    preSelectedEvents,
    setPreSelectedEvents,
  } = useEvents();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/me");
        if (response.status === 200) {
          setUserData(response.data);
          fetchUserEvents(response.data.id);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.id) {
      fetchUserEvents(userData.id);
    }
  }, [refreshTrigger, userData]);

  const openEventModal = (event) => {
    setSelectedSpeaker({
      id: event.id,
      name: event.palestrante,
      position: event.title,
      description: event.description,
      image: event.image,
      linkedinUrl: event.linkedinUrl || "#",
    });
    setModalOpen(true);
  };

  // Função para fechar o modal
  const closeEventModal = () => {
    setModalOpen(false);
    setSelectedSpeaker(null);
  };

  // Função para remover evento
  const removeEvent = async (event) => {
    if (!userData?.id) return;
    
    try {
      // Remove evento do banco de dados
      await api.delete(`/participation/${event.dbId}`);
      
      // Atualiza a interface removendo o evento
      setSelectedEvents(prev => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });
      
      // Limpar pendingDeletions e pendingChanges
      setPendingDeletions(prev => {
        const newDeletions = new Set(prev);
        newDeletions.delete(event.dbId);
        return newDeletions;
      });
      
      setPendingChanges(prev => {
        const newChanges = new Set(prev);
        newChanges.delete(event.hour);
        return newChanges;
      });
      
      // Disparar refresh global para atualizar "Meus Eventos"
      refreshEvents();
      
      alert("Evento removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover evento:", error);
      alert("Erro ao remover evento. Por favor, tente novamente.");
    }
  };

  const markEventForDeletion = (event) => {
    setPendingDeletions((prev) => {
      const newDeletions = new Set(prev);
      if (newDeletions.has(event.dbId)) {
        newDeletions.delete(event.dbId);
        setPendingChanges((prev) => {
          const newChanges = new Set(prev);
          newChanges.delete(event.hour);
          return newChanges;
        });
      } else {
        newDeletions.add(event.dbId);
        setPendingChanges((prev) => new Set([...prev, event.hour]));
      }
      return newDeletions;
    });
  };

  const fetchUserEvents = async (userId) => {
    try {
      const participationsResponse = await api.get(`/participation`, {
        params: { userId },
      });
      const currentEvents = {};
      participationsResponse.data.data.forEach((participation) => {
        const eventDetails = events.find((e) => e.id === participation.eventId);
        if (eventDetails) {
          currentEvents[participation.scheduleId] = {
            id: participation.id,
            eventId: participation.eventId,
            hour: participation.scheduleId,
            title: participation.title,
            palestrante: participation.speaker,
            room: participation.room,
            dbId: participation.id,
            description: eventDetails.description,
            image: eventDetails.image || "",
            companyLogo: eventDetails.companyLogo || "",
            position: eventDetails.position || "",
            linkedinUrl: eventDetails.linkedinUrl || "#",
          };
        }
      });

      setSelectedEvents(currentEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos do usuário:", error);
    }
  };

  const toggleDropdown = (hour) => {
    setExpandedHours((prev) => ({
      ...prev,
      [hour]: !prev[hour],
    }));
  };

  const toggleEventSelection = (event) => {
    // Se o evento já está salvo, não permite alteração
    if (selectedEvents[event.hour]) return;

    const eventDetails = events.find((e) => e.id === event.id);
    const isCurrentlySelected =
      preSelectedEvents[event.hour]?.eventId === event.id;

    if (isCurrentlySelected) {
      // Se o evento já está selecionado, remove a seleção
      setPreSelectedEvents((prev) => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });
      setPendingChanges((prev) => {
        const newChanges = new Set(prev);
        newChanges.delete(event.hour);
        return newChanges;
      });
    } else {
      // Se o evento não está selecionado, adiciona a seleção
      setPreSelectedEvents((prev) => ({
        ...prev,
        [event.hour]: {
          ...event,
          eventId: event.id,
          image: eventDetails?.image || "",
          companyLogo: eventDetails?.companyLogo || "",
        },
      }));
      setPendingChanges((prev) => new Set([...prev, event.hour]));
    }
  };

  const handleSaveChanges = async (event = null) => {
    if (!userData?.id) return;

    try {
      // Se um evento específico foi passado, salvar apenas ele
      if (event) {
        const eventDetails = events.find((e) => e.id === event.id);
        
        await api.post("/participation", {
          userId: userData.id,
          scheduleId: event.hour,
          eventId: event.id,
          title: event.title,
          speaker: event.palestrante,
          room: event.room,
        });

        // Atualizar estados locais
        setPreSelectedEvents((prev) => {
          const newEvents = { ...prev };
          delete newEvents[event.hour];
          return newEvents;
        });

        setPendingChanges((prev) => {
          const newChanges = new Set(prev);
          newChanges.delete(event.hour);
          return newChanges;
        });

        // Disparar refresh global para atualizar "Meus Eventos"
        refreshEvents();
        await fetchUserEvents(userData.id);
        alert("Evento salvo com sucesso!");
        return;
      }

      // Handle new creations
      for (const hour of pendingChanges) {
        const event = preSelectedEvents[hour];
        if (event) {
          await api.post("/participation", {
            userId: userData.id,
            scheduleId: event.hour,
            eventId: event.id,
            title: event.title,
            speaker: event.palestrante,
            room: event.room,
          });
        }
      }

      // Refresh events
      await fetchUserEvents(userData.id);
      setPendingChanges(new Set());
      setPreSelectedEvents({});
      refreshEvents();
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro ao salvar alterações. Por favor, tente novamente.");
    }
  };

  const handleCancelChanges = (event = null) => {
    if (event) {
      // Cancelar seleção de um evento específico
      setPreSelectedEvents((prev) => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });
      setPendingChanges((prev) => {
        const newChanges = new Set(prev);
        newChanges.delete(event.hour);
        return newChanges;
      });
    } else {
      // Cancelar todas as alterações
      setPreSelectedEvents({});
      setPendingChanges(new Set());
    }
  };

  const getEventsByHour = (hour) => {
    return eventList.filter((event) => event.hour === hour);
  };

  return (
    <Section
      className="px-[1rem] md:px-[8rem] pt-[3rem] pb-[4rem]"
      crosses
      customPaddings
      id="schedule"
    >
      <SpeakerModal
        isOpen={modalOpen}
        onClose={closeEventModal}
        currentSlide={0}
        onPrevSlide={() => {}}
        onNextSlide={() => {}}
        slides={selectedSpeaker ? [selectedSpeaker] : []}
        speakerId={selectedSpeaker?.id}
      />
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
        Escolha os eventos que você possui interesse em participar no Future
        Day. Caso queira concorrer a vários sorteios ao final do Evento, se
        inscreva e participe de 6 eventos.
      </p>

      {horariosEvento.map((horario) => {
        const hasSelectedEvent = Boolean(selectedEvents[horario.id]);
        const hasPreSelectedEvent = Boolean(preSelectedEvents[horario.id]);
        const hasPendingChangesInThisHour = pendingChanges.has(horario.id);

        return (
          <div key={horario.id} className="mb-6">
            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
                ${
                  hasSelectedEvent || hasPreSelectedEvent
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
                {(hasSelectedEvent || hasPreSelectedEvent) && (
                  <span className="text-slate-300 text-sm mt-1 font-bold">
                    Selecionado:{" "}
                    <span className="font-extrabold">
                      {preSelectedEvents[horario.id]?.palestrante ||
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
                    const savedEvent = selectedEvents[horario.id];
                    const preSelectedEvent = preSelectedEvents[horario.id];

                    const isSelected = savedEvent?.eventId === event.id;
                    const isPreSelected =
                      preSelectedEvent?.eventId === event.id;
                    const isOtherSelected =
                      (savedEvent && savedEvent.eventId !== event.id) ||
                      (preSelectedEvent &&
                        preSelectedEvent.eventId !== event.id);
                    const isSaved = Boolean(savedEvent?.eventId === event.id);
                    const isMarkedForDeletion = savedEvent
                      ? pendingDeletions.has(savedEvent.dbId)
                      : false;

                    return (
                      <div
                        key={event.id}
                        className={`transition-all duration-300 ${
                          isOtherSelected ? "opacity-50" : ""
                        }`}
                      >
                        <EventItem
                          event={event}
                          isSelected={isSelected}
                          isPreSelected={isPreSelected}
                          isSaved={isSaved}
                          onSelect={() => toggleEventSelection(event)}
                          onRemove={() => {}}
                          onOpenModal={() => openEventModal(event)}
                          // Novos props para controlar o estado dos botões
                          buttonsState={isPreSelected ? "selected" : "normal"}
                          onCancelSelection={() => handleCancelChanges(event)}
                          onSaveEvent={() => handleSaveChanges(event)}
                          // Propriedades para o sistema de remoção interno
                          onRemoveConfirm={() => removeEvent(savedEvent)}
                          onRemoveCancel={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>

                {hasPendingChangesInThisHour && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveChanges();
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md border-2 border-green-600"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelChanges();
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md border-2 border-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </Section>
  );
};

export default ScheduleSection;