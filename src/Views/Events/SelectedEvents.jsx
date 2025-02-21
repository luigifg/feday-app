import React, { useEffect, useState } from 'react';
import Section from "../../Components/Section";
import EventItem from "../../Components/design/EventItems";
import { horariosEvento, events } from "../../data/EventsData";
import api from "../../constants/Axios";
import { useEvents } from './EventsContext';

const SelectedEvents = () => {
  const [userData, setUserData] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [stagedEvents, setStagedEvents] = useState({});
  const [pendingDeletions, setPendingDeletions] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const { refreshTrigger, refreshEvents } = useEvents();

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
        params: { userId }
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
          };
        }
      });

      setSelectedEvents(currentEvents);
      setStagedEvents(currentEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos do usuário:", error);
    }
  };

  // Marca evento para exclusão
  const markForDeletion = (event) => {
    setPendingDeletions(prev => new Set([...prev, event.dbId]));
    setPendingChanges(prev => new Set([...prev, event.hour]));
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

  const handleCancelChanges = () => {
    setStagedEvents(selectedEvents);
    setPendingDeletions(new Set());
    setPendingChanges(new Set());
  };

  return (
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
              if (!event) return null;
              
              const hourLabel = horariosEvento.find((h) => h.id === hour)?.label || hour;
              const isMarkedForDeletion = pendingDeletions.has(event.dbId);

              return (
                <div key={hour} className="relative">
                  <div className="absolute -top-3 right-2 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    {hourLabel}
                  </div>
                  <EventItem
                    event={event}
                    isSelected={true}
                    onSelect={() => {}}
                    onRemove={() => markForDeletion(event)}
                    showRemoveButton={true}
                    isMarkedForDeletion={isMarkedForDeletion}
                  />
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
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Remover Eventos ({pendingChanges.size})
              </button>
              <button
                onClick={handleCancelChanges}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Cancelar
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