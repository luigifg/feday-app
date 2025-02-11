import React from "react";
import { File, MapPin, User, X } from "lucide-react";
import { getRoomColor } from "../../data/EventsData";

const EventItem = ({ event, isSelected, onSelect, onRemove, showRemoveButton }) => {
  const handleClick = () => {
    if (!showRemoveButton) { // Allow toggle if not in selected events section 
      onSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
        isSelected ? "scale-[1.02]" : ""
      }`}
    >
      <div
        className="p-[2px] rounded-3xl relative"
        style={{
          background: isSelected
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
            ${isSelected ? "bg-blue-50 border-2 border-blue-500" : "bg-white"}
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {event.title}
              </h2>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 text-sm font-semibold">
                  {event.palestrante}
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
            <span className="text-gray-600 text-sm">Descrição: {event.description}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div
                className={`p-1.5 px-3 rounded-xl text-white font-semibold ${getRoomColor(
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
        </div>
      </div>
    </div>
  );
};

export default EventItem;