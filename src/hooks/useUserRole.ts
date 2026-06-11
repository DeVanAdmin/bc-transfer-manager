import { useEffect, useState } from 'react';
import { getContext } from '@microsoft/power-apps/app';

export type Role = 'coordinator' | 'origin' | 'destination';

// Maps a user's email (lowercased) to their app role.
// NOTE: temporary hard-coded map — we will make this configurable later.
const ROLE_MAP: Record<string, Role> = {
  'admin@devanunlimitedllc.com': 'coordinator',
  'duke@devanunlimitedllc.com': 'destination',
};

const VALID_ROLES: Role[] = ['coordinator', 'origin', 'destination'];

export interface UserRoleState {
  role: Role | null;
  email: string | null;
  displayName: string | null;
  loading: boolean;
  error: string | null;
}

/** Reads VITE_DEV_ROLE and returns it only if it is a valid role. */
export function getDevRole(): Role | null {
  const raw = import.meta.env.VITE_DEV_ROLE as string | undefined;
  if (raw && (VALID_ROLES as string[]).includes(raw)) return raw as Role;
  return null;
}

/**
 * Resolves the current user's role.
 *
 * In production this calls the Power Apps SDK (`app.getContext()`) to read the
 * signed-in user's `userPrincipalName` and looks it up in ROLE_MAP.
 *
 * In development (`import.meta.env.DEV`) it short-circuits the SDK and returns
 * the role named by VITE_DEV_ROLE immediately, so the local dev server and role
 * switcher work without a real Power Apps host.
 */
export function useUserRole(): UserRoleState {
  const isDev = import.meta.env.DEV;
  const devRole = isDev ? getDevRole() : null;

  const [state, setState] = useState<UserRoleState>(() =>
    isDev
      ? {
          role: devRole,
          email: devRole ? `${devRole}@dev.local` : null,
          displayName: devRole ? `Dev ${devRole}` : null,
          loading: false,
          error: devRole
            ? null
            : 'VITE_DEV_ROLE is not set to a valid role (coordinator | origin | destination).',
        }
      : { role: null, email: null, displayName: null, loading: true, error: null },
  );

  useEffect(() => {
    // Dev role was resolved synchronously above; never call the SDK in dev.
    if (isDev) return;

    let cancelled = false;
    (async () => {
      try {
        const ctx = await getContext();
        const email = ctx.user.userPrincipalName ?? null;
        const displayName = ctx.user.fullName ?? null;
        const role = email ? ROLE_MAP[email.toLowerCase()] ?? null : null;
        if (!cancelled) setState({ role, email, displayName, loading: false, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({
            role: null,
            email: null,
            displayName: null,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isDev]);

  return state;
}
