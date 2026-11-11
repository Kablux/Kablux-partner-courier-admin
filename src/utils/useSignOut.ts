import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutPartner } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/Auth";

/**
 * Signs out: tells the server to invalidate the tokens (this device, or all
 * devices), then clears the app's data and goes to the login page. The local
 * sign-out always happens, even if the server can't be reached.
 */
export function useSignOut() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signingOut = useAppSelector((s) => s.auth.loggingOut);

  const signOut = useCallback(
    async (options?: { allDevices?: boolean }) => {
      const toastId = toast.loading(
        options?.allDevices ? "Signing out of all devices…" : "Signing out…",
      );
      const result = await dispatch(logoutPartner({ allDevices: options?.allDevices }));
      // A skipped repeat click (already signing out) does nothing further.
      if (result.meta.requestStatus !== "fulfilled") {
        toast.dismiss(toastId);
        return;
      }

      dispatch(logout()); // clears tokens and every slice that resets on logout
      navigate("/login", { replace: true });

      const confirmed = (result.payload as { serverConfirmed: boolean }).serverConfirmed;
      if (options?.allDevices) {
        toast.success(
          confirmed
            ? "You've been signed out of all devices."
            : "Signed out here. We couldn't reach the server to sign out other devices.",
          { id: toastId },
        );
      } else {
        toast.success("You've been signed out.", { id: toastId });
      }
    },
    [dispatch, navigate],
  );

  return { signOut, signingOut };
}
