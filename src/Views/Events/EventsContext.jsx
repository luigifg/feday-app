import React, { createContext, useContext, useState } from 'react';

export const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [preSelectedEvents, setPreSelectedEvents] = useState({});
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [expandedHour, setExpandedHour] = useState(null);
  const [isSelectedEventsVisible, setIsSelectedEventsVisible] = useState(true);

  const refreshEvents = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const selectEvent = (eventId, hour) => {
    setPreSelectedEvents(prev => ({
      ...prev,
      [hour]: eventId
    }));
    setSelectedEventIds(prev => new Set([...prev, eventId]));
  };

  const unselectEvent = (eventId, hour) => {
    setPreSelectedEvents(prev => {
      const newEvents = { ...prev };
      if (newEvents[hour]) {
        delete newEvents[hour];
      }
      return newEvents;
    });
    setSelectedEventIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const clearSelections = () => {
    setPreSelectedEvents({});
    setSelectedEventIds(new Set());
  };

  // Função para expandir um horário específico
  const expandHour = (hour) => {
    setExpandedHour(hour);
    // Quando um horário é expandido, fechamos a seção "Meus Eventos"
    setIsSelectedEventsVisible(false);
  };

  // Função para verificar se um horário está expandido
  const isHourExpanded = (hour) => {
    return expandedHour === hour;
  };

  // Função para alternar a visibilidade da seção "Meus Eventos"
  const toggleSelectedEventsVisibility = (isVisible) => {
    setIsSelectedEventsVisible(isVisible);
    // Se a seção "Meus Eventos" estiver sendo aberta, fechamos qualquer programação aberta
    if (isVisible) {
      setExpandedHour(null);
    }
  };

  return (
    <EventsContext.Provider value={{
      refreshTrigger,
      refreshEvents,
      preSelectedEvents,
      setPreSelectedEvents,
      selectedEventIds,
      selectEvent,
      unselectEvent,
      clearSelections,
      expandHour,
      isHourExpanded,
      expandedHour,
      isSelectedEventsVisible,
      toggleSelectedEventsVisibility
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;