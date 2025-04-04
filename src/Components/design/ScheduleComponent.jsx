import React, { useState, useEffect, useRef } from "react";
import Section from "../../Components/Section";
import EventItem from "../../Components/design/EventItems";
import { horariosEvento, events, ROOM_COLORS } from "../../data/speakerData";
import api from "../../constants/Axios";
import { useEvents } from "../../Views/Events/EventsContext.jsx";
import SpeakerModal from "../../Components/design/SpeakerModal.jsx";
import { fbg } from "../../assets";

const ScheduleSectionComponent = ({
  // Props para controlar o comportamento do componente
  isViewOnly = false, // Se true, apenas visualização sem interação
  customDescription = null, // Descrição personalizada (opcional)
  sectionId = "schedule",
  restrictHandsOnOnly = true, //Nova prop para controlar a restrição
}) => {
  const [eventList, setEventList] = useState([]); // Alterado para começar vazio
  const [userData, setUserData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // Mantemos a referência para os elementos, mas removemos a rolagem automática
  const hourRefs = useRef({});
  const handsOnRefs = useRef({});

  // Usar o contexto de eventos apenas se NÃO estiver no modo somente visualização
  const {
    refreshTrigger,
    refreshEvents,
    preSelectedEvents,
    setPreSelectedEvents,
    expandHour,
    isHourExpanded,
    expandedHour,
    toggleSelectedEventsVisibility,
  } = !isViewOnly
    ? useEvents()
    : {
        refreshTrigger: 0,
        refreshEvents: () => {},
        preSelectedEvents: {},
        setPreSelectedEvents: () => {},
        expandHour: () => {},
        isHourExpanded: () => false,
        expandedHour: null,
        toggleSelectedEventsVisibility: () => {},
      };

  // Estado local de expansão para usar no modo somente visualização
  const [localExpandedHour, setLocalExpandedHour] = useState(null);

  // Função que verifica se um horário está expandido, conforme o modo
  const checkIsHourExpanded = (hour) => {
    if (isViewOnly) {
      return localExpandedHour === hour;
    } else {
      return isHourExpanded(hour);
    }
  };

  const targetHandsOnEventRef = useRef(null);

  // Função para expandir/recolher um horário, conforme o modo
  const handleToggleDropdown = (hour) => {
    // Verificamos se é um horário de intervalo/break
    const isBreak = horariosEvento.find((h) => h.id === hour)?.type === "break";

    // Se for um intervalo, não fazemos nada (não expande)
    if (isBreak) return;

    // Referência ao elemento de cabeçalho para scroll
    const headerElement = hourRefs.current[hour];

    if (isViewOnly) {
      // No modo somente visualização, usamos estado local
      setLocalExpandedHour(localExpandedHour === hour ? null : hour);

      // Adicionamos o efeito de scroll também no modo visualização
      // Se estamos expandindo (não recolhendo)
      if (localExpandedHour !== hour) {
        setTimeout(() => {
          if (headerElement) {
            const headerPosition = headerElement.getBoundingClientRect().top;

            // Verificamos se é mobile (largura da tela menor que 768px)
            const isMobile = window.innerWidth < 768;

            // Offset diferente para mobile e desktop
            const offsetY = isMobile ? 125 : 100;

            const scrollPosition =
              window.pageYOffset + headerPosition - offsetY;

            window.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    } else {
      // No modo interativo, usamos o contexto
      toggleSelectedEventsVisibility(false);

      if (isHourExpanded(hour)) {
        expandHour(null);
      } else {
        expandHour(hour);

        setTimeout(() => {
          if (headerElement) {
            const headerPosition = headerElement.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + headerPosition - 90;

            window.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  };

  const filterEventsByUserGender = (gender) => {
    // Se estiver no modo de visualização (isViewOnly), mostra todos os eventos para todos os usuários
    if (isViewOnly) {
      setEventList(events);
      return;
    }

    // Se não estiver no modo de visualização e o usuário for feminino (F), mostra todos os eventos
    if (gender === "F") {
      setEventList(events);
    } else {
      // Para outros gêneros, filtra apenas eventos que não são exclusivos para mulheres
      const filteredEvents = events.filter((event) => !event.femaleOnly);
      setEventList(filteredEvents);
    }
  };

  // No useEffect inicial, onde carregamos os dados, também ajustamos a condição:
  useEffect(() => {
    // Se estiver no modo somente visualização, carregamos todos os eventos
    if (isViewOnly) {
      filterEventsByUserGender(null); // Passa null para mostrar todos
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get("/me");
        if (response.status === 200) {
          setUserData(response.data);
          fetchUserEvents(response.data.id);

          // Filtra os eventos baseado no gênero do usuário
          filterEventsByUserGender(response.data.gender);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);

        // Caso de erro, mostra todos os eventos não exclusivos
        filterEventsByUserGender(null);
      }
    };

    fetchUserData();
  }, [isViewOnly]);

  useEffect(() => {
    if (!isViewOnly && userData?.id) {
      fetchUserEvents(userData.id);
    }
  }, [refreshTrigger, userData, isViewOnly]);

  // Efeito para o scroll automático quando o componente montar
  useEffect(() => {
    if (restrictHandsOnOnly && !isViewOnly) {
      const scrollToTarget = async () => {
        try {
          // Primeiro: scroll até a seção de programação
          const scheduleSection = document.getElementById(sectionId);
          if (scheduleSection) {
            scheduleSection.scrollIntoView({ behavior: "smooth" });

            // Aguarda 1500ms para a primeira rolagem completar
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Segundo: encontra e expande o horário correto
            // Os IDs dos horários são baseados no array horariosEvento
            // ID "5" corresponde ao horário que precisamos focar
            const targetHour = "5";
            const targetHourElement = hourRefs.current[targetHour];

            if (targetHourElement) {
              // Rola até o horário alvo
              targetHourElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });

              // Aguarda 1200ms antes de expandir
              await new Promise((resolve) => setTimeout(resolve, 1200));

              // Expande o horário (simula clique no dropdown)
              if (!isHourExpanded(targetHour)) {
                expandHour(targetHour);

                // Aguarda 1000ms para a expansão do conteúdo
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Procura o evento hands-on com ID 14
                const targetEvent = events.find(
                  (e) => e.id === 14 && e.isHandsOn
                );

                if (targetEvent && targetHandsOnEventRef.current) {
                  // Rola até o evento específico
                  targetHandsOnEventRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error("Erro durante o scroll automático:", error);
        }
      };

      // Inicia o scroll automático após um delay maior para garantir que todos os elementos estão renderizados
      const timer = setTimeout(() => {
        scrollToTarget();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [restrictHandsOnOnly, isViewOnly, userData]);

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
    if (isViewOnly || !userData?.id) return;

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
    if (isViewOnly) return;

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
    if (isViewOnly) return;

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

  const toggleEventSelection = (event) => {
    if (isViewOnly || selectedEvents[event.hour]) return;

    // Verifica se a restrição está ativa e se o evento não é hands-on
    if (restrictHandsOnOnly && !event.isHandsOn) return;

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
    if (isViewOnly || !userData?.id) return;

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
    if (isViewOnly) return;

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
    // Filtra os eventos pelo horário do eventList (já filtrado por gênero)
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

  // Verifica se há eventos para um determinado horário
  const hasEventsForHour = (hour) => {
    return getEventsByHour(hour).length > 0;
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
      className="py-16 md:py-16 lg:py-20 px-[1rem] md:px-[5rem] xl:px-[6rem] pt-[3rem] pb-[4rem] scroll-mt-20"
      crosses
      customPaddings
      id={sectionId}
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
        useSpeakerName={false}
      />

      <h2 className="font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-center mb-10 md:mb-12">
        Programação do Evento
      </h2>

      <div className="text-center">
        <p className="text-sm md:text-lg text-gray-600 mb-10 md:mb-12 mx-[2rem]">
          {customDescription ||
            "Planeje sua experiência no Future Day 2025! Navegue pela programação e reserve sua vaga nos eventos que mais combinam com você."}
        </p>
      </div>

      {horariosEvento.map((horario) => {
        // Verificar se é um horário de intervalo/break
        const isBreak = horario.type === "break";

        // Verificar se é o horário do keynote (id "0")
        const isKeynote = horario.id === "0";

        // Se não houver eventos para este horário e não for break ou keynote, não renderiza nada
        if (!hasEventsForHour(horario.id) && !isBreak && !isKeynote) {
          return null;
        }

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
        const hasSelectedEvent =
          !isViewOnly && Boolean(selectedEvents[horario.id]);
        const hasPreSelectedEvent =
          !isViewOnly && Boolean(preSelectedEvents[horario.id]);
        const hasPendingChangesInThisHour =
          !isViewOnly && pendingChanges.has(horario.id);
        const isExpanded = checkIsHourExpanded(horario.id);

        // Se for o keynote (horário 08:00), permitimos o toggle mas exibimos apenas o palestrante keynote
        if (isKeynote) {
          const keynoteEvent = events.find((event) => event.id === 26);

          // Se o keynote não estiver disponível ou for filtrado por gênero, não mostra
          if (!keynoteEvent || !eventList.some((e) => e.id === 26)) {
            return null;
          }

          return (
            <div
              key={horario.id}
              className="mb-6"
              ref={(el) => (hourRefs.current[horario.id] = el)}
            >
              <div
                className={`relative flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 
                    ${
                      isExpanded
                        ? "bg-green-800"
                        : "bg-green-900 hover:bg-green-1000"
                    }`}
                onClick={() => handleToggleDropdown(horario.id)}
              >
                {/* Efeito de brilho animado na borda */}
                <div className="absolute inset-0 rounded-lg border-4 border-green-400 overflow-hidden pointer-events-none">
                  <div className="keynote-glow absolute inset-0"></div>
                </div>

                {/* Layout responsivo - apenas para mobile */}
                <div className="md:flex md:flex-col md:items-start flex-grow md:flex-grow-0 z-10">
                  <div className="hidden md:block text-white text-lg font-semibold">
                    {horario.label} -{" "}
                    <span className="text-green-300 font-bold">
                      Keynote Speaker
                    </span>
                  </div>

                  {/* Versão mobile alinhada à esquerda */}
                  <div className="md:hidden w-full text-left text-lg font-semibold text-white">
                    {horario.label} <br />
                    <span className="text-green-300 font-bold">
                      Keynote Speaker
                    </span>
                  </div>

                  <span className="text-slate-200 text-sm mt-1 font-bold text-left w-full md:w-auto">
                    Fernando Barrera - Diretor Técnico Regional - Future
                    Electronics
                  </span>
                </div>
                <span className="text-white text-lg font-semibold z-10">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {isExpanded && (
                <div className="mt-4 transition-all flex justify-center duration-300 ease-in-out animate-fadeIn">
                  <div className="p-6 rounded-2xl bg-slate-20 shadow-custom max-w-lg relative border-2 border-green-400 overflow-hidden">
                    {/* Card do Keynote Speaker centralizado */}
                    <div className="flex justify-center z-10 relative">
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

                    {/* Efeito de brilho no card expandido */}
                    <div className="keynote-glow-card absolute inset-0"></div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Se não houver eventos para este horário após filtragem, não mostra
        const eventsForThisHour = getEventsByHour(horario.id);
        if (eventsForThisHour.length === 0) {
          return null;
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
              onClick={() => handleToggleDropdown(horario.id)}
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

                {!isViewOnly && (hasSelectedEvent || hasPreSelectedEvent) && (
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
                <div
                  className="p-6 rounded-2xl border-4 border-green-400 shadow-lg relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${fbg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-white bg-opacity-85"></div>

                  {!isViewOnly && restrictHandsOnOnly && (
                    <div
                      className="relative z-20 w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md"
                      style={{ backgroundColor: "rgba(254, 226, 226, 0.95)" }}
                    >
                      <div className="flex">
                        <div className="py-1 mr-2">
                          <svg
                            className="w-6 h-6 text-red-500 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-red-800">
                            Atenção: Inscrições limitadas
                          </p>
                          <p className="text-sm text-red-700 font-medium">
                            No momento, apenas eventos sinalizados como
                            "Hands-on" estão disponíveis para inscrição. Os
                            demais eventos serão liberados em breve.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {getEventsByHour(horario.id).map((event) => {
                      const savedEvent = !isViewOnly
                        ? selectedEvents[horario.id]
                        : null;
                      const preSelectedEvent = !isViewOnly
                        ? preSelectedEvents[horario.id]
                        : null;

                      const isSelected =
                        !isViewOnly && savedEvent?.eventId === event.id;
                      const isPreSelected =
                        !isViewOnly && preSelectedEvent?.eventId === event.id;
                      const isOtherSelected =
                        !isViewOnly &&
                        ((savedEvent && savedEvent.eventId !== event.id) ||
                          (preSelectedEvent &&
                            preSelectedEvent.eventId !== event.id));
                      const isSaved =
                        !isViewOnly &&
                        Boolean(savedEvent?.eventId === event.id);
                      const isMarkedForDeletion =
                        !isViewOnly && savedEvent
                          ? pendingDeletions.has(savedEvent.dbId)
                          : false;

                      return (
                        <div
                          key={event.id}
                          ref={
                            event.id === 14 && event.isHandsOn
                              ? targetHandsOnEventRef
                              : null
                          }
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
                            isViewOnly={isViewOnly}
                            // Oculta o botão "Selecionar" no modo somente visualização
                            showRemoveButton={isViewOnly}
                            // Mantém a informação visual de que é um hands-on
                            isHandsOn={event.isHandsOn || false}
                            // Passa a restrição para o componente EventItem
                            restrictSelection={restrictHandsOnOnly}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {!isViewOnly && hasPendingChangesInThisHour && (
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelChanges();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md border-2 border-red-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveChanges();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md border-2 border-green-600"
                      >
                        Salvar Alterações
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

export default ScheduleSectionComponent;
