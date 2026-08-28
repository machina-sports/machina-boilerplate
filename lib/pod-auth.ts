/**
 * The one place that decides how this app authenticates to its Machina pod.
 *
 * Two credential kinds exist and they travel under DIFFERENT headers:
 *
 *   MACHINA_API_KEY        a pod API key            → X-Api-Token
 *   MACHINA_PROJECT_TOKEN  a project JWT (the kind  → Authorization: Bearer
 *                          `machina login` mints)
 *
 * Sending a project JWT under X-Api-Token earns a misleading AUTH-015
 * "Invalid proxy authorization X-Api" from the pod — which is exactly what
 * every proxy route in this app did before this helper existed, and why the
 * scaffold could not talk to a pod with CLI-minted credentials.
 *
 * Server-only by construction: routes import this, client code never does.
 */

const MACHINA_API_KEY = process.env.MACHINA_API_KEY || '';
const MACHINA_PROJECT_TOKEN = process.env.MACHINA_PROJECT_TOKEN || '';

export const MACHINA_API_URL = process.env.MACHINA_API_URL || 'http://127.0.0.1:3001';

export function podConfigured(): boolean {
  return Boolean(process.env.MACHINA_API_URL && (MACHINA_API_KEY || MACHINA_PROJECT_TOKEN));
}

/** Auth header for pod requests. The project token wins when both are set —
 *  it is the more specific credential. */
export function podAuthHeaders(): Record<string, string> {
  if (MACHINA_PROJECT_TOKEN) return { Authorization: `Bearer ${MACHINA_PROJECT_TOKEN}` };
  return { 'X-Api-Token': MACHINA_API_KEY };
}
