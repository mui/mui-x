import type { Logger } from '../types';

const noopLogger: Logger = () => {};

/**
 * Hosts MUI serves docs / `llms.txt` from. Allowlist only: nothing else is fetchable, no matter how
 * an attacker host is spelled or resolves (private IPs, IPv4-mapped, redirects, DNS rebinding).
 *
 * Known boundary: this trusts any `*.mui.com` subdomain, any port on `mui.com`, and any Netlify site
 * matching `*--material-ui-docs.netlify.app`. Docs fetches carry no credentials, so the worst case is
 * prompt injection from attacker-controlled content, not a key leak.
 */
function isMuiDocsHost(host: string): boolean {
  return (
    host === 'mui.com' ||
    host.endsWith('.mui.com') ||
    // Netlify deploy previews: `<context>--material-ui-docs.netlify.app` (plus the base host).
    host === 'material-ui-docs.netlify.app' ||
    host.endsWith('--material-ui-docs.netlify.app')
  );
}

/**
 * URL guard for the docs fetchers: allows http(s) URLs on a MUI docs host or a configured backend
 * origin (localhost is fine in dev), and rejects everything else.
 */
export function createDocsUrlGuard(
  allowedOrigins: Iterable<string>,
  logger: Logger = noopLogger,
): (url: string) => boolean {
  const allowed = new Set<string>();
  for (const origin of allowedOrigins) {
    try {
      const parsed = new URL(origin);
      // Only http(s): opaque schemes (file:, data:, …) all serialize to origin "null", so one bad
      // entry would let every other opaque-origin URL match and bypass the https check.
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        allowed.add(parsed.origin);
      } else {
        logger(`Ignoring configured docs origin with unsupported scheme: ${origin}`);
      }
    } catch {
      logger(`Ignoring malformed configured docs origin: ${origin}`);
    }
  }
  return (url) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    // Explicitly configured backends are trusted as-is (they may be http://localhost in dev).
    if (allowed.has(parsed.origin)) {
      return true;
    }
    // Built-in MUI docs hosts must be https, so the first request can't be tampered with in transit.
    if (parsed.protocol !== 'https:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase().replace(/\.$/, ''); // strip a trailing DNS dot
    return isMuiDocsHost(host);
  };
}
