import React, { useState, useEffect, useRef } from "react";
import Section from "../../Components/Section";
import EventItem from "../../Components/design/EventItems";
import { horariosEvento, events, ROOM_COLORS } from "../../data/speakerData";
import api from "../../constants/Axios";
import { useEvents } from "./EventsContext";
import SpeakerModal from "../../Components/design/SpeakerModal.jsx";

const ScheduleSection = () => {
  const [eventList] = useState(events);
  const [userData, setUserData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // Mantemos a referência para os elementos, mas removemos a rolagem automática
  const hourRefs = useRef({});

  const {
    refreshTrigger,
    refreshEvents,
    preSelectedEvents,
    setPreSelectedEvents,
    expandHour,
    isHourExpanded,
    expandedHour,
    toggleSelectedEventsVisibility,
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
    });
    setModalOpen(true);
  };

  const closeEventModal = () => {
    setModalOpen(false);
    setSelectedSpeaker(null);
  };

  const removeEvent = async (event) => {
    if (!userData?.id) return;

    try {
      await api.delete(`/participation/${event.dbId}`);

      setSelectedEvents((prev) => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });

      setPendingDeletions((prev) => {
        const newDeletions = new Set(prev);
        newDeletions.delete(event.dbId);
        return newDeletions;
      });

      setPendingChanges((prev) => {
        const newChanges = new Set(prev);
        newChanges.delete(event.hour);
        return newChanges;
      });

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
            description: eventDetails.descriptionLecture,
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
    // Verificamos se é um horário de intervalo/break
    const isBreak = horariosEvento.find((h) => h.id === hour)?.type === "break";

    // Se for um intervalo, não fazemos nada (não expande)
    if (isBreak) return;

    // Ao expandir um horário, fechamos a seção "Meus Eventos"
    toggleSelectedEventsVisibility(false);

    // Antes de alterar o estado, salvamos a posição do elemento para garantir o scroll correto
    const headerElement = hourRefs.current[hour];
    
    // Se o horário já está expandido, fechamos ele
    if (isHourExpanded(hour)) {
      expandHour(null);
    } else {
      // Caso contrário, expandimos este horário
      expandHour(hour);
      
      // Adicionamos um delay um pouco maior para garantir que a renderização foi concluída
      setTimeout(() => {
        if (headerElement) {
          // Calculamos um offset para garantir que o cabeçalho fique no topo
          const headerPosition = headerElement.getBoundingClientRect().top;
          const scrollPosition = window.pageYOffset + headerPosition - 90; // 20px de margem no topo
          
          // Fazemos o scroll para a posição calculada
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Aumentamos o delay para dar tempo à renderização
    }
  };

  const toggleEventSelection = (event) => {
    if (selectedEvents[event.hour]) return;

    const eventDetails = events.find((e) => e.id === event.id);
    const isCurrentlySelected =
      preSelectedEvents[event.hour]?.eventId === event.id;

    if (isCurrentlySelected) {
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

    console.log("userdata:", userData);
    try {
      if (event) {
        const eventDetails = events.find((e) => e.id === event.id);

        await api.post("/participation", {
          userId: userData.id,
          userName: userData.name,
          scheduleId: event.hour,
          eventId: event.id,
          title: event.title,
          speaker: event.palestrante,
          room: event.room,
        });

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

        refreshEvents();
        await fetchUserEvents(userData.id);
        alert("Evento salvo com sucesso!");
        return;
      }

      for (const hour of pendingChanges) {
        const event = preSelectedEvents[hour];
        if (event) {
          await api.post("/participation", {
            userId: userData.id,
            userName: userData.name,
            scheduleId: event.hour,
            eventId: event.id,
            title: event.title,
            speaker: event.palestrante,
            room: event.room,
          });
        }
      }

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
      setPreSelectedEvents({});
      setPendingChanges(new Set());
    }
  };

  const getEventsByHour = (hour) => {
    // Filtra os eventos pelo horário
    const filteredEvents = eventList.filter((event) => event.hour === hour);

    // Ordena os eventos pelo idRoom da sala
    return filteredEvents.sort((a, b) => {
      // Obtem o idRoom da sala para cada evento
      const roomA = a.room ? a.room.toLowerCase() : "";
      const roomB = b.room ? b.room.toLowerCase() : "";

      // Obtém os idRoom dos objetos ROOM_COLORS
      const idRoomA = ROOM_COLORS[roomA]?.idRoom || 999; // Valor alto caso não encontre
      const idRoomB = ROOM_COLORS[roomB]?.idRoom || 999;

      // Ordena por idRoom (crescente)
      return idRoomA - idRoomB;
    });
  };

  // Renderiza um bloco de intervalo/break com melhor responsividade
  const renderBreakBlock = (horario) => {
    return (
      <div className="relative p-4 rounded-lg bg-gray-500 text-white shadow-md">
        {/* Layout diferente entre mobile e desktop */}
        <div className="md:hidden flex flex-col">
          {/* Versão mobile: texto e horário alinhados à esquerda */}
          <div className="text-left text-lg font-semibold mb-2">
            {horario.label}
          </div>
          <div className="text-left text-md font-medium">
            {horario.description}
          </div>
        </div>

        {/* Layout para desktop - mantém o original */}
        <div className="hidden md:block">
          {/* Horário à esquerda */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold">
            {horario.label}
          </div>

          {/* Descrição centralizada */}
          <div className="w-full text-center text-md font-medium">
            {horario.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section
      className="px-[1rem] md:px-[5rem] xl:px-[6rem] pt-[3rem] pb-[4rem]"
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
        titleField="title"
        descriptionField="descriptionLecture"
        useSpeakerName={false} // Adicionando esta prop para garantir que use sempre palestrante
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
        // Verificar se é um horário de intervalo/break
        const isBreak = horario.type === "break";

        // Verificar se é o horário do keynote (id "0")
        const isKeynote = horario.id === "0";

        if (isBreak) {
          // Renderiza um bloco de intervalo (não clicável, não expansível)
          return (
            <div
              key={horario.id}
              className="mb-6"
              ref={(el) => (hourRefs.current[horario.id] = el)}
            >
              {renderBreakBlock(horario)}
            </div>
          );
        }

        // Para horários normais de eventos, continua com o código original
        const hasSelectedEvent = Boolean(selectedEvents[horario.id]);
        const hasPreSelectedEvent = Boolean(preSelectedEvents[horario.id]);
        const hasPendingChangesInThisHour = pendingChanges.has(horario.id);
        const isExpanded = isHourExpanded(horario.id);

        // Se for o keynote (horário 08:00), permitimos o toggle mas exibimos apenas o palestrante keynote
        if (isKeynote) {
          const keynoteEvent = events.find((event) => event.id === 26);

          return (
            <div
              key={horario.id}
              className="mb-6"
              ref={(el) => (hourRefs.current[horario.id] = el)}
            >
              <div
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    isExpanded
                      ? "bg-yellow-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                onClick={() => toggleDropdown(horario.id)}
              >
                {/* Layout responsivo - apenas para mobile */}
                <div className="md:flex md:flex-col md:items-start flex-grow md:flex-grow-0">
                  <div className="hidden md:block text-white text-lg font-semibold">
                    {horario.label} - Keynote Speaker
                  </div>

                  {/* Versão mobile alinhada à esquerda */}
                  <div className="md:hidden w-full text-left text-lg font-semibold text-white">
                    {horario.label} <br /> Keynote Speaker
                  </div>

                  <span className="text-slate-200 text-sm mt-1 font-bold text-left w-full md:w-auto">
                    Fernando Barrera - Diretor Técnico Regional - Future
                    Electronics
                  </span>
                </div>
                <span className="text-white text-lg font-semibold">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {isExpanded && (
                <div className="mt-4 transition-all flex justify-center duration-300 ease-in-out animate-fadeIn">
                  <div className=" p-6 rounded-2xl bg-slate-20 shadow-custom max-w-lg">
                    {/* Card do Keynote Speaker centralizado */}
                    <div className="flex justify-center">
                      <div className="max-w-md">
                        {keynoteEvent && (
                          <EventItem
                            event={keynoteEvent}
                            isSelected={true}
                            onSelect={() => {}}
                            onRemove={() => {}}
                            showRemoveButton={false}
                            isMarkedForDeletion={false}
                            onOpenModal={() => openEventModal(keynoteEvent)}
                            isSaved={true}
                            specialEvent={true}
                            buttonsState="normal"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={horario.id}
            className="mb-6"
            ref={(el) => (hourRefs.current[horario.id] = el)}
          >
            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
                ${
                  hasSelectedEvent || hasPreSelectedEvent
                    ? "bg-green-800 hover:bg-green-900"
                    : isExpanded
                    ? "bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              onClick={() => toggleDropdown(horario.id)}
            >
              {/* Layout responsivo - apenas para mobile */}
              <div className="md:flex md:flex-col md:items-start flex-grow md:flex-grow-0">
                <div className="hidden md:block text-white text-lg font-semibold">
                  {horario.label}
                </div>

                {/* Versão mobile alinhada à esquerda */}
                <div className="md:hidden w-full text-left text-lg font-semibold text-white">
                  {horario.label}
                </div>

                {(hasSelectedEvent || hasPreSelectedEvent) && (
                  <span className="text-slate-300 text-sm mt-1 font-bold text-left w-full md:w-auto">
                    Selecionado:{" "}
                    <span className="font-extrabold">
                      {preSelectedEvents[horario.id]?.palestrante ||
                        selectedEvents[horario.id]?.palestrante}
                    </span>
                  </span>
                )}
              </div>
              <span className="text-white text-lg font-semibold">
                {isExpanded ? "▲" : "▼"}
              </span>
            </div>

            {isExpanded && (
              <div className="mt-4 transition-all duration-300 ease-in-out animate-fadeIn">
                <div className="p-6 rounded-2xl bg-slate-20 shadow-custom">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            buttonsState={isPreSelected ? "selected" : "normal"}
                            onCancelSelection={() => handleCancelChanges(event)}
                            onSaveEvent={() => handleSaveChanges(event)}
                            onRemoveConfirm={() => removeEvent(savedEvent)}
                            onRemoveCancel={() => {}}
                            isOtherSelected={isOtherSelected}
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
              </div>
            )}
          </div>
        );
      })}
    </Section>
  );
};

export default ScheduleSection;
