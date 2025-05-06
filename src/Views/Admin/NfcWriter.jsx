import React, { useState, useEffect, useRef } from "react";
import { Check, Wifi, Database, X, AlertCircle, Search } from "lucide-react";
import api from "../../constants/Axios";

const NFCWriterAdmin = () => {
  // Estados principais
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(true);
  const [nfcStatus, setNfcStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const nfcAbortController = useRef(null);

  // Verificar suporte a NFC no navegador
  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
  }, []);

  // Buscar todos os usuários
  useEffect(() => {
    fetchUsers(1, 400);
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

  // Limpeza completa de recursos quando o componente é desmontado
  useEffect(() => {
    return () => {
      console.log("Desmontando componente NFC Writer, limpando recursos");
      stopNfcWriting();
      setIsWriting(false);
    };
  }, []);

  // Função auxiliar para verificar se o NFC está ativado
  const isNfcActivated = (user) => {
    if (!user) return false;

    if (typeof user.nfcActivated === "boolean") {
      return user.nfcActivated;
    }

    if (typeof user.nfcActivated === "number") {
      return user.nfcActivated === 1;
    }

    if (typeof user.nfcActivated === "string") {
      return (
        user.nfcActivated === "1" || user.nfcActivated.toLowerCase() === "true"
      );
    }

    return false;
  };

  // Remover duplicados
  const removeDuplicates = (users) => {
    const uniqueIds = {};
    return users.filter((user) => {
      if (!user || uniqueIds[user.id]) return false;
      uniqueIds[user.id] = true;
      return true;
    });
  };

  // Buscar usuários - função simplificada
  const fetchUsers = async (page = 1, limit = 400) => {
    setLoading(true);
    try {
      const response = await api.get("/user", {
        params: {
          nfcPending: "true",
          page: page,
          limit: limit,
        },
      });

      if (response.status === 200) {
        let usersData = response.data;

        // Se vier no formato { data: [], total: n }
        if (usersData.data && Array.isArray(usersData.data)) {
          usersData = usersData.data;
        }
        // Se for array direto, usa ele
        else if (Array.isArray(usersData)) {
          // já está ok
        }
        // Senão, tenta converter
        else if (typeof usersData === "object" && usersData !== null) {
          usersData = Object.values(usersData);
        } else {
          usersData = [];
        }

        setUsers(usersData);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Parar gravação NFC
  const stopNfcWriting = () => {
    console.log("Limpando recursos NFC...");
    if (nfcAbortController.current) {
      try {
        nfcAbortController.current.abort();
      } catch (e) {
        console.error("Erro ao abortar controlador NFC:", e);
      }
      nfcAbortController.current = null;
    }
  };

  // Indicador de status do NFC
  const NfcStatusIndicator = () => {
    const statusConfig = {
      idle: {
        bgColor: "bg-gray-500",
        textColor: "text-white",
        icon: <Wifi size={24} />,
      },
      detecting: {
        bgColor: "bg-blue-500",
        textColor: "text-white",
        icon: <Wifi className="animate-pulse" size={24} />,
      },
      reading: {
        bgColor: "bg-yellow-500",
        textColor: "text-white",
        icon: <Wifi className="animate-ping" size={24} />,
      },
      writing: {
        bgColor: "bg-purple-500",
        textColor: "text-white",
        icon: <Wifi className="animate-bounce" size={24} />,
      },
      success: {
        bgColor: "bg-green-500",
        textColor: "text-white",
        icon: <Check size={24} />,
      },
      error: {
        bgColor: "bg-red-500",
        textColor: "text-white",
        icon: <AlertCircle size={24} />,
      },
    };

    const config = statusConfig[nfcStatus] || statusConfig.idle;

    const statusMessages = {
      idle: "NFC pronto para uso",
      detecting: "Procurando cartão NFC...",
      reading: "Cartão NFC detectado! Lendo...",
      writing: "Gravando dados no cartão...",
      success: "Operação concluída com sucesso!",
      error: statusMessage || "Erro na operação NFC",
    };

    return (
      <div
        className={`w-full p-4 ${config.bgColor} ${config.textColor} rounded-lg mb-4 flex items-center`}
      >
        <div className="mr-3">{config.icon}</div>
        <div className="flex-1">
          <div className="font-bold">
            {nfcStatus === "idle" ? "Status NFC" : statusMessages[nfcStatus]}
          </div>
          {statusMessage && nfcStatus !== "error" && (
            <div className="text-sm opacity-90">{statusMessage}</div>
          )}
        </div>
      </div>
    );
  };

  const generateVCardData = (user) => {
    if (!user) return { vcard: "", size: 0 };

    // Função para extrair apenas o primeiro e último nome
    const getFirstAndLastName = (fullName) => {
      if (!fullName) return "";
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length === 1) return nameParts[0];
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      return `${firstName} ${lastName}`;
    };

    // Nome completo para o campo NOTE (essencial para o check-in)
    const fullName = user.name || "";
    const simplifiedName = getFirstAndLastName(fullName);

    // Limite do cartão NFC em bytes (reduzido para 240 para margem de segurança)
    const NFC_LIMIT = 240;

    // Tentar criar o vCard completo com todos os campos
    const completeVCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${simplifiedName}`,
      user.phone ? `TEL;TYPE=CELL:${user.phone}` : "",
      user.company ? `ORG:${user.company}` : "",
      user.email ? `EMAIL;TYPE=WORK:${user.email}` : "",
      user.position ? `TITLE:${user.position}` : "", // Incluir position/title
      `NOTE:${user.id}|${fullName}`, // Nome completo para check-in
      "END:VCARD",
    ]
      .filter((line) => line !== "")
      .join("\r\n");

    const completeBytes = new TextEncoder().encode(completeVCard).length;

    // Se o vCard completo estiver dentro do limite, use-o
    if (completeBytes <= NFC_LIMIT) {
      return {
        vcard: completeVCard,
        size: completeBytes,
        complete: true,
        level: "complete",
      };
    }

    // Se ultrapassar o limite, remover APENAS o campo position/title
    const reducedVCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${simplifiedName}`,
      user.phone ? `TEL;TYPE=CELL:${user.phone}` : "",
      user.company ? `ORG:${user.company}` : "",
      user.email ? `EMAIL;TYPE=WORK:${user.email}` : "",
      // Campo position/title removido
      `NOTE:${user.id}|${fullName}`, // Nome completo para check-in
      "END:VCARD",
    ]
      .filter((line) => line !== "")
      .join("\r\n");

    const reducedBytes = new TextEncoder().encode(reducedVCard).length;

    // Se ainda ultrapassar o limite, mostrar erro
    if (reducedBytes <= NFC_LIMIT) {
      return {
        vcard: reducedVCard,
        size: reducedBytes,
        complete: true,
        level: "reduced",
        removed: ["position"],
      };
    }

    // Se ainda ultrapassar o limite mesmo sem o position/title, mostrar erro
    return {
      vcard: "",
      size: reducedBytes,
      complete: false,
      error: `Dados muito grandes para o cartão NFC: ${reducedBytes}/${NFC_LIMIT} bytes. Mesmo removendo o cargo, o vCard ainda é grande demais.`,
    };
  };

  const atualizarStatusNfc = async (user) => {
    try {
      console.log("Atualizando status NFC para usuário:", user.id);
      await api.patch(`/user/${user.id}`, { nfcActivated: 1 });

      // Atualizar a lista de usuários localmente
      setUsers(
        users.map((u) =>
          u.id === user.id || u.id === parseInt(user.id)
            ? { ...u, nfcActivated: 1 }
            : u
        )
      );

      setSelectedUser("");
      return true;
    } catch (apiError) {
      console.error("Erro ao atualizar status do usuário:", apiError);
      setError("Cartão gravado, mas houve erro ao atualizar banco de dados");
      return false;
    }
  };

  // Função para gravar em cartão já formatado
  const writeToPreFormattedCard = async () => {
    // Limpeza e inicialização
    stopNfcWriting();

    setNfcStatus("detecting");
    setStatusMessage("Iniciando preparação do cartão...");
    setError("");
    setSuccessMessage("");
    setIsWriting(true);

    if (!selectedUser) {
      setNfcStatus("error");
      setError("Selecione um usuário antes de gravar o cartão");
      setIsWriting(false);
      return;
    }

    try {
      const user = users.find(
        (u) => u.id === selectedUser || u.id === parseInt(selectedUser)
      );
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Gerar o vCard e obter informações sobre o tamanho
      const vCardResult = generateVCardData(user);

      // Verificar se tivemos erro de tamanho
      if (!vCardResult.complete || !vCardResult.vcard) {
        setNfcStatus("error");
        setError(
          `Não foi possível gerar vCard: ${
            vCardResult.error || "Erro desconhecido"
          }. Tamanho: ${vCardResult.size} bytes (limite: 240 bytes).`
        );
        setIsWriting(false);
        return;
      }

      // Mensagens personalizadas baseadas nos campos removidos
      let statusMessage = "vCard customizado";
      const levelMessages = {
        complete: "vCard completo com todos os campos",
        reduced: "vCard sem o cargo (position/title)",
        basic: "vCard básico (sem cargo e email)",
        minimal: "vCard mínimo (apenas ID e nome)",
      };

      if (vCardResult.level && levelMessages[vCardResult.level]) {
        statusMessage = levelMessages[vCardResult.level];
      }
      if (vCardResult.removed && vCardResult.removed.length > 0) {
        statusMessage += ` - Campos removidos: ${vCardResult.removed.join(
          ", "
        )}`;
      }

      setStatusMessage(
        `Preparando cartão para ${user.name}. 
         ${statusMessage}. 
         Tamanho: ${vCardResult.size}/240 bytes. Aproxime o cartão...`
      );

      // Criar novo abort controller
      const abortController = new AbortController();
      nfcAbortController.current = abortController;

      // Criar nova instância do NDEFReader
      const ndef = new NDEFReader();

      // Variável para controlar processamento único
      let processed = false;

      // Configurar handler para o evento de leitura
      ndef.addEventListener("reading", async ({ serialNumber }) => {
        // Evitar processamento duplicado
        if (processed) return;
        processed = true;

        try {
          setStatusMessage(
            `Cartão detectado (${serialNumber}). Gravando dados...`
          );
          setNfcStatus("writing");

          // Tentar gravar o vCard
          await ndef.write({
            records: [
              {
                recordType: "mime",
                mediaType: "text/vcard",
                data: new TextEncoder().encode(vCardResult.vcard),
              },
            ],
          });

          setNfcStatus("success");
          setSuccessMessage(
            `Cartão gravado com sucesso! 
             ${statusMessage}. 
             Tamanho: ${vCardResult.size}/240 bytes.`
          );

          // Atualizar o status do usuário e recarregar a lista
          await atualizarStatusNfc(user);
          fetchUsers(currentPage, 400);

          // Limpar recursos após gravação bem-sucedida
          stopNfcWriting();
          setIsWriting(false);
        } catch (writeError) {
          console.error("Erro durante gravação:", writeError);
          setNfcStatus("error");
          setError(
            `Erro na gravação: ${
              writeError.message || "erro desconhecido"
            }. Tamanho vCard: ${vCardResult.size} bytes.`
          );
          stopNfcWriting();
          setIsWriting(false);
        }
      });

      // Configurar um handler para erros do NFC
      ndef.addEventListener("error", (error) => {
        console.error("Erro no leitor NFC:", error);
        setNfcStatus("error");
        setError(`Erro no leitor NFC: ${error.message || "erro desconhecido"}`);
        stopNfcWriting();
        setIsWriting(false);
      });

      // Iniciar scan com o abort controller
      await ndef.scan({ signal: abortController.signal });
      console.log("Scan NFC iniciado. Aguardando aproximação do cartão...");
    } catch (error) {
      console.error("Erro ao iniciar operação NFC:", error);
      setNfcStatus("error");
      setError(`Erro ao iniciar NFC: ${error.message || "erro desconhecido"}`);
      stopNfcWriting();
      setIsWriting(false);
    }
  };

  // Função para ler o conteúdo do cartão
  const readNfcContent = async () => {
    // Limpar qualquer operação anterior
    stopNfcWriting();

    setNfcStatus("detecting");
    setStatusMessage("Modo de leitura. Aproxime o cartão...");
    setError("");
    setSuccessMessage("");

    try {
      // Criar novo controlador de aborto
      const abortController = new AbortController();
      nfcAbortController.current = abortController;

      const ndef = new NDEFReader();

      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        if (!message || message.records.length === 0) {
          setStatusMessage("Cartão vazio - nenhum registro encontrado");
          return;
        }

        let readContent = "";
        message.records.forEach((record, index) => {
          try {
            if (record.recordType === "text") {
              readContent += `Texto: "${record.data}"\n`;
            } else if (record.recordType === "url") {
              readContent += `URL: ${record.data}\n`;
            } else if (record.data) {
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(record.data);
              readContent += `Dados (${record.recordType}): "${text}"\n`;
            } else {
              readContent += `Tipo ${record.recordType}: dados não legíveis\n`;
            }
          } catch (e) {
            readContent += `Tipo ${record.recordType}: erro ao ler dados\n`;
          }
        });

        setNfcStatus("success");
        setSuccessMessage("Leitura concluída!");
        setStatusMessage(`Conteúdo lido:\n${readContent}`);
      });

      // Adicionar handler para erros
      ndef.addEventListener("error", (error) => {
        console.error("Erro na leitura NFC:", error);
        setNfcStatus("error");
        setError(
          `Erro na leitura NFC: ${error.message || "erro desconhecido"}`
        );
        stopNfcWriting();
      });

      // Iniciar scan com o abort controller
      await ndef.scan({ signal: abortController.signal });
      console.log("Leitura NFC iniciada. Aguardando aproximação do cartão...");
    } catch (error) {
      setNfcStatus("error");
      setError(`Erro ao iniciar leitura: ${error.message || "indefinido"}`);
      stopNfcWriting();
    }
  };

  // Filtrar apenas os usuários sem NFC ativo
  const filteredUsers = users.filter((user) => {
    if (!user) return false;

    // Aplicar filtro de busca
    const searchLower = (searchTerm || "").toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(searchLower);
    const idMatch = user.id?.toString().includes(searchTerm);

    // Aplicar filtro por status NFC
    const statusMatch = !showOnlyPending || !isNfcActivated(user);

    return (nameMatch || idMatch) && statusMatch;
  });

  // Remover duplicatas e garantir usuários únicos
  const uniqueFilteredUsers = removeDuplicates(filteredUsers);

  const sortedFilteredUsers = uniqueFilteredUsers.sort((a, b) => {
    if (!a.name || a.name.trim() === "") return 1; // Coloca usuários sem nome no final
    if (!b.name || b.name.trim() === "") return -1; // Coloca usuários sem nome no final
    return a.name.localeCompare(b.name); // Ordem alfabética por nome
  });

  // Handlers para os inputs
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTogglePending = () => {
    setShowOnlyPending(!showOnlyPending);
  };

  return (
    <div className="mt-6 max-w-md mx-auto">
      <p className="text-lg border-l-4 border-blue-400 pl-4 mb-6">
        Grave cartões NFC para os participantes
      </p>

      {/* Informações sobre NFC no A15 */}
      {nfcSupported === false && (
        <div className="w-full p-4 mb-4 bg-yellow-600 text-white rounded-lg text-sm">
          <p className="font-medium">
            NFC não suportado neste dispositivo ou navegador
          </p>
          <p className="mt-1">
            NFC funciona apenas em Chrome/Edge em dispositivos Android com NFC.
            Não funciona em iOS.
          </p>
        </div>
      )}

      {/* Instruções para formatação de cartões */}
      <div className="w-full p-4 mb-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-2">
          Instruções para cartões novos:
        </h3>
        <ol className="text-white text-sm list-decimal pl-5 space-y-1">
          <li>Formate o cartão primeiro usando o NFC Tools no iPhone</li>
          <li>
            Grave qualquer texto pequeno no cartão (pode ser apagado depois)
          </li>
          <li>Depois de formatado, o cartão pode ser gravado pelo A15</li>
        </ol>
      </div>

      {/* Botão de leitura NFC */}
      <div className="mb-4">
        <button
          onClick={readNfcContent}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center"
          disabled={isWriting}
        >
          <Search className="mr-2" size={18} />
          Ler cartão NFC
        </button>
      </div>

      {/* Filtro de busca */}
      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar participante por nome ou ID..."
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
          onChange={handleTogglePending}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="show-pending" className="text-sm text-gray-300">
          Mostrar apenas participantes sem cartão NFC
        </label>
      </div>

      {/* Seleção de usuário - dropdown padrão */}
      <div className="relative w-full mb-4">
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
          {/* AQUI É ONDE VOCÊ DEVE SUBSTITUIR O CÓDIGO */}
          {sortedFilteredUsers.map((user) => (
            <option key={user.id} value={user.id} className="bg-gray-800 py-2">
              #{user.id} - {user.name} - {user.email}
            </option>
          ))}
        </select>
        <Database
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {/* Indicador de status NFC */}
      <div className="mb-4">
        <NfcStatusIndicator />
      </div>

      {/* Botão de Gravação */}
      <button
        onClick={writeToPreFormattedCard}
        disabled={!selectedUser || !nfcSupported || isWriting}
        className="w-full p-4 rounded-lg bg-green-600 text-white font-semibold
                hover:bg-green-500 transition-colors duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
      >
        <Wifi size={20} />
        {isWriting ? "Gravação em andamento..." : "Gravar Cartão NFC"}
      </button>

      {/* Mensagem para lista vazia */}
      {uniqueFilteredUsers.length === 0 && !loading && (
        <div className="text-center p-4 mt-4 bg-gray-700 rounded-lg">
          <p className="text-white">
            {searchTerm
              ? "Nenhum participante encontrado com este critério de busca"
              : "Não há participantes pendentes para gravação de cartão NFC"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NFCWriterAdmin;
