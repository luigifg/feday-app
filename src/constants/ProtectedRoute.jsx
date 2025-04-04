// constants/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ element, requiredRole = null, redirectTo = "/signin" }) => {
  const { isLoading, isAuthenticated, hasRequiredRole } = useAuth(requiredRole);

  if (isLoading) {
    // Componente de loading
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      <p className="ml-3 text-lg">Verificando permissões...</p>
    </div>;
  }

  // Se não estiver autenticado ou não tiver o papel necessário, redireciona
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // Se um papel específico for necessário e o usuário não o tiver
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" />;
  }

  // Exibe o componente protegido
  return element;
};

export default ProtectedRoute;