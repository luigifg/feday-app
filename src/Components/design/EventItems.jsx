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
  specialEvent = false, // Nova prop para identificar eventos especiais
  isOtherSelected = false,
}) => {
  const [removeMode, setRemoveMode] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (!isSaved && !showRemoveButton) {
      onSelect();
    }
  };

  // Função para abrir o modal da foto
  const openPhotoModal = (e) => {
    e.stopPropagation();

    // Só abre o modal se o palestrante estiver selecionado ou se não houver seleção
    if (isSelected || isPreSelected || (!isSaved && !isOtherSelected)) {
      setPhotoModalOpen(true);
    }
  };
  // Função para fechar o modal da foto
  const closePhotoModal = () => {
    setPhotoModalOpen(false);
  };

  // Simplificando a lógica de seleção
  const isEventSelected = isSelected || isPreSelected;

  // Define a cor base do gradiente com base no tipo de evento (versão mais sutil)
  const getGradientColors = () => {
    if (specialEvent) {
      return isHovered
        ? ["#FFD700", "#FFA700", "#FF8C00"] // Amarelo para laranja (mais sutil)
        : ["#FFD700", "#FFA500", "#FF8C00"]; // Dourado para laranja
    } else if (isSelected || isPreSelected) {
      return isHovered
        ? ["#2E8B57", "#1D8348", "#00A550"] // Verde selecionado (mais sutil)
        : ["#00AF3F", "#007934", "#007934"]; // Verde padrão para selecionado
    } else {
      return isHovered
        ? ["#3CB371", "#2E8B57", "#00A550"] // Verde hover (mais sutil)
        : ["#2E8B57", "#228B22", "#008000"]; // Verde padrão
    }
  };

  const [color1, color2, color3] = getGradientColors();

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
          isMarkedForDeletion ? "opacity-50" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? "scale(1.03)" : 
                   (isSelected || isPreSelected) ? "scale(1.01)" : "scale(1)",
          transition: "all 0.3s ease-out",
          position: "relative",
        }}
      >
        <div
          className="rounded-3xl relative"
          style={{
            padding: isHovered ? "3px" : "2px",
            background: isHovered
              ? `linear-gradient(120deg, ${color1}, ${color2}, ${color3})`
              : `linear-gradient(to top left, ${color1}, ${color2}, ${color3})`,
            boxShadow: isHovered
              ? (specialEvent 
                 ? "0 6px 12px -3px rgba(255, 193, 7, 0.15), 0 3px 5px -3px rgba(255, 193, 7, 0.2)"
                 : (isSelected || isPreSelected)
                 ? "0 6px 12px -3px rgba(0, 128, 0, 0.15), 0 3px 5px -3px rgba(0, 128, 0, 0.2)"
                 : "0 6px 12px -3px rgba(0, 128, 0, 0.1), 0 3px 5px -3px rgba(0, 128, 0, 0.15)")
              : "",
            transition: "all 0.3s ease-out",
          }}
        >
          {isSelected && showRemoveButton && !specialEvent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-2 -left-2 z-10 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div
            className="rounded-3xl p-4 relative overflow-hidden"
            style={{
              background: isHovered
                ? specialEvent
                  ? "#FFFDF5" // Amarelo muito suave
                  : isSelected || isPreSelected
                  ? "#F4FBF6" // Verde muito suave para selecionado
                  : "#F8FBF8" // Verde mais suave ainda
                : specialEvent
                ? "#FFFDF0" // Amarelo suave
                : isSelected || isPreSelected
                ? "#F0F9F2" // Verde suave
                : "white",
              border: isHovered 
                ? specialEvent
                  ? "2px solid #FFBE0B" // Amarelo um pouco mais forte
                  : isSelected || isPreSelected
                  ? "2px solid #1D8348" // Verde médio
                  : "2px solid #3CB371" // Verde médio
                : specialEvent
                ? "2px solid #FFD700" // Dourado
                : isSelected || isPreSelected
                ? "2px solid #00AF3F" // Verde selecionado
                : "2px solid transparent", // Sem borda
              boxShadow: isHovered
                ? "inset 0 0 8px rgba(0, 128, 0, 0.05)"
                : "none",
              transition: "all 0.3s ease-out",
            }}
          >
            {/* Efeito de brilho no canto (mais sutil) */}
            {isHovered && (
              <div 
                className="absolute"
                style={{
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
                  transform: "rotate(30deg)",
                  opacity: 0.3,
                  pointerEvents: "none",
                  mixBlendMode: "soft-light",
                }}
              />
            )}

            {/* Conteúdo do card com imagem clicável */}
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 
                  className="text-sm sm:text-md lg:text-mdp font-bold max-w-[12rem] md:max-w-[22rem] mb-6 whitespace-pre-line h-[5rem] line-clamp-5 overflow-hidden transition-all duration-300"
                  style={{
                    color: isHovered ? "#1D8348" : "#333333",
                    textShadow: isHovered ? "0 1px 1px rgba(0,0,0,0.03)" : "none"
                  }}
                >
                  {event.title}
                </h2>
              </div>
              {/* Imagem clicável com tamanho responsivo */}
              <div
                className={`flex-shrink-0 ${
                  isSelected || isPreSelected || (!isSaved && !isOtherSelected)
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } rounded-full overflow-hidden ml-2 w-[75px] h-[75px] transition-all duration-300`}
                style={{
                  border: isHovered
                    ? `2px solid ${specialEvent ? "#FFBE0B" : "#1D8348"}`
                    : `2px solid ${specialEvent ? "#FFD700" : "#3CB371"}`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  boxShadow: isHovered
                    ? `0 3px 8px ${specialEvent ? "rgba(255, 193, 7, 0.2)" : "rgba(0, 128, 0, 0.15)"}`
                    : "none"
                }}
                onClick={openPhotoModal}
              >
                <div className="w-full h-full relative">
                  <img
                    src={event.image}
                    alt={event.palestrante}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      objectPosition: "center",
                      filter: isHovered ? "brightness(1.05) contrast(1.03)" : "none"
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Informações de sala e fabricante em formato vertical */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <div className="w-24 h-12 flex items-center">
                  {event.companyLogo ? (
                    <a
                      href={event.companyUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={event.companyLogo}
                        alt="Company Logo"
                        className="max-w-20 max-h-10 object-contain cursor-pointer transition-all duration-300"
                        style={{
                          opacity: isHovered ? 1 : 0.95,
                          transform: isHovered ? "scale(1.03)" : "scale(1)"
                        }}
                      />
                    </a>
                  ) : (
                    <div className="w-20 h-10">
                      {/* Espaço vazio reservado para manter a consistência do layout */}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm md:text-mdp">
                <User 
                  className="w-5 h-5 transition-all duration-300" 
                  style={{
                    color: isHovered ? "#1D8348" : "#43A047",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    filter: isHovered ? "drop-shadow(0 1px 1px rgba(0,100,0,0.2))" : "none"
                  }}
                />
                <span className="text-gray-600">
                  Palestrante:{" "}
                  <span 
                    className="font-semibold transition-all duration-300"
                    style={{
                      color: isHovered ? "#1D8348" : "inherit",
                      textShadow: isHovered ? "0 1px 1px rgba(0,0,0,0.03)" : "none",
                    }}
                  >
                    {event.palestrante}
                  </span>
                </span>
              </div>

              {/* Informação da sala */}
              <div className="flex items-center gap-2">
                <MapPin 
                  className="w-5 h-5 transition-all duration-300"
                  style={{
                    color: isHovered ? "#1D8348" : "#43A047",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    filter: isHovered ? "drop-shadow(0 1px 1px rgba(0,100,0,0.2))" : "none"
                  }}
                />
                <span className="text-gray-600 text-sm">Sala:</span>
                <div
                  className={`p-1.5 px-3 rounded-xl text-sm text-white font-semibold transition-all duration-300 ${getRoomColor(
                    event.room
                  )}`}
                  style={{
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    boxShadow: isHovered ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                    fontWeight: isHovered ? "600" : "600"
                  }}
                >
                  {event.room}
                </div>
              </div>
            </div>

            {/* Botões com estados dinâmicos - AJUSTADOS PARA MANTEREM TAMANHO FIXO E SEREM MAIS SUTIS */}
            <div className="flex justify-center gap-3 mt-5">
              {buttonsState === "selected" ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelSelection && onCancelSelection();
                    }}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-red-600 transition-colors duration-300 h-10"
                    style={{
                      backgroundColor: isHovered ? "#E53935" : "#EF5350",
                      boxShadow: isHovered ? "0 2px 4px rgba(211, 47, 47, 0.2)" : "none"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveEvent && onSaveEvent();
                    }}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10"
                    style={{
                      backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                      boxShadow: isHovered ? "0 2px 4px rgba(46, 125, 50, 0.2)" : "none"
                    }}
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
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-blue-600 transition-colors duration-300 h-10"
                      style={{
                        backgroundColor: isHovered ? "#1976D2" : "#2196F3",
                        boxShadow: isHovered ? "0 2px 4px rgba(21, 101, 192, 0.2)" : "none"
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveConfirm && onRemoveConfirm();
                        setRemoveMode(false);
                      }}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-red-700 transition-colors duration-300 h-10"
                      style={{
                        backgroundColor: isHovered ? "#D32F2F" : "#E53935",
                        boxShadow: isHovered ? "0 2px 4px rgba(198, 40, 40, 0.2)" : "none"
                      }}
                    >
                      Confirmar
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
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10 flex items-center justify-center"
                      style={{
                        backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                        boxShadow: isHovered ? "0 2px 4px rgba(46, 125, 50, 0.2)" : "none"
                      }}
                    >
                      Descrição
                    </button>
                    {!specialEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemoveMode(true);
                        }}
                        className="bg-red-600 text-white px-1 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-red-700 transition-colors duration-300 h-10 flex items-center justify-center whitespace-nowrap"
                        style={{
                          backgroundColor: isHovered ? "#D32F2F" : "#E53935",
                          boxShadow: isHovered ? "0 2px 4px rgba(198, 40, 40, 0.2)" : "none"
                        }}
                      >
                        Remover Evento
                      </button>
                    )}
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
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10"
                    style={{
                      backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                      boxShadow: isHovered ? "0 2px 4px rgba(46, 125, 50, 0.2)" : "none"
                    }}
                  >
                    Descrição
                  </button>

                  {!showRemoveButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                      }}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-blue-600 transition-colors duration-300 h-10"
                      style={{
                        backgroundColor: isHovered ? "#1976D2" : "#2196F3",
                        boxShadow: isHovered ? "0 2px 4px rgba(21, 101, 192, 0.2)" : "none"
                      }}
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