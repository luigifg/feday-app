import React, { useState, useEffect, useRef } from "react";
import { Check, Wifi, Database, X, AlertCircle, Search } from "lucide-react";
import api from "../../constants/Axios";
import { horariosEvento, events } from "../../data/speakerData";

const NFCWriterAdmin = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(true);
  const nfcAbortController = useRef(null);

  // Função auxiliar para verificar se o NFC está ativado
  // Lida com diferentes formatos: booleano ou número (0/1)
  const isNfcActivated = (user) => {
    if (!user) return false;
    
    // Verificar no campo correto: nfcActivated em vez de nfc_activated
    
    // Se for booleano, verificamos diretamente
    if (typeof user.nfcActivated === 'boolean') {
      return user.nfcActivated;
    }
    
    // Se for número, consideramos 1 como ativado
    if (typeof user.nfcActivated === 'number') {
      return user.nfcActivated === 1;
    }
    
    // Se for string, verificamos se é '1', 'true', etc.
    if (typeof user.nfcActivated === 'string') {
      return user.nfcActivated === '1' || 
             user.nfcActivated.toLowerCase() === 'true';
    }
    
    // Por padrão, consideramos não ativado
    return false;
  };

  // Verificar suporte a NFC no navegador
  useEffect(() => {
    setNfcSupported(
      typeof window !== "undefined" && 
      "NDEFReader" in window
    );
  }, []);

  // Buscar todos os usuários
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user");
        
        if (response.status === 200) {
          // Garantir que temos um array, mesmo se vier em outro formato
          let usersData = response.data;
          
          // Verificar formato e converter para array se necessário
          if (!Array.isArray(usersData)) {
            // Se vier como objeto com propriedade data (comum em algumas APIs)
            if (usersData.data && Array.isArray(usersData.data)) {
              usersData = usersData.data;
            } 
            // Se vier como objeto com propriedades numéricas (como um objeto JSON que parece array)
            else if (typeof usersData === 'object' && usersData !== null) {
              usersData = Object.values(usersData);
            } 
            // Último recurso: forçar array vazio
            else {
              console.error("Formato de dados de usuários não reconhecido:", usersData);
              usersData = [];
            }
          }
          
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        setError("Erro ao carregar usuários. Tente novamente.");
        setUsers([]); // Garantir que sempre temos array mesmo em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Efeito para limpar mensagens após 3 segundos
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Parar gravação NFC quando componente desmontar
  useEffect(() => {
    return () => {
      stopNfcWriting();
    };
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
    setSelectedEvent(""); // Resetar evento ao mudar horário
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Função para gerar vCard para o usuário selecionado
  const generateVCardData = (user) => {
    if (!user) return "";

    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:;${user.name};;;`,
      `FN:${user.name}`,
      `TEL;TYPE=CELL:${user.phone || ""}`,
      `EMAIL;TYPE=INTERNET:${user.email}`,
      `ORG:${user.company || ""}`,
      "END:VCARD",
    ].join("\n");

    return vCard;
  };

  const startNfcWriting = async () => {
    if (!nfcSupported) {
      setError("NFC não é suportado neste dispositivo ou navegador");
      return;
    }

    if (!selectedUser || !selectedHour || !selectedEvent) {
      setError("Selecione usuário, horário e evento antes de gravar");
      return;
    }

    try {
      setIsWriting(true);
      
      // Obter dados do usuário selecionado
      const user = users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser));
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Preparar dados de identificação para o check-in
      const idData = JSON.stringify({
        id: user.id,
        name: user.name
      });

      // Gerar o vCard para compartilhamento de contato
      const vCardData = generateVCardData(user);

      const abortController = new AbortController();
      nfcAbortController.current = abortController;

      const ndef = new NDEFReader();
      setSuccessMessage("Aproxime o cartão NFC para gravar os dados do usuário");
      
      // Gravar múltiplos records no cartão NFC
      await ndef.write(
        {
          records: [
            // Record 1: Dados de identificação para check-in (JSON)
            {
              recordType: "text",
              mediaType: "application/json",
              data: idData
            },
            // Record 2: vCard para compartilhamento de contato
            {
              recordType: "text",
              mediaType: "text/vcard",
              data: vCardData
            }
          ]
        },
        { signal: abortController.signal }
      );

      // Atualizar o status do NFC no banco de dados para 1 (ativado)
      // Usando o nome correto do campo: nfcActivated
      try {
        await api.patch(`/user/${user.id}`, {
          nfcActivated: 1  // Nome do campo correto
        });
        
        // Atualizar a lista de usuários localmente
        setUsers(users.map(u => 
          (u.id === user.id || u.id === parseInt(user.id)) ? {...u, nfcActivated: 1} : u
        ));
        
        setSelectedUser("");
        setSuccessMessage(`Cartão NFC gravado com sucesso para ${user.name}!`);
        refreshUsers(); // Atualizar a lista após gravar
      } catch (apiError) {
        console.error("Erro ao atualizar status do usuário:", apiError);
        setError("Cartão gravado, mas houve erro ao atualizar banco de dados");
      }
      
    } catch (error) {
      console.error("Erro ao gravar NFC:", error);
      if (error.name === "AbortError") {
        setError("Gravação NFC cancelada");
      } else if (error.name === "NotSupportedError") {
        setError("Dispositivo não suporta a operação NFC solicitada");
      } else if (error.name === "NotReadableError") {
        setError("Cartão NFC não pode ser lido ou está danificado");
      } else if (error.name === "NetworkError") {
        setError("Problema de rede ao gravar NFC");
      } else {
        setError("Erro ao gravar NFC: " + error.message);
      }
    } finally {
      setIsWriting(false);
      stopNfcWriting();
    }
  };

  const stopNfcWriting = () => {
    if (nfcAbortController.current) {
      nfcAbortController.current.abort();
      nfcAbortController.current = null;
    }
  };

  // Filtra eventos pelo horário selecionado
  const filteredEvents = selectedHour
    ? events.filter(event => event.hour === selectedHour)
    : [];

  // Filtra usuários com base na busca e status NFC
  // Garantimos que users é sempre um array antes de chamar .filter
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        if (!user) return false;
        const nameMatch = user.name?.toLowerCase().includes((searchTerm || "").toLowerCase());
        // Usamos a função auxiliar para verificar o status do NFC
        const statusMatch = !showOnlyPending || !isNfcActivated(user);
        return nameMatch && statusMatch;
      })
    : [];

  // Função para forçar recarregamento dos dados
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user");
      
      if (response.status === 200) {
        let usersData = response.data;
        
        if (!Array.isArray(usersData)) {
          if (usersData.data && Array.isArray(usersData.data)) {
            usersData = usersData.data;
          } else if (typeof usersData === 'object' && usersData !== null) {
            usersData = Object.values(usersData);
          } else {
            usersData = [];
          }
        }
        
        setUsers(usersData);
        setSuccessMessage("Lista de usuários atualizada!");
      }
    } catch (error) {
      console.error("Erro ao recarregar usuários:", error);
      setError("Erro ao recarregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 max-w-md mx-auto">
      <p className="text-lg border-l-4 border-blue-400 pl-4 mb-6">
        Grave cartões NFC para os participantes
      </p>
      
      {successMessage && (
        <div className="w-full p-4 mb-4 bg-emerald-500 text-white rounded-lg flex items-center gap-2">
          <Check size={24} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="w-full p-4 mb-4 bg-red-500 text-white rounded-lg flex items-center gap-2">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {nfcSupported === false && (
        <div className="w-full p-4 mb-4 bg-yellow-600 text-white rounded-lg text-sm">
          <p className="font-medium">NFC não suportado neste dispositivo ou navegador</p>
          <p className="mt-1">NFC funciona apenas em Chrome/Edge em dispositivos Android com NFC. Não funciona em iOS.</p>
        </div>
      )}

      {/* Botão de recarregar */}
      <button
        onClick={refreshUsers}
        className="w-full mb-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
      >
        <Database className="mr-2" size={18} />
        Recarregar lista de usuários
      </button>

      {/* Filtro de busca */}
      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar participante..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                  hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                  transition-all duration-300 outline-none"
        />
      </div>

      {/* Toggle para mostrar apenas pendentes */}
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="checkbox"
          id="show-pending"
          checked={showOnlyPending}
          onChange={() => setShowOnlyPending(!showOnlyPending)}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="show-pending" className="text-sm text-gray-300">
          Mostrar apenas participantes sem cartão NFC
        </label>
      </div>

      <div className="flex flex-col gap-4">
        {/* Seleção de usuário */}
        <div className="relative w-full">
          <select
            value={selectedUser}
            onChange={handleUserChange}
            disabled={loading || isWriting}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                    transition-all duration-300 outline-none appearance-none 
                    cursor-pointer shadow-lg backdrop-blur-sm disabled:opacity-60"
          >
            <option value="" className="bg-gray-800">
              {loading ? "Carregando usuários..." : "Selecione um participante"}
            </option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id} className="bg-gray-800">
                {user.name} {isNfcActivated(user) ? '(Cartão já gravado)' : ''}
              </option>
            ))}
          </select>
          <Database className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Seleção de horário */}
        <div className="relative w-full">
          <select
            value={selectedHour}
            onChange={handleHourChange}
            disabled={!selectedUser || isWriting}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                    transition-all duration-300 outline-none appearance-none 
                    cursor-pointer shadow-lg backdrop-blur-sm disabled:opacity-60"
          >
            <option value="" className="bg-gray-800">
              Selecione um horário
            </option>
            {horariosEvento.map((horario) => (
              <option key={horario.id} value={horario.id} className="bg-gray-800">
                {horario.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de evento */}
        <div className="relative w-full">
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            disabled={!selectedHour || isWriting}
            className="w-full p-4 rounded-lg bg-gray-800 text-white border-2 border-gray-700 
                    hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                    transition-all duration-300 outline-none appearance-none 
                    cursor-pointer shadow-lg backdrop-blur-sm disabled:opacity-60"
          >
            <option value="" className="bg-gray-800">
              {!selectedHour
                ? "Primeiro selecione um horário"
                : "Selecione um evento"}
            </option>
            {filteredEvents.map((event) => (
              <option key={event.id} value={event.id} className="bg-gray-800">
                {event.title} - Sala: {event.room}
              </option>
            ))}
          </select>
        </div>

        {/* Pré-visualização do vCard */}
        {selectedUser && (
          <div className="p-4 bg-gray-700 rounded-lg text-sm text-gray-300 my-2">
            <h3 className="font-semibold mb-2 text-white">Dados que serão gravados no cartão:</h3>
            <div className="overflow-x-auto whitespace-pre-wrap font-mono text-xs mt-1">
              <p className="mb-2 font-semibold text-blue-300">1. Dados para Check-in:</p>
              {users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser)) ? (
                <pre className="pl-4 text-xs">
                  {JSON.stringify({
                    id: users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser)).id,
                    name: users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser)).name
                  }, null, 2)}
                </pre>
              ) : null}
              
              <p className="mt-3 mb-2 font-semibold text-blue-300">2. vCard para Networking:</p>
              {users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser)) ? (
                <pre className="pl-4 text-xs">
                  {generateVCardData(users.find(u => u.id === selectedUser || u.id === parseInt(selectedUser)))
                    .split('\n')
                    .map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                </pre>
              ) : null}
            </div>
          </div>
        )}

        {isWriting ? (
          <div className="w-full p-8 bg-gray-800 text-white rounded-lg text-center">
            <div className="animate-pulse mb-4">
              <Wifi size={64} className="mx-auto text-blue-400" />
            </div>
            <p className="text-lg font-medium mb-2">Aguardando cartão NFC</p>
            <p className="text-sm text-gray-300">Aproxime o cartão NFC do dispositivo para gravação</p>
            <button
              onClick={stopNfcWriting}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={startNfcWriting}
            disabled={!selectedUser || !selectedHour || !selectedEvent || !nfcSupported}
            className="w-full p-4 rounded-lg bg-blue-600 text-white font-semibold
                     hover:bg-blue-500 transition-colors duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <Wifi size={20} />
            Gravar Cartão NFC
          </button>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <p className="text-white">
              {searchTerm 
                ? "Nenhum participante encontrado com este critério de busca" 
                : "Não há participantes pendentes para gravação de cartão NFC"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFCWriterAdmin;