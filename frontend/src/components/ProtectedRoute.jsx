import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while authentication status is being determined
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Render children if authenticated, otherwise redirect to home
  return isAuthenticated ? children : <Navigate to="/" />;
}
