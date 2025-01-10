import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Estado para verificar a autenticação
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Verificando autenticação...");

      try {
        const response = await axios.get("https://feday-api.onrender.com/me", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log("Resposta do servidor:", response.data);

        if (response.status === 200) {
          console.log("Usuário autenticado!");
          setIsAuthenticated(true);
        } else {
          console.log("Status não 200, redirecionando para /signin");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro de autenticação:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    console.log("Carregando...");
    return <div>Carregando...</div>;  // Exibe "Carregando..." enquanto verificamos a autenticação
  }

  console.log("Renderizando elemento protegido");
  // Se o usuário não estiver autenticado, redireciona para /signin
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

export default PrivateRoute;
