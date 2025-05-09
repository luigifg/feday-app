import React, { useState, useEffect } from "react";
import { Factory, MapPin, User, X, Loader  } from "lucide-react";
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
  participantsCount = 0,
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
  specialEvent = false,
  isOtherSelected = false,
  isViewOnly = false,
  isHandsOn = false, // Indica se o evento é hands-on
  restrictSelection = false, // Nova prop que controla se a seleção deve ser restrita
  isAdmin = false,
  isLoading = false,
}) => {
  const [removeMode, setRemoveMode] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Verifica se o evento é exclusivo para mulheres
  const isFemaleOnlyEvent = event.femaleOnly;

  const isFull =
    event.isFull !== undefined
      ? event.isFull
      : event.maxParticipants > 0 && participantsCount >= event.maxParticipants;

  // Determina se o evento é selecionável (agora considerando também se está lotado)
  const isSelectable = (!restrictSelection || isHandsOn) && !isFull;

  const handleClick = (e) => {
    e.preventDefault();
    // Permite seleção se não houver restrição ou se for hands-on quando há restrição
    if (!isSaved && !showRemoveButton && isSelectable) {
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
        ? ["#22c55e", "#16a34a", "#15803d"] // Verde mais forte para hover
        : ["#4ade80", "#22c55e", "#16a34a"]; // Verde brilhante para normal
    } else if (isHandsOn) {
      return isHovered
        ? ["#b91c1c", "#991b1b", "#7f1d1d"] // Vermelho mais forte para hover
        : ["#dc2626", "#b91c1c", "#991b1b"]; // Vermelho para eventos hands-on
    } else if (isFemaleOnlyEvent) {
      return isHovered
        ? ["#ec4899", "#db2777", "#be185d"] // Rosa mais forte para hover
        : ["#f472b6", "#ec4899", "#db2777"]; // Rosa para eventos femininos
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
          transform: isHovered
            ? "scale(1.03)"
            : isSelected || isPreSelected
            ? "scale(1.01)"
            : "scale(1)",
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
              ? specialEvent
                ? "0 6px 12px -3px rgba(34, 197, 94, 0.15), 0 3px 5px -3px rgba(34, 197, 94, 0.2)"
                : isFemaleOnlyEvent
                ? "0 6px 12px -3px rgba(236, 72, 153, 0.15), 0 3px 5px -3px rgba(236, 72, 153, 0.2)"
                : isSelected || isPreSelected
                ? "0 6px 12px -3px rgba(0, 128, 0, 0.15), 0 3px 5px -3px rgba(0, 128, 0, 0.2)"
                : "0 6px 12px -3px rgba(0, 128, 0, 0.1), 0 3px 5px -3px rgba(0, 128, 0, 0.15)"
              : "",
            transition: "all 0.3s ease-out",
          }}
        >
          {/* Tag para eventos exclusivos para mulheres */}
          {isFemaleOnlyEvent && (
            <div className="absolute -top-3 left-2 z-10 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {isViewOnly
                ? "Exclusivo para Mulheres"
                : "Exclusivo para Mulheres"}
            </div>
          )}
          {/* Tag para eventos hands-on */}
          {isHandsOn && (
            <div
              className={`absolute -top-3 ${
                isFemaleOnlyEvent ? "left-32 sm:left-44" : "left-2"
              } z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md `}
            >
              Hands-on
            </div>
          )}
          {isAdmin && event.maxParticipants > 0 && (
            <div
              className="absolute -top-3 right-2 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-md text-white flex items-center"
              style={{
                backgroundColor: isFull
                  ? "#DC2626" // Vermelho quando lotado
                  : participantsCount >= event.maxParticipants * 0.8
                  ? "#F97316" // Laranja quando quase lotado
                  : "#22C55E", // Verde quando tem muitas vagas disponíveis
                transition: "background-color 0.3s ease",
              }}
            >
              <User className="w-3 h-3 mr-1" />
              <span>
                {participantsCount}/{event.maxParticipants}
              </span>
            </div>
          )}
          {!isAdmin && isFull && (
            <div
              className={`absolute -top-3 ${
                isHandsOn && !isFemaleOnlyEvent
                  ? "left-20 sm:left-24"
                  : isFemaleOnlyEvent && !isHandsOn
                  ? "left-32 sm:left-44"
                  : isFemaleOnlyEvent && isHandsOn
                  ? "left-44 sm:left-56"
                  : "left-2"
              } z-10 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md`}
            >
              Lotado
            </div>
          )}
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
                  ? "#F0FFF4" // Verde muito suave para hover
                  : isHandsOn
                  ? "#FEF2F2" // Vermelho muito suave para hover
                  : isFemaleOnlyEvent
                  ? "#FDF2F8" // Rosa muito suave para hover
                  : isSelected || isPreSelected
                  ? "#F4FBF6" // Verde muito suave para selecionado
                  : "#F8FBF8" // Verde mais suave ainda
                : specialEvent
                ? "#ECFDF5" // Verde suave
                : isHandsOn
                ? "#FEF2F2" // Vermelho suave
                : isFemaleOnlyEvent
                ? "#FCE7F3" // Rosa suave
                : isSelected || isPreSelected
                ? "#F0F9F2" // Verde suave
                : "white",
              border: isHovered
                ? specialEvent
                  ? "2px solid #22c55e" // Verde médio
                  : isHandsOn
                  ? "2px solid #dc2626" // Vermelho médio
                  : isFemaleOnlyEvent
                  ? "2px solid #ec4899" // Rosa médio
                  : isSelected || isPreSelected
                  ? "2px solid #1D8348" // Verde médio
                  : "2px solid #3CB371" // Verde médio
                : specialEvent
                ? "2px solid #4ade80" // Verde brilhante
                : isHandsOn
                ? "2px solid #ef4444" // Vermelho
                : isFemaleOnlyEvent
                ? "2px solid #f472b6" // Rosa
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
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
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
                    color: isHovered
                      ? isFemaleOnlyEvent
                        ? "#be185d" // Rosa escuro
                        : isHandsOn
                        ? "#b91c1c" // Vermelho escuro
                        : "#1D8348" // Verde escuro
                      : "#333333",
                    textShadow: isHovered
                      ? "0 1px 1px rgba(0,0,0,0.03)"
                      : "none",
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
                    ? `2px solid ${
                        isFemaleOnlyEvent
                          ? "#ec4899" // Rosa
                          : isHandsOn
                          ? "#dc2626" // Vermelho
                          : specialEvent
                          ? "#22c55e" // Verde
                          : "#1D8348"
                      }`
                    : `2px solid ${
                        isFemaleOnlyEvent
                          ? "#f472b6" // Rosa
                          : isHandsOn
                          ? "#ef4444" // Vermelho
                          : specialEvent
                          ? "#4ade80" // Verde
                          : "#3CB371"
                      }`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  boxShadow: isHovered
                    ? `0 3px 8px ${
                        isFemaleOnlyEvent
                          ? "rgba(236, 72, 153, 0.2)"
                          : isHandsOn
                          ? "rgba(220, 38, 38, 0.2)"
                          : specialEvent
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(0, 128, 0, 0.15)"
                      }`
                    : "none",
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
                      filter: isHovered
                        ? "brightness(1.05) contrast(1.03)"
                        : "none",
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
                        className="max-w-25 max-h-15 object-contain cursor-pointer transition-all duration-300"
                        style={{
                          opacity: isHovered ? 1 : 0.95,
                          transform: isHovered ? "scale(1.03)" : "scale(1)",
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
                    color: isHovered
                      ? isFemaleOnlyEvent
                        ? "#db2777" // Rosa
                        : isHandsOn
                        ? "#b91c1c" // Vermelho
                        : "#1D8348" // Verde
                      : isFemaleOnlyEvent
                      ? "#ec4899" // Rosa
                      : isHandsOn
                      ? "#dc2626" // Vermelho
                      : "#43A047", // Verde
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    filter: isHovered
                      ? "drop-shadow(0 1px 1px rgba(0,100,0,0.2))"
                      : "none",
                  }}
                />
                <span className="text-gray-600">
                  Palestrante:{" "}
                  <span
                    className="font-semibold transition-all duration-300"
                    style={{
                      color: isHovered
                        ? isFemaleOnlyEvent
                          ? "#be185d" // Rosa escuro
                          : isHandsOn
                          ? "#b91c1c" // Vermelho escuro
                          : "#1D8348" // Verde
                        : "inherit",
                      textShadow: isHovered
                        ? "0 1px 1px rgba(0,0,0,0.03)"
                        : "none",
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
                    color: isHovered
                      ? isFemaleOnlyEvent
                        ? "#db2777" // Rosa
                        : isHandsOn
                        ? "#b91c1c" // Vermelho
                        : "#1D8348" // Verde
                      : isFemaleOnlyEvent
                      ? "#ec4899" // Rosa
                      : isHandsOn
                      ? "#dc2626" // Vermelho
                      : "#43A047", // Verde
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    filter: isHovered
                      ? "drop-shadow(0 1px 1px rgba(0,100,0,0.2))"
                      : "none",
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
                    fontWeight: isHovered ? "600" : "600",
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
                    disabled={isLoading} // Desabilita durante carregamento
                    className={`${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    } bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-red-600 transition-colors duration-300 h-10`}
                    style={{
                      backgroundColor: isHovered ? "#E53935" : "#EF5350",
                      boxShadow: isHovered
                        ? "0 2px 4px rgba(211, 47, 47, 0.2)"
                        : "none",
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin mr-1" />
                        <span>Cancelando...</span>
                      </div>
                    ) : (
                      "Cancelar"
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveEvent && onSaveEvent();
                    }}
                    disabled={isLoading} // Desabilita durante carregamento
                    className={`${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    } bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10`}
                    style={{
                      backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                      boxShadow: isHovered
                        ? "0 2px 4px rgba(46, 125, 50, 0.2)"
                        : "none",
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-4 h-4 animate-spin mr-1" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      "Salvar"
                    )}
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
                      disabled={isLoading} // Desabilita durante carregamento
                      className={`${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      } bg-blue-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-blue-600 transition-colors duration-300 h-10`}
                      style={{
                        backgroundColor: isHovered ? "#2563EB" : "#3B82F6",
                        boxShadow: isHovered
                          ? "0 2px 4px rgba(37, 99, 235, 0.3)"
                          : "none",
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
                      disabled={isLoading} // Desabilita durante carregamento
                      className={`${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      } bg-red-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-red-700 transition-colors duration-300 h-10`}
                      style={{
                        backgroundColor: isHovered ? "#D32F2F" : "#E53935",
                        boxShadow: isHovered
                          ? "0 2px 4px rgba(198, 40, 40, 0.2)"
                          : "none",
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-4 h-4 animate-spin mr-1" />
                          <span>Removendo...</span>
                        </div>
                      ) : (
                        "Confirmar"
                      )}
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
                      disabled={isLoading} // Desabilita durante carregamento
                      className={`${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      } bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10 flex items-center justify-center`}
                      style={{
                        backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                        boxShadow: isHovered
                          ? "0 2px 4px rgba(46, 125, 50, 0.2)"
                          : "none",
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
                        disabled={isLoading} // Desabilita durante carregamento
                        className={`${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        } bg-red-600 text-white px-1 py-2 rounded-lg text-xs sm:text-sm font-medium flex-1 border-2 border-red-700 transition-colors duration-300 h-10 flex items-center justify-center whitespace-nowrap`}
                        style={{
                          backgroundColor: isHovered ? "#D32F2F" : "#E53935",
                          boxShadow: isHovered
                            ? "0 2px 4px rgba(198, 40, 40, 0.2)"
                            : "none",
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
                    disabled={isLoading} // Desabilita durante carregamento
                    className={`${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    } bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 border-green-700 transition-colors duration-300 h-10`}
                    style={{
                      backgroundColor: isHovered ? "#2E7D32" : "#43A047",
                      boxShadow: isHovered
                        ? "0 2px 4px rgba(46, 125, 50, 0.2)"
                        : "none",
                    }}
                  >
                    Descrição
                  </button>

                  {!showRemoveButton && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelectable && !isLoading) {
                          onSelect();
                        }
                      }}
                      disabled={!isSelectable || isLoading} // Desabilita se não é selecionável ou está carregando
                      className={`${
                        isSelectable ? "bg-blue-500" : "bg-gray-400"
                      } ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      } text-white px-3 py-2 rounded-lg text-sm font-medium flex-1 border-2 ${
                        isSelectable ? "border-blue-600" : "border-gray-500"
                      } transition-colors duration-300 h-10`}
                      style={{
                        backgroundColor: isSelectable
                          ? isHovered
                            ? "#2563EB" // Azul mais escuro no hover (blue-600)
                            : "#3B82F6" // Azul vibrante normal (blue-500)
                          : isHovered
                          ? "#757575"
                          : "#9E9E9E",
                        boxShadow: isHovered
                          ? `0 2px 4px rgba(${
                              isSelectable ? "37, 99, 235" : "0, 0, 0"
                            }, 0.2)`
                          : "none",
                        cursor:
                          isSelectable && !isLoading
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-4 h-4 animate-spin mr-1" />
                          <span>Processando...</span>
                        </div>
                      ) : isFull ? (
                        "Esgotado"
                      ) : restrictSelection && !isHandsOn ? (
                        "Indisponível"
                      ) : (
                        "Selecionar"
                      )}
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
