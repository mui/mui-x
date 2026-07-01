import type { PackageData } from '@mui/x-agent-tools';
import { DEFAULT_DOCS_BASE_URL, DOCS_BASE_URL_ENV, PACKAGES_LIST_PATH } from '../constants';

/** Fetch the docs-catalog package list. Throws if the response isn't a non-empty array. */
export const fetchRemotePackages = async (
  fetcher: typeof fetch = globalThis.fetch,
): Promise<PackageData[]> => {
  const baseUrl = process.env[DOCS_BASE_URL_ENV] ?? DEFAULT_DOCS_BASE_URL;
  const packagesListUrl = new URL(PACKAGES_LIST_PATH, baseUrl).toString();
  const response = await fetcher(packagesListUrl);

  if (!response.ok) {
    throw new Error(
      `MUI MCP: The MUI documentation catalog at ${packagesListUrl} is unavailable (HTTP ${response.status}). ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL points at a reachable backend, then retry.`,
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `MUI MCP: The MUI documentation catalog at ${packagesListUrl} returned a non-JSON response. ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL serves the package list (not a proxy or error page), then retry.`,
    );
  }

  if (!Array.isArray(data) || !data.length) {
    throw new Error(
      `MUI MCP: The MUI documentation catalog at ${packagesListUrl} returned no packages. ` +
        `The docs tools (useMuiDocs, fetchDocs) cannot work without it. ` +
        `Check that MUI_DOCS_BASE_URL points at a reachable backend that serves the package list, then retry.`,
    );
  }

  return data as PackageData[];
};
