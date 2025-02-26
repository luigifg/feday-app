import React, { useState } from "react";
import { File, MapPin, User, X } from "lucide-react";
import { getRoomColor } from "../../data/EventsData";

const EventItem = ({
  event,
  isSelected,
  onSelect,
  onRemove,
  showRemoveButton,
  isMarkedForDeletion,
  isPreSelected,
  isSaved,
  onOpenModal,
  buttonsState = "normal", // normal, selected
  onCancelSelection,
  onSaveEvent,
  onRemoveConfirm,
  onRemoveCancel
}) => {
  const [removeMode, setRemoveMode] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (!isSaved && !showRemoveButton) {
      onSelect();
    }
  };

  // Simplificando a lógica de seleção
  const isEventSelected = isSelected || isPreSelected;

  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isSelected || isPreSelected ? "scale-[1.02]" : ""
      } ${isMarkedForDeletion ? "opacity-50" : ""}`}
    >
      <div
        className="p-[2px] rounded-3xl relative"
        style={{
          background:
            isSelected || isPreSelected
              ? "linear-gradient(to top left, #4299E1, #3182CE, #2C5282)"
              : "linear-gradient(to top left, #2E8B57, #228B22, #008000)",
        }}
      >
        {isSelected && showRemoveButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -left-2 z-20 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div
          className={`
            rounded-3xl p-4 relative overflow-hidden
            ${
              isSelected || isPreSelected
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white"
            }
          `}
        >
          {/* Conteúdo do card permanece o mesmo */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              <h2 className="text-sm sm:text-md font-bold max-w-[14rem] md:max-w-[17rem] text-gray-800 mb-4">
                {event.title}
              </h2>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">
                Nome: <span className="font-semibold">{event.palestrante}</span>
                </span>
              </div>
            </div>
            <div className="w-16 h-16 ml-4">
              <img
                src={event.image}
                alt={event.palestrante}
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <File className="w-5 h-5 text-green-600" />
            <span className="text-gray-600 text-sm">
              Cargo: <span className="font-semibold">{event.position}</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div
                className={`p-1.5 px-3 rounded-xl text-sm text-white font-semibold ${getRoomColor(
                  event.room
                )}`}
              >
                {event.room}
              </div>
            </div>
            <div className="w-18 h-14">
              <img
                src={event.companyLogo}
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Botões com estados dinâmicos */}
          <div className="flex justify-center gap-3 mt-4">
            {buttonsState === "selected" ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelSelection && onCancelSelection();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-red-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveEvent && onSaveEvent();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-green-700"
                >
                  Salvar
                </button>
              </>
            ) : isSaved ? (
              // Se o evento está salvo, mostramos os botões de detalhes e remoção
              removeMode ? (
                // Modo de confirmação de remoção
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRemoveMode(false);
                      onRemoveCancel && onRemoveCancel();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-green-700"
                  >
                    Cancelar Remoção
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveConfirm && onRemoveConfirm();
                      setRemoveMode(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-red-700"
                  >
                    Confirmar Remoção
                  </button>
                </>
              ) : (
                // Modo normal (ver detalhes e remover)
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal && onOpenModal(event);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-blue-600"
                  >
                    Ver detalhes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRemoveMode(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-red-600"
                  >
                    Remover Evento
                  </button>
                </>
              )
            ) : (
              // Caso contrário, mostramos os botões padrão (ver detalhes e selecionar)
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal && onOpenModal(event);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-blue-600"
                >
                  Ver detalhes
                </button>

                {!showRemoveButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-green-600"
                  >
                    Selecionar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;