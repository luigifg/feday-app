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

  return (
    <EventsContext.Provider value={{
      refreshTrigger,
      refreshEvents,
      preSelectedEvents,
      setPreSelectedEvents,
      selectedEventIds,
      selectEvent,
      unselectEvent,
      clearSelections
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;