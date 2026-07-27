import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../api/client";
import { authApi } from "../api/authApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getAuthToken();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState<boolean>(!!token);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const hasValidatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!token || hasValidatedRef.current) return;
    hasValidatedRef.current = true;

    let isMounted = true;
    authApi
      .getMe()
      .then((res) => {
        if (isMounted) {
          if (res?.data?.user) {
            setIsAuthenticated(true);
          } else {
            removeAuthToken();
            setIsAuthenticated(false);
          }
          setIsValidating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          removeAuthToken();
          setIsAuthenticated(false);
          setIsValidating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!token || (!isValidating && !isAuthenticated)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-400">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wide text-slate-300">Authenticating session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
