import { z } from 'zod';
import type { PackageData } from '../types';

export const PACKAGES_LIST_PATH = '/v1/public/packages/list';

const catalogSchema = z.array(
  z.object({
    name: z.string(),
    version: z.string(),
    llmsUrl: z.string(),
    llmsFullUrl: z.string(),
  }),
);

/**
 * Fetch the docs-catalog package list from `docsBaseUrl`. Throws a prefixed error if the catalog is
 * unreachable, non-JSON, or empty (the docs tools can't work without it). Pass `timeoutMs` to abort
 * a hung connection (accepted but never answered) so the caller's retry can proceed.
 */
export async function fetchRemotePackages(
  docsBaseUrl: string,
  fetcher: typeof fetch = globalThis.fetch,
  timeoutMs?: number,
): Promise<PackageData[]> {
  // Concatenate like the JWT/codegen clients so a base path prefix (`https://host/api`) survives.
  const packagesListUrl = `${docsBaseUrl.replace(/\/+$/, '')}${PACKAGES_LIST_PATH}`;
  const response = timeoutMs
    ? await fetcher(packagesListUrl, { signal: AbortSignal.timeout(timeoutMs) })
    : await fetcher(packagesListUrl);

  if (!response.ok) {
    throw new Error(
      `MUI X Agent Tools: The MUI documentation catalog at ${packagesListUrl} is unavailable (HTTP ${response.status}). ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL points at a reachable backend, then retry.`,
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `MUI X Agent Tools: The MUI documentation catalog at ${packagesListUrl} returned a non-JSON response. ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL serves the package list (not a proxy or error page), then retry.`,
    );
  }

  // Validate entries so a backend shape drift can't leak `undefined` URLs into the tool description.
  const catalog = catalogSchema.safeParse(data);
  if (!catalog.success || catalog.data.length === 0) {
    throw new Error(
      `MUI X Agent Tools: The MUI documentation catalog at ${packagesListUrl} returned no usable packages (empty or unexpected shape). ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL points at a reachable backend that serves the package list, then retry.`,
    );
  }

  return catalog.data;
}

// Compare `major.minor.patch` (>0 / <0 / 0), ranking a prerelease below its release
// (`1.0.0-beta` < `1.0.0`). Enough to pick the latest docs version.
export function compareVersions(a: string, b: string): number {
  const parse = (version: string) => {
    const [core, prerelease] = version.split('-', 2);
    const nums = core.split('.').map((part) => parseInt(part, 10) || 0);
    return { nums, prerelease };
  };
  const parsedA = parse(a);
  const parsedB = parse(b);
  for (let i = 0; i < 3; i += 1) {
    const diff = (parsedA.nums[i] ?? 0) - (parsedB.nums[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  // Equal core: the release outranks a prerelease; otherwise compare prerelease tags lexically.
  if (parsedA.prerelease === parsedB.prerelease) {
    return 0;
  }
  if (!parsedA.prerelease) {
    return 1;
  }
  if (!parsedB.prerelease) {
    return -1;
  }
  return parsedA.prerelease < parsedB.prerelease ? -1 : 1;
}

export function normalizePackageName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Known names that look like the query, for a "did you mean" hint.
export function suggestPackageNames(query: string, knownNames: string[]): string[] {
  const q = normalizePackageName(query);
  if (!q) {
    return [];
  }
  return knownNames
    .filter((name) => {
      const n = normalizePackageName(name);
      return n.includes(q) || q.includes(n);
    })
    .slice(0, 5);
}

/** Friendlier "unknown package/version" message when a `useMuiDocs` shorthand isn't in the catalog. */
export function formatUnknownSourceError(
  entry: string,
  versionsByName: Map<string, string[]>,
  knownNames: string[],
): string {
  // Split on the version `@`, not the scope's leading `@`.
  const at = entry.lastIndexOf('@');
  const name = at > 0 ? entry.slice(0, at) : entry;
  const versions = versionsByName.get(name);
  if (at > 0 && versions) {
    return `Unknown package or version: "${entry}". Available versions of ${name}: ${versions.join(', ')}.`;
  }
  const suggestions = suggestPackageNames(name, knownNames);
  const hint = suggestions.length
    ? ` Did you mean one of: ${suggestions.join(', ')}?`
    : ` Available packages: ${knownNames.join(', ')}.`;
  return `Unknown package: "${name}".${hint}`;
}
