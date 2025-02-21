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
  const [preSelectedEvents, setPreSelectedEvents] = useState({}); // Para controlar eventos pré-selecionados

  const refreshEvents = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <EventsContext.Provider value={{
      refreshTrigger,
      refreshEvents,
      preSelectedEvents,
      setPreSelectedEvents
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsProvider;