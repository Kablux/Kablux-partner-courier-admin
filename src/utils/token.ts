interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decodes a JWT payload without verifying the signature.
 * Verification is the backend's job — this is only used to read `exp`.
 */
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns true when the token is missing, malformed, or past its `exp`.
 * Tokens without an `exp` claim are treated as valid (opaque tokens).
 */
export function isTokenExpired(token: string | null, skewSeconds = 30): boolean {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload) return false; // opaque / non-JWT token — let the server decide
  if (typeof payload.exp !== "number") return false;

  return Date.now() >= (payload.exp - skewSeconds) * 1000;
}

/**
 * Pulls tokens out of an auth response.
 *
 * The partner API returns them nested:
 *   { success, message, data: { tokens: { access_token, refresh_token } } }

 */
export function extractAuthTokens(payload: unknown): {
  accessToken: string;
  refreshToken?: string;
} {
  const root = (payload ?? {}) as Record<string, any>;
  const data = (root.data ?? {}) as Record<string, any>;
  const tokens = (data.tokens ?? root.tokens ?? {}) as Record<string, any>;

  const accessToken: string =
    tokens.access_token ||
    tokens.access ||
    root.access ||
    root.access_token ||
    root.token ||
    "";

  const refreshToken: string | undefined =
    tokens.refresh_token || tokens.refresh || root.refresh || root.refresh_token || undefined;

  return { accessToken, refreshToken };
}

/** Pulls the user object from either the nested or flat response shape. */
export function extractAuthUser<T>(payload: unknown): T | null {
  const root = (payload ?? {}) as Record<string, any>;
  return (root.data?.user ?? root.user ?? null) as T | null;
}

/**
 * A session is alive if the access token is still good, OR the access token
 * has expired but the refresh token can still buy a new one.
 */
export function hasLiveSession(
  accessToken: string | null,
  refreshToken: string | null
): boolean {
  if (accessToken && !isTokenExpired(accessToken)) return true;
  if (refreshToken && !isTokenExpired(refreshToken)) return true;
  return false;
}