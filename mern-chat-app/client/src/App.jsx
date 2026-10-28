
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./hooks/reduxHooks";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

function ProtectedRoute({ children }) {
  const token = useAppSelector((state) => state.auth.token);

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Navigate to="/chat" replace /> : children;
}

export default function App() {
  const token = useAppSelector((state) => state.auth.token);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token ? "/chat" : "/login"} replace />}
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
