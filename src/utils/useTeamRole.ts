import { useEffect, useState } from "react";
import { fetchMembers } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export type TeamRole = "OWNER" | "MEMBER";

const normalizeRole = (value: unknown): TeamRole | null => {
  if (typeof value !== "string") return null;
  const upper = value.toUpperCase();
  return upper === "OWNER" || upper === "MEMBER" ? upper : null;
};

/**
 * The logged-in user's role on their team.
 *
 * Sources, in order:
 *  1. A role on the stored login user (if the API returns one).
 *  2. A 403 from any owner-only endpoint — that means the user is a member.
 *  3. The user's own row in the team members list (fetched if not loaded).
 *
 * `role` is `null` when it could not be worked out. `resolving` is true while
 * the members list is still being fetched.
 */
export function useTeamRole(): { role: TeamRole | null; resolving: boolean } {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { members, loading, error } = useAppSelector((s) => s.members);
  const deniedSomewhere = useAppSelector(
    (s) =>
      s.apiKeys.access === "denied" ||
      s.webhook.access === "denied" ||
      s.activityLog.access === "denied" ||
      s.wallet.access === "denied",
  );

  const roleFromUser =
    normalizeRole(user?.role) ?? normalizeRole(user?.team_role);

  const self = members.find(
    (m) =>
      (user?.id != null && String(m.user_id) === String(user.id)) ||
      (typeof user?.email === "string" &&
        m.email?.toLowerCase() === user.email.toLowerCase()),
  );
  const roleFromMembers = normalizeRole(self?.role);

  // Fetch the members list at most once per mount; an empty result must not
  // trigger another request.
  const [requested, setRequested] = useState(false);
  const needsMembers =
    !roleFromUser &&
    !deniedSomewhere &&
    Boolean(user) &&
    members.length === 0 &&
    !requested;

  useEffect(() => {
    if (needsMembers && !loading && !error) {
      setRequested(true);
      // Several components use this hook; check the live store so only the
      // first one on a page actually sends the request.
      dispatch((d, getState) => {
        const m = getState().members;
        if (!m.loading && m.members.length === 0) d(fetchMembers());
      });
    }
  }, [needsMembers, loading, error, dispatch]);

  if (roleFromUser) return { role: roleFromUser, resolving: false };
  if (deniedSomewhere) return { role: "MEMBER", resolving: false };
  return {
    role: roleFromMembers,
    // Still waiting on the members list (not yet requested, or in flight).
    resolving: !roleFromMembers && Boolean(user) && !error && (loading || needsMembers),
  };
}
