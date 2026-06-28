import type { DataStudioSheet } from './DataStudio.types';

/**
 * Adapter contract used by `<DataStudio>` to persist the list of user-created
 * sheets across mounts (page reloads, navigation away and back, etc.).
 *
 * Sheets are persisted as a flat list — each sheet carries its own
 * `dataSourceId`, so multiple data sources in the same studio share a single
 * persisted bucket. Active selection (which sheet/data source is open) is the
 * routing adapter's responsibility, not this one.
 *
 * SSR contract: `read` must return `null` and `write` must be a no-op when no
 * storage is available. Neither may throw.
 */
export interface DataStudioSheetsPersistenceAdapter {
  /**
   * Read the persisted list of sheets. Called once during hydration.
   * @returns {DataStudioSheet[] | null} The persisted sheets, or `null` when
   *   nothing has been persisted yet (the component falls back to
   *   `defaultSheets`).
   */
  read: () => DataStudioSheet[] | null;
  /**
   * Persist the next list of sheets. Called every time the sheets list mutates
   * (add, rename, duplicate, delete, move, updateSheet). Best-effort —
   * implementations must swallow errors.
   * @param {DataStudioSheet[]} sheets The next list of sheets.
   */
  write: (sheets: DataStudioSheet[]) => void;
}

export interface CreateLocalStorageSheetsPersistenceAdapterOptions {
  /**
   * Logical namespace for the persisted sheets. Use distinct keys when the
   * same page hosts independent `<DataStudio>` instances.
   * @default 'default'
   */
  key?: string;
}

const DEFAULT_STORAGE_NAMESPACE = 'default';
const STORAGE_KEY_PREFIX = 'mui-x-data-studio-sheets:v1';
const SHEETS_PERSISTENCE_VERSION = 1;

interface SheetsPersistenceState {
  version: typeof SHEETS_PERSISTENCE_VERSION;
  sheets: DataStudioSheet[];
}

function getStorageKey(namespace: string | undefined): string {
  return `${STORAGE_KEY_PREFIX}:${namespace ?? DEFAULT_STORAGE_NAMESPACE}`;
}

function getSheetsLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storage = window.localStorage;
    const testKey = '__mui_x_data_studio_sheets_storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function isPersistedSheet(value: unknown): value is DataStudioSheet {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  // Validate against the current `DataStudioSheet` shape: a stable `id` and a
  // `dataSourceId` that is either a Data Source id (string) or `null` for a
  // free-form sheet. (The legacy `views[]` container was dropped in the Sheet
  // model rework — validating it here silently discarded every persisted
  // sheet on read.)
  const candidate = value as { id?: unknown; dataSourceId?: unknown };
  return (
    typeof candidate.id === 'string' &&
    (typeof candidate.dataSourceId === 'string' || candidate.dataSourceId === null)
  );
}

/**
 * Build a sheets-persistence adapter backed by `window.localStorage`. SSR-safe:
 * returns `null` from `read` and is a no-op on `write` when storage is
 * unavailable (no window, private mode, or quota error).
 *
 * @param {CreateLocalStorageSheetsPersistenceAdapterOptions} [options] Optional config.
 * @returns {DataStudioSheetsPersistenceAdapter} The persistence adapter.
 */
export function createLocalStorageSheetsPersistenceAdapter(
  options: CreateLocalStorageSheetsPersistenceAdapterOptions = {},
): DataStudioSheetsPersistenceAdapter {
  const storageKey = getStorageKey(options.key);

  function read(): DataStudioSheet[] | null {
    const storage = getSheetsLocalStorage();
    if (!storage) {
      return null;
    }
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<SheetsPersistenceState> | undefined;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== SHEETS_PERSISTENCE_VERSION ||
        !Array.isArray(parsed.sheets)
      ) {
        return null;
      }
      return parsed.sheets.filter(isPersistedSheet);
    } catch {
      return null;
    }
  }

  function write(sheets: DataStudioSheet[]): void {
    const storage = getSheetsLocalStorage();
    if (!storage) {
      return;
    }
    try {
      const payload: SheetsPersistenceState = {
        version: SHEETS_PERSISTENCE_VERSION,
        sheets,
      };
      storage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage can fail in private browsing or quota-limited contexts.
    }
  }

  return { read, write };
}
