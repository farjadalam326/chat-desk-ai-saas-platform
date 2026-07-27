import React from "react";
import { useLocation } from "react-router-dom";
import { LoginPage } from "../LoginPage/LoginPage";
import { SignUpPage } from "../SignUpPage/SignUpPage";

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";

  return isSignUp ? <SignUpPage /> : <LoginPage />;
};

export default AuthPage;
