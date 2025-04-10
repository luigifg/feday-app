// hooks/useAuth.jsx
import { useState, useEffect } from "react";
import api from "./Axios";

export const useAuth = (requiredRole = null) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/me");
        
        if (response.status === 200) {
          // Usuário está autenticado
          const user = response.data;
          
          // Se um role específico é necessário, verificamos
          const hasRequiredRole = requiredRole 
            ? (requiredRole === 'admin' ? user.idGroup === 2 : true) 
            : true;
            
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user,
            hasRequiredRole
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            hasRequiredRole: false
          });
        }
      } catch (error) {
        console.error("Erro de autenticação:", error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          hasRequiredRole: false,
          error
        });
      }
    };

    checkAuth();
  }, [requiredRole]);

  return authState;
};