import React, { useState, useEffect } from "react";
import { Factory, MapPin, User, X } from "lucide-react";
import { getRoomColor } from "../../data/speakerData";

const SpeakerPhotoModal = ({ isOpen, onClose, photoUrl }) => {
  // Efeito para desabilitar o scroll quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Limpeza ao desmontar o componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6 text-gray-800" />
        </button>

        {/* Foto do palestrante em formato redondo */}
        <div
          className="relative max-w-lg max-h-full"
          onClick={(e) => e.stopPropagation()} // Evita que o modal feche ao clicar na imagem
        >
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-green-600 shadow-2xl bg-white">
            <img
              src={photoUrl}
              alt="Foto do palestrante"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Modificação do EventItem para incluir a funcionalidade do modal
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
  buttonsState = "normal",
  onCancelSelection,
  onSaveEvent,
  onRemoveConfirm,
  onRemoveCancel,
}) => {
  const [removeMode, setRemoveMode] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (!isSaved && !showRemoveButton) {
      onSelect();
    }
  };

  // Função para abrir o modal da foto
  const openPhotoModal = (e) => {
    e.stopPropagation();
    setPhotoModalOpen(true);
  };

  // Função para fechar o modal da foto
  const closePhotoModal = () => {
    setPhotoModalOpen(false);
  };

  // Simplificando a lógica de seleção
  const isEventSelected = isSelected || isPreSelected;

  return (
    <>
      {/* Modal da foto do palestrante */}
      <SpeakerPhotoModal
        isOpen={photoModalOpen}
        onClose={closePhotoModal}
        photoUrl={event.image}
      />

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
                ? "linear-gradient(to top left, #00AF3F, #007934, #007934)"
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
                  ? "bg-blue-50 border-2 border-green-800"
                  : "bg-white"
              }
            `}
          >
            {/* Conteúdo do card com imagem clicável */}
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-sm sm:text-md lg:text-mdp font-bold max-w-[12rem] md:max-w-[16rem]  text-gray-800 mb-6 whitespace-pre-line">
                  {event.title}
                </h2>
              </div>
              {/* Imagem clicável que abre o modal */}
              <div
                className="w-20 h-18 cursor-pointer rounded-full overflow-hidden border-2 border-green-600 ml-2"
                onClick={openPhotoModal}
              >
                <img
                  src={event.image}
                  alt={event.palestrante}
                  className="w-full h-full object-cover rounded-full shadow-md hover:opacity-90 transition-opacity"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm md:text-mdp mb-4">
              <User className="w-5 h-5 text-green-600" />
              <span className="text-gray-600 ">
                Palestrante:{" "}
                <span className="font-semibold">{event.palestrante}</span>
              </span>
            </div>

            {/* <div className="flex items-center gap-2 mb-4">
              <File className="w-5 h-5 text-green-600" />
              <span className="text-gray-600 text-sm">
                Cargo: <span className="font-semibold">{event.position}</span>
              </span>
            </div> */}

            {/* Informações de sala e fabricante em formato vertical */}
            <div className="flex flex-col gap-3">
              {/* Logo da empresa - sempre em linha separada */}
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">Fabricante:</span>
                <div className="w-16 h-8">
                  <a
                    href={event.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={event.companyLogo}
                      alt="Company Logo"
                      className="w-20 h-30 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>
              {/* Informação da sala */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm">Sala:</span>
                <div
                  className={`p-1.5 px-3 rounded-xl text-sm text-white font-semibold ${getRoomColor(
                    event.room
                  )}`}
                >
                  {event.room}
                </div>
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-blue-600"
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
                      className=" bg-green-600 hover:bg-green-700  text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-green-700 "
                    >
                      Descrição
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemoveMode(true);
                      }}
                      className="bg-red-600  hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-1 border-2 border-red-700"
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
                    className=" bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-green-600 "
                  >
                    Descrição
                  </button>

                  {!showRemoveButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium flex-1 border-2 border-blue-600"
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
    </>
  );
};

export default EventItem;
