import React from "react";
import { Check } from "lucide-react";

/**
 * Componente para seleção de horário e evento para check-in
 */
const CheckInSelector = ({
  selectedHour,
  selectedEvent,
  handleHourChange,
  handleEventChange,
  horariosEvento,
  filteredEvents,
  favorites,
  resetCheckInForm,
}) => {
  return (
    <div className="flex gap-4 flex-col w-full">
      <div className="relative w-full">
        <select
          value={selectedHour}
          onChange={handleHourChange}
          className="w-full p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                   hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 
                   transition-all duration-300 outline-none appearance-none 
                   cursor-pointer shadow-lg backdrop-blur-sm"
        >
          <option value="" className="bg-gray-800">
            Selecione um horário
          </option>
          {horariosEvento.map((horario) => (
            <option
              key={horario.id}
              value={horario.id}
              className="bg-gray-800"
            >
              {horario.label}
            </option>
          ))}
        </select>
        {favorites.hour && selectedHour === favorites.hour && (
          <Check
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
            size={24}
          />
        )}
      </div>

      <div className="relative w-full">
        <select
          value={selectedEvent}
          onChange={handleEventChange}
          className={`w-full p-4 rounded-lg bg-gray-800 text-white border-2 
         hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 
         transition-all duration-300 outline-none appearance-none 
         cursor-pointer shadow-lg backdrop-blur-sm pr-12 
         ${!selectedHour ? "border-gray-700 opacity-50" : "border-gray-700"}`}
          disabled={!selectedHour}
        >
          <option value="" className="bg-gray-800">
            {!selectedHour
              ? "Primeiro selecione um horário"
              : "Selecione um evento"}
          </option>
          {filteredEvents.map((event) => (
            <option
              key={event.id}
              value={event.id}
              className="bg-gray-800"
            >
              (ID: {event.id}) - Sala: {event.room} - {event.title}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {favorites.event && selectedEvent === favorites.event ? (
            <Check className="text-emerald-400" size={24} />
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInSelector;