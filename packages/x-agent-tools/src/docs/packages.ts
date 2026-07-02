import type { PackageData } from './types';

export const PACKAGES_LIST_PATH = '/v1/public/packages/list';

/**
 * Fetch the docs-catalog package list from `docsBaseUrl`. Throws a prefixed, actionable error if the
 * catalog is unreachable, non-JSON, or not a non-empty array (the docs tools can't work without it).
 */
export async function fetchRemotePackages(
  docsBaseUrl: string,
  fetcher: typeof fetch = globalThis.fetch,
): Promise<PackageData[]> {
  const packagesListUrl = new URL(PACKAGES_LIST_PATH, docsBaseUrl).toString();
  const response = await fetcher(packagesListUrl);

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

  if (!Array.isArray(data) || !data.length) {
    throw new Error(
      `MUI X Agent Tools: The MUI documentation catalog at ${packagesListUrl} returned no packages. ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL points at a reachable backend that serves the package list, then retry.`,
    );
  }

  return data as PackageData[];
}
