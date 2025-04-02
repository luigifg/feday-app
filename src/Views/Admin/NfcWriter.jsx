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
  const [nfcStatus, setNfcStatus] = useState("idle"); // idle, detecting, reading, writing, success, error
  const [statusMessage, setStatusMessage] = useState("");

  const nfcAbortController = useRef(null);

  // Verificar suporte a NFC no navegador
  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
  }, []);

  // Buscar todos os usuários
  useEffect(() => {
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

  // Função auxiliar para verificar se o NFC está ativado
  const isNfcActivated = (user) => {
    if (!user) return false;

    // Se for booleano, verificamos diretamente
    if (typeof user.nfcActivated === "boolean") {
      return user.nfcActivated;
    }

    // Se for número, consideramos 1 como ativado
    if (typeof user.nfcActivated === "number") {
      return user.nfcActivated === 1;
    }

    // Se for string, verificamos se é '1', 'true', etc.
    if (typeof user.nfcActivated === "string") {
      return (
        user.nfcActivated === "1" || user.nfcActivated.toLowerCase() === "true"
      );
    }

    // Por padrão, consideramos não ativado
    return false;
  };

  // Buscar usuários
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user");

      if (response.status === 200) {
        // Garantir que temos um array
        let usersData = response.data;

        if (!Array.isArray(usersData)) {
          if (usersData.data && Array.isArray(usersData.data)) {
            usersData = usersData.data;
          } else if (typeof usersData === "object" && usersData !== null) {
            usersData = Object.values(usersData);
          } else {
            usersData = [];
          }
        }

        setUsers(usersData);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setError("Erro ao carregar usuários. Tente novamente.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Parar gravação NFC
  const stopNfcWriting = () => {
    console.log("Parando processo de NFC...");
    if (nfcAbortController.current) {
      nfcAbortController.current.abort();
      nfcAbortController.current = null;
      console.log("Processo de NFC interrompido");
    }
  };

  // Indicador de status do NFC
  const NfcStatusIndicator = () => {
    // Configurações de cor e ícone com base no status
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

    // Mensagens para cada status
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
    if (!user) return "";

    // Formato melhorado do vCard para maior compatibilidade com smartphones
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${user.name}`,
      `N:${user.name};;;;`, // Formato correto para reconhecimento automático
      user.phone ? `TEL;TYPE=CELL:${user.phone}` : "",
      user.email ? `EMAIL;TYPE=WORK:${user.email}` : "",
      user.company ? `ORG:${user.company}` : "",
      user.position ? `TITLE:${user.position}` : "",
      "END:VCARD",
    ]
      .filter((line) => line !== "")
      .join("\r\n"); // Filtrar linhas vazias e usar CRLF

    return vCard;
  };

  const atualizarStatusNfc = async (user) => {
    try {
      await api.patch(`/user/${user.id}`, { nfcActivated: 1 });
      console.log("Status do NFC atualizado no banco de dados");

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
    setNfcStatus("detecting");
    setStatusMessage("Iniciando gravação em cartão pré-formatado...");
    setError("");
    setSuccessMessage("");

    // Verificar se um usuário foi selecionado
    if (!selectedUser) {
      setNfcStatus("error");
      setError("Selecione um usuário antes de gravar o cartão");
      return;
    }

    try {
      // Obter dados do usuário
      const user = users.find(
        (u) => u.id === selectedUser || u.id === parseInt(selectedUser)
      );
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      console.log("Preparando para gravar dados do usuário:", user.name);

      // Criar string simples com ID e nome (formato que o leitor no Admin.jsx espera)
      const userData = JSON.stringify({
        id: user.id,
        name: user.name,
      });

      // Gerar o vCard para compartilhamento de contato
      const vCardData = generateVCardData(user);

      console.log("Dados a serem gravados:", userData);
      console.log("vCard gerado:", vCardData);

      // Verificar tamanho total dos dados
      const totalSize =
        new TextEncoder().encode(userData).length +
        new TextEncoder().encode(vCardData).length;
      console.log("Tamanho total dos dados:", totalSize, "bytes");

      // Verificar se os dados são muito grandes para o cartão
      let dadosMuitoGrandes = false;
      if (totalSize > 200) {
        // Limite conservador para ST25TA02K (256 bytes)
        console.warn("ALERTA: Dados podem exceder capacidade do cartão");
        setStatusMessage(
          "Os dados são grandes. Pode ser necessário usar apenas dados básicos."
        );
        dadosMuitoGrandes = true;
      }

      setStatusMessage(
        `Preparando dados para ${user.name}. Aproxime o cartão pré-formatado...`
      );

      // Iniciar NDEFReader
      const ndef = new NDEFReader();

      // Adicionar event listeners
      ndef.addEventListener("reading", (event) => {
        console.log("Cartão detectado! Serial:", event.serialNumber);
        setStatusMessage(`Cartão detectado: ${event.serialNumber}`);

        // Verificar se o cartão já contém dados
        const { message } = event;
        if (message && message.records && message.records.length > 0) {
          console.log(
            "Cartão já formatado com",
            message.records.length,
            "registros"
          );
          setStatusMessage(
            "Cartão já formatado. Preparando para sobrescrever..."
          );
        } else {
          console.log(
            "Aviso: Cartão parece estar vazio. Pode não funcionar no A15."
          );
          setStatusMessage(
            "Aviso: Cartão parece estar vazio. Pode ser necessário formatá-lo primeiro no iPhone."
          );
        }
      });

      // Iniciar escaneamento
      await ndef.scan();
      console.log("Escaneamento iniciado. Aguardando cartão...");

      // Quando o cartão for detectado
      ndef.onreading = async () => {
        try {
          setNfcStatus("writing");
          setStatusMessage("Gravando dados do usuário...");

          // Tentativa 1: Gravar dados completos (ID + vCard)
          if (!dadosMuitoGrandes) {
            try {
              console.log("Tentando gravar dados completos...");

              await ndef.write({
                records: [
                  // Record 1: Dados para check-in no evento
                  { 
                    recordType: "mime",  // Alterar para mime em vez de text para melhor compatibilidade
                    mediaType: "application/json",
                    data: new TextEncoder().encode(userData)
                  },
                  // Record 2: vCard para compartilhamento de contato
                  {
                    recordType: "mime",
                    mediaType: "text/vcard",
                    data: new TextEncoder().encode(vCardData)
                  }
                ]
              });

              console.log("Gravação completa bem-sucedida!");
              setNfcStatus("success");
              setSuccessMessage(
                `Cartão gravado com sucesso para ${user.name}!`
              );
              await atualizarStatusNfc(user);
              return;
            } catch (completeError) {
              console.error("Erro na gravação completa:", completeError);
              setStatusMessage(
                "Erro na gravação completa. Tentando apenas dados básicos..."
              );
            }
          }

          // Tentativa 2: Gravar apenas os dados de ID (para compatibilidade máxima)
          try {
            console.log("Tentando gravar apenas dados básicos...");

            await ndef.write({
              records: [
                {
                  recordType: "text",
                  data: userData,
                },
              ],
            });

            console.log("Gravação básica bem-sucedida!");
            setNfcStatus("success");
            setSuccessMessage(
              `Cartão gravado com dados básicos para ${user.name}!`
            );
            await atualizarStatusNfc(user);
            return;
          } catch (basicError) {
            console.error("Erro na gravação básica:", basicError);
            setStatusMessage(
              "Erro na gravação básica. Tentando formato alternativo..."
            );

            // Tentativa 3: Formato MIME para máxima compatibilidade
            try {
              console.log("Tentando gravar como MIME type...");

              await ndef.write({
                records: [
                  {
                    recordType: "mime",
                    mediaType: "application/json",
                    data: new TextEncoder().encode(userData),
                  },
                ],
              });

              console.log("Gravação MIME bem-sucedida!");
              setNfcStatus("success");
              setSuccessMessage(
                `Cartão gravado com sucesso para ${user.name}!`
              );
              await atualizarStatusNfc(user);
              return;
            } catch (mimeError) {
              console.error("Erro na gravação MIME:", mimeError);
              setNfcStatus("error");
              setError(
                "Falha em todas as tentativas de gravação. O cartão pode precisar ser formatado primeiro no iPhone."
              );
            }
          }
        } catch (writeError) {
          console.error("Erro durante processo de gravação:", writeError);
          setNfcStatus("error");
          setError(
            "Erro durante gravação: " + (writeError.message || "indefinido")
          );
        }
      };
    } catch (error) {
      console.error("Erro geral:", error);
      setNfcStatus("error");
      setError("Erro: " + (error.message || "indefinido"));
    }
  };

  // Função para ler o conteúdo do cartão
  const readNfcContent = async () => {
    setNfcStatus("detecting");
    setStatusMessage("Modo de leitura. Aproxime o cartão...");

    try {
      const ndef = new NDEFReader();

      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log("Cartão lido! Serial:", serialNumber);
        console.log("Conteúdo completo:", message);

        if (!message || message.records.length === 0) {
          setStatusMessage("Cartão vazio - nenhum registro encontrado");
          return;
        }

        let readContent = "";
        message.records.forEach((record, index) => {
          console.log(`Registro ${index + 1}:`, record);

          try {
            if (record.recordType === "text") {
              readContent += `Texto: "${record.data}"\n`;
            } else if (record.recordType === "url") {
              readContent += `URL: ${record.data}\n`;
            } else if (record.data) {
              // Tenta ler dados binários como texto
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

      await ndef.scan();
      console.log("Escaneamento para leitura iniciado...");
    } catch (error) {
      console.error("Erro ao iniciar leitura:", error);
      setNfcStatus("error");
      setError(`Erro ao iniciar leitura: ${error.message || "indefinido"}`);
    }
  };

  // Handlers para os inputs
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtra usuários com base na busca e status NFC
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        if (!user) return false;
        const nameMatch = user.name
          ?.toLowerCase()
          .includes((searchTerm || "").toLowerCase());
        const statusMatch = !showOnlyPending || !isNfcActivated(user);
        return nameMatch && statusMatch;
      })
    : [];

  // Função para forçar recarregamento dos dados
  const refreshUsers = async () => {
    setLoading(true);
    try {
      await fetchUsers();
      setSuccessMessage("Lista de usuários atualizada!");
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

      {/* Indicador de status NFC */}
      <NfcStatusIndicator />

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

      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={refreshUsers}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <Database className="mr-2" size={18} />
          Recarregar lista
        </button>

        <button
          onClick={readNfcContent}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center"
          disabled={isWriting}
        >
          <Search className="mr-2" size={18} />
          Ler cartão
        </button>
      </div>

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

      {/* Seleção de usuário */}
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
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.id} className="bg-gray-800">
              {user.name} {isNfcActivated(user) ? "(Cartão já gravado)" : ""}
            </option>
          ))}
        </select>
        <Database
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
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
        Gravar Cartão NFC
      </button>

      {/* Mensagem para lista vazia */}
      {filteredUsers.length === 0 && !loading && (
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
