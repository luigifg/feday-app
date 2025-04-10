// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../constants/Axios";

// Criando o contexto
const AuthContext = createContext(null);

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  // Verifica se o usuário está autenticado apenas na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      // Verifica primeiro no localStorage se já temos dados do usuário
      const storedUser = localStorage.getItem("user");
      
      // Se encontrar dados no localStorage, usamos eles
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user,
            hasRequiredRole: user.idGroup === 2, // Admin check
          });
          return; // Não precisamos fazer a chamada de API
        } catch (error) {
          // Se houver erro ao processar o JSON, ignoramos o valor do localStorage
          localStorage.removeItem("user");
        }
      }

      // Caso não tenha no localStorage, fazemos a chamada de API
      try {
        const response = await api.get("/me");
        
        if (response.status === 200) {
          const user = response.data;
          
          // Salvamos no localStorage para uso futuro
          localStorage.setItem("user", JSON.stringify(user));
          
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user,
            hasRequiredRole: user.idGroup === 2, // Admin check
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            hasRequiredRole: false,
          });
        }
      } catch (error) {
        console.error("Erro de autenticação:", error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          hasRequiredRole: false,
          error,
        });
      }
    };

    checkAuth();
  }, []);

  // Função para login
  const login = async (email, password) => {
    try {
      // Limpa o estado para mostrar que está carregando
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Faz a requisição de login
      const response = await api.post("/login", { email, password });
      
      if (response.status === 200) {
        // Se o login for bem-sucedido, busca os dados do usuário
        // Evitamos fazer uma nova chamada para /me usando os dados do response
        const user = response.data;
        
        // Salva no localStorage
        localStorage.setItem("user", JSON.stringify(user));
        
        // Atualiza o estado
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          hasRequiredRole: user.idGroup === 2, // Admin check
          error: null,
        });
        
        return { success: true, user };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error.response?.data || "Erro ao realizar o login",
      }));
      
      return { 
        success: false, 
        error: error.response?.data || "Erro ao realizar o login" 
      };
    }
  };

  // Função para logout
  const logout = async () => {
    try {
      // Chama a API de logout
      await api.post("/logout");
      
      // Limpa os dados no localStorage
      localStorage.removeItem("user");
      
      // Atualiza o estado
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        hasRequiredRole: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    }
  };

  // Função para registrar novo usuário
  const register = async (userData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Registra o novo usuário
      const response = await api.post("/user", userData);
      
      if (response.status === 200) {
        // Faz login automático após o registro
        return await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.errors || "Erro ao criar conta",
      }));
      
      return { 
        success: false, 
        error: error.response?.data?.errors || "Erro ao criar conta" 
      };
    }
  };

  // Função para atualizar o usuário no contexto (sem fazer chamada de API)
  const updateUserData = (userData) => {
    // Atualiza no localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Atualiza o estado
    setAuthState(prev => ({
      ...prev,
      user: userData,
      hasRequiredRole: userData.idGroup === 2,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;