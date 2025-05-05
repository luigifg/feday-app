// CheckInExport.jsx - Versão com responsividade melhorada
import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import * as XLSX from "xlsx";
import api from "../../constants/Axios";
import CheckInSelector from "./CheckInSelector";

const CheckInExport = ({
  horariosEvento, 
  events
}) => {
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState("");

  // Estados para filtros de evento
  const filteredEvents = events.filter((event) => event.hour === selectedHour);

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
    setSelectedEvent("");
    setExportResult("");
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    setExportResult("");
  };

  const exportToExcel = async () => {
    if (!selectedHour || !selectedEvent) {
      setExportResult("Selecione o horário e o evento antes de exportar.");
      return;
    }

    setLoading(true);
    setExportResult("");

    try {
      const response = await api.get("/exportCheckIn", {
        params: {
          hour: selectedHour,
          eventId: selectedEvent
        }
      });

      if (response.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setExportResult("Nenhum check-in encontrado para exportar.");
          setLoading(false);
          return;
        }

        // Informações do evento para o nome do arquivo
        const eventInfo = events.find(e => e.id == selectedEvent);
        const horarioInfo = horariosEvento.find(h => h.id == selectedHour);
        const fileName = `CheckIns_${eventInfo?.title || 'Evento'}_${horarioInfo?.label || 'Horario'}.xlsx`;

        // Criar planilha Excel com cabeçalhos personalizados
        const workbook = XLSX.utils.book_new();

        // Preparar os dados com cabeçalhos em português
        const dataWithHeaders = response.data.map(item => ({
          "ID Check-in": item.check_in_id,
          "ID Participante": item.user_id,
          "Nome Completo": item.user_name,
          "Horário": item.hour,
          "ID Palestra": item.event_id,
          "Título da Palestra": item.event_title,
          "Sala": item.room,
          "Palestrante": item.speaker,
          "E-mail": item.email,
          "Empresa": item.company,
          "Cargo": item.position
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataWithHeaders);

        // Adicionar largura às colunas
        const colWidths = [
          { wch: 10 },  // ID Check-in
          { wch: 12 },  // ID Participante
          { wch: 40 },  // Nome Completo
          { wch: 10 },  // Horário
          { wch: 12 },  // ID Palestra
          { wch: 50 },  // Título da Palestra
          { wch: 15 },  // Sala
          { wch: 40 },  // Palestrante
          { wch: 40 },  // E-mail
          { wch: 40 },  // Empresa
          { wch: 40 }   // Cargo
        ];
        worksheet['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Check-ins");
        XLSX.writeFile(workbook, fileName);

        setExportResult(`${response.data.length} registros exportados com sucesso!`);
      } else {
        setExportResult("Formato de resposta inválido.");
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      setExportResult(`Erro ao exportar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 md:gap-6 flex-col items-center mt-6 max-w-md mx-auto">
      <p className="text-lg border-l-4 border-orange-400 pl-4 self-start">
        Exportar check-ins para Excel
      </p>

      {/* Seletor de horário e evento - reutilizando componente existente */}
      <CheckInSelector
        selectedHour={selectedHour}
        selectedEvent={selectedEvent}
        handleHourChange={handleHourChange}
        handleEventChange={handleEventChange}
        horariosEvento={horariosEvento}
        filteredEvents={filteredEvents}
        favorites={{}}
        resetCheckInForm={() => {
          setSelectedHour("");
          setSelectedEvent("");
          setExportResult("");
        }}
      />

      {/* Botão de exportação */}
      <button
        onClick={exportToExcel}
        disabled={!selectedHour || !selectedEvent || loading}
        className="w-full p-4 rounded-lg bg-orange-600 text-white font-semibold
          hover:bg-orange-500 transition-colors shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full" />
            Processando...
          </>
        ) : (
          <>
            <FileText size={20} />
            Exportar Check-ins para Excel
          </>
        )}
      </button>

      {/* Resultado da exportação */}
      {exportResult && (
        <div className={`w-full p-3 rounded-lg text-sm font-medium ${
          exportResult.includes("sucesso") 
            ? "bg-green-600 text-white" 
            : "bg-yellow-600 text-white"
        }`}>
          {exportResult.includes("sucesso") ? (
            <div className="flex items-center">
              <Download size={18} className="mr-2" />
              {exportResult}
            </div>
          ) : (
            exportResult
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInExport;