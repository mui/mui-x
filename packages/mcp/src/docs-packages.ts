import type { PackageData } from '@mui/x-agent-tools';
import { DEFAULT_DOCS_BASE_URL, DOCS_BASE_URL_ENV, PACKAGES_LIST_PATH } from './constants';

/** Fetch the docs-catalog package list. Throws if the response isn't a non-empty array. */
export const fetchRemotePackages = async (
  fetcher: typeof fetch = globalThis.fetch,
): Promise<PackageData[]> => {
  const baseUrl = process.env[DOCS_BASE_URL_ENV] ?? DEFAULT_DOCS_BASE_URL;
  const packagesListUrl = new URL(PACKAGES_LIST_PATH, baseUrl).toString();
  const response = await fetcher(packagesListUrl);
  const data = await response.json();

  if (!Array.isArray(data) || !data.length) {
    throw new Error('Packages list not found');
  }

  return data;
};
