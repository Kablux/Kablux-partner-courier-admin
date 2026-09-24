import { useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { sessionExpired } from "../redux/slices/Auth";
import { hasStoredSession, TOKEN_KEY } from "../api/axios";
import type { AppDispatch } from "../redux/store";

export function useAuthSession(): void {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(sessionExpired());
      toast.error("Your session has expired. Please sign in again.");
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== TOKEN_KEY) return;
      if (!hasStoredSession()) dispatch(sessionExpired());
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorage);
    };
  }, [dispatch]);
}
