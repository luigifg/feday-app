import React, { useEffect, useState } from "react";
import Section from "../../Components/Section";
import EventItem from "../../Components/design/EventItems";
import { horariosEvento, events } from "../../data/speakerData";
import api from "../../constants/Axios";
import { useEvents } from "./EventsContext";
import SpeakerModal from "../../Components/design/SpeakerModal.jsx";

const SelectedEvents = () => {
  const [userData, setUserData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [stagedEvents, setStagedEvents] = useState({});
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  // Referência ao keynote speaker (ID 26)
  const keynoteEvent = events.find((event) => event.id === 26);

  const {
    refreshTrigger,
    refreshEvents,
    expandHour,
    isSelectedEventsVisible,
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
  }, [refreshTrigger]);

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
            femaleOnly: eventDetails.femaleOnly || false, // Adiciona a informação de evento feminino
            isHandsOn: eventDetails.isHandsOn || false, // Adiciona a informação de evento hands-on
          };
        }
      });

      // Adicionar o keynote speaker (ID 26) aos eventos selecionados
      if (keynoteEvent) {
        // Usamos "keynote" como ID de hora para distinguir dos demais
        currentEvents["keynote"] = {
          id: "keynote-special",
          eventId: keynoteEvent.id,
          hour: "0", // Horário do keynote
          title: keynoteEvent.title,
          palestrante: keynoteEvent.palestrante,
          room: keynoteEvent.room,
          dbId: "keynote-special-id",
          position: keynoteEvent.position,
          image: keynoteEvent.image || "",
          companyLogo: keynoteEvent.companyLogo || "",
          companyUrl: keynoteEvent.companyUrl || "",
          description: keynoteEvent.descriptionLecture || "",
          linkedinUrl: keynoteEvent.linkedinUrl || "#",
          femaleOnly: keynoteEvent.femaleOnly || false, // Adiciona a informação de evento feminino
          isHandsOn: keynoteEvent.isHandsOn || false, // Adiciona a informação de evento hands-on
        };
      }

      setSelectedEvents(currentEvents);
      setStagedEvents(currentEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos do usuário:", error);
    }
  };

  // Função para alternar visibilidade de todos os eventos
  const toggleEventsVisibility = () => {
    // Ao expandir a seção "Meus Eventos", fechamos qualquer horário aberto
    expandHour(null);
    toggleSelectedEventsVisibility(!isSelectedEventsVisible);
  };

  // Função para abrir o modal do palestrante
  const openEventModal = (event) => {
    setSelectedSpeaker({
      id: event.eventId,
    });
    setModalOpen(true);
  };

  // Função para fechar o modal
  const closeEventModal = () => {
    setModalOpen(false);
    setSelectedSpeaker(null);
  };

  // Remove um evento individualmente
  const removeEventIndividually = async (event) => {
    if (!userData?.id) return;

    try {
      // Remove evento do banco de dados
      await api.delete(`/participation/${event.dbId}`);

      // Atualiza a interface removendo o evento
      setSelectedEvents((prev) => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });

      setStagedEvents((prev) => {
        const newEvents = { ...prev };
        delete newEvents[event.hour];
        return newEvents;
      });

      // Atualiza pendingDeletions e pendingChanges
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

      // Dispara a atualização global
      refreshEvents();

      alert("Evento removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover evento:", error);
      alert("Erro ao remover evento. Por favor, tente novamente.");
    }
  };

  // Marca evento para exclusão (não usado mais diretamente, mantido para compatibilidade)
  const markForDeletion = (event) => {
    setPendingDeletions((prev) => {
      const newDeletions = new Set(prev);
      if (newDeletions.has(event.dbId)) {
        newDeletions.delete(event.dbId);
      } else {
        newDeletions.add(event.dbId);
      }
      return newDeletions;
    });

    // Atualiza pendingChanges
    setPendingChanges((prev) => {
      const newChanges = new Set(prev);
      if (newChanges.has(event.hour)) {
        // Se já está marcado, verificamos se devemos remover
        // (isto é, se não há mais nenhum evento marcado para deleção)
        const newDeletions = new Set(pendingDeletions);
        if (newDeletions.has(event.dbId)) {
          newDeletions.delete(event.dbId);
        } else {
          newDeletions.add(event.dbId);
        }

        // Se após a mudança não houver elementos, removemos do pendingChanges
        if (newDeletions.size === 0) {
          newChanges.delete(event.hour);
        }
      } else {
        // Se não está marcado, adicionamos
        newChanges.add(event.hour);
      }
      return newChanges;
    });
  };

  const handleSaveChanges = async () => {
    if (!userData?.id) return;

    try {
      // Handle deletions
      for (const dbId of pendingDeletions) {
        await api.delete(`/participation/${dbId}`);
      }

      // Refresh events
      await fetchUserEvents(userData.id);
      setPendingDeletions(new Set());
      setPendingChanges(new Set());
      refreshEvents();
      alert("Eventos removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover eventos:", error);
      alert("Erro ao remover eventos. Por favor, tente novamente.");
    }
  };

  const eventsCount = Object.keys(stagedEvents).length;

  return (
    <Section
      className="px-[1rem] md:px-[5rem] xl:px-[6rem] pt-[3rem] pb-[4rem]"
      crosses
      customPaddings
      id="eventos"
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
        className="text-4xl font-extrabold text-center mb-8 text-gray-800"
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
          {/* Header com toggle de visibilidade */}
          <div
            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 mb-6
              ${
                isSelectedEventsVisible
                  ? "bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            onClick={toggleEventsVisibility}
          >
            <div className="flex flex-col">
              <span className="text-white text-lg font-semibold">
                {eventsCount}{" "}
                {eventsCount === 1
                  ? "Evento Selecionado"
                  : "Eventos Selecionados"}
              </span>
              <span className="text-slate-200 text-sm mt-1">
                Clique para {isSelectedEventsVisible ? "ocultar" : "mostrar"}{" "}
                seus eventos
              </span>
            </div>
            <span className="text-white text-lg font-semibold">
              {isSelectedEventsVisible ? "▲" : "▼"}
            </span>
          </div>

          {/* Lista de eventos com visibilidade controlada */}
          {isSelectedEventsVisible && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 transition-all duration-300 ease-in-out animate-fadeIn">
              {(() => {
                // Organizamos os eventos para que o keynote apareça primeiro
                const sortedEntries = Object.entries(stagedEvents).sort(
                  ([hourA, eventA], [hourB, eventB]) => {
                    // Se eventA é keynote, deve aparecer primeiro (-1)
                    if (eventA.eventId === 26) return -1;
                    // Se eventB é keynote, deve aparecer primeiro (1)
                    if (eventB.eventId === 26) return 1;
                    // Caso contrário, mantém a ordem original
                    return 0;
                  }
                );

                return sortedEntries.map(([hour, event]) => {
                  if (!event) return null;

                  // Verificar se é o keynote speaker
                  const isKeynote = event.eventId === 26;

                  // Label do horário, para todos os eventos incluindo o keynote
                  const hourLabel = isKeynote
                    ? horariosEvento.find((h) => h.id === "0")?.label ||
                      "08:00 às 08:45"
                    : horariosEvento.find((h) => h.id === hour)?.label || hour;

                  const isMarkedForDeletion = pendingDeletions.has(event.dbId);

                  return (
                    <div key={hour} className="relative">
                      {/* Tags configuradas para keynote ou eventos normais */}
                      {isKeynote ? (
                        <>
                          {/* Tag à esquerda - Keynote Speaker */}
                          <div className="absolute -top-3 left-2 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            Keynote Speaker
                          </div>
                          {/* Tag à direita - Horário */}
                          <div className="absolute -top-3 right-2 z-10 bg-green-800 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            {hourLabel}
                          </div>
                        </>
                      ) : (
                        <div className="absolute -top-3 right-2 z-10 bg-green-800 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          {hourLabel}
                        </div>
                      )}
                      <EventItem
                        event={event}
                        isSelected={true}
                        onSelect={() => {}}
                        onRemove={() => {}}
                        showRemoveButton={false}
                        isMarkedForDeletion={isMarkedForDeletion}
                        onOpenModal={() => openEventModal(event)}
                        isSaved={true}
                        onRemoveConfirm={() =>
                          isKeynote ? null : removeEventIndividually(event)
                        }
                        onRemoveCancel={() => {}}
                        specialEvent={isKeynote} // Passamos a prop especialEvent quando for o keynote
                        isHandsOn={event.isHandsOn || false} // Passamos a informação de hands-on
                        restrictSelection={false} // Não restringimos a seleção na tela de eventos selecionados
                      />
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {pendingDeletions.size > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSaveChanges}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md border-2 border-red-600"
              >
                Confirmar Remoção ({pendingDeletions.size})
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
  );
};

export default SelectedEvents;
