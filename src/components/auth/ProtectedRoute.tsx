import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { hasStoredSession } from "../../api/axios";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.ReactElement {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  // Redux state is hydrated synchronously from localStorage in the slice's
  // initialState, so there is no loading flash here. The storage re-check is
  // a safety net for the case where tokens were cleared outside Redux.
  const allowed = isAuthenticated && hasStoredSession();

  if (!allowed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}