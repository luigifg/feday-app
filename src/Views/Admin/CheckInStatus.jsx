import React from "react";
import { Check, AlertCircle } from "lucide-react";

/**
 * Componente para mostrar o status atualizado do check-in
 * Versão simplificada e mais compacta
 */
const CheckInStatus = ({
  successMessage,
  error,
  scannedUser,
  selectedEvent,
  events,
  resetScanner,
}) => {
  // Encontrar informações do evento
  const eventDetails =
    selectedEvent && events
      ? events.find(
          (e) => e.id === selectedEvent || e.id === parseInt(selectedEvent)
        )
      : null;

  const eventName = eventDetails?.title || "Evento selecionado";
  const eventRoom = eventDetails?.room || "Sala não informada";

  // Se não houver mensagens, exibir apenas informações básicas
  if (!successMessage && !error && !scannedUser) {
    return (
      <div className="w-full my-3 p-3 bg-gray-800 rounded-lg">
        <div className="border-l-4 border-green-500 pl-3 text-sm">
          <h4 className="font-semibold text-white">Evento:</h4>
          <p className="text-gray-300">{eventName}</p>
          <p className="text-gray-400 text-xs">Sala: {eventRoom}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-3">
      {/* Card com informações do evento */}
      <div className="p-3 bg-gray-800 rounded-lg">
        {/* Detalhes do evento */}
        <div className="border-l-4 border-green-500 pl-3 text-sm mb-3">
          <h4 className="font-semibold text-white">Evento:</h4>
          <p className="text-gray-300">{eventName}</p>
          <p className="text-gray-400 text-xs">Sala: {eventRoom}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInStatus;