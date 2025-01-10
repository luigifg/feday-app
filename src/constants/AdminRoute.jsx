import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log("Verificando permissões de administrador...");

      try {
        // Use a instância customizada do axios
        const response = await axios.get("/me");
        console.log("Resposta do servidor admin:", response);

        if (response.status === 200) {
          const isAdminUser = response.data.idGroup === 2;
          console.log("Usuário é admin?", isAdminUser);
          setIsAdmin(isAdminUser);
        } else {
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