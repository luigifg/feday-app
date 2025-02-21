import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "./Axios";

const AdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("Verificando permissões de administrador...");

      try {
        const response = await api.get("/me");
        console.log("Resposta do servidor:", response);

        if (response.status === 200) {
          // Verifica se o usuário tem id_group 2 (administrador)
          const isAdminUser = response.data.idGroup === 2;

          console.log("Usuário é admin?", isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
          console.log("Status não 200, sem permissão de administrador");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isAdmin === null) {
    console.log("Verificando permissões...");
    return <div>Verificando permissões...</div>;
  }

  console.log("Renderizando elemento admin");
  // Se o usuário não for admin, redireciona para a página principal
  return isAdmin ? element : <Navigate to="/" />;
};

export default AdminRoute;