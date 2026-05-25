import type { DataStudioView } from './DataStudio.types';

/**
 * Adapter contract used by `<DataStudio>` to persist the list of user-created
 * views across mounts (page reloads, navigation away and back, etc.).
 *
 * Views are persisted as a flat list — each view carries its own `datasetId`,
 * so multiple datasets in the same studio share a single persisted bucket.
 * Active selection (which view/dataset is open) is the routing adapter's
 * responsibility, not this one.
 *
 * SSR contract: `read` must return `null` and `write` must be a no-op when no
 * storage is available. Neither may throw.
 */
export interface DataStudioViewsPersistenceAdapter {
  /**
   * Read the persisted list of views. Called once during hydration.
   * @returns {DataStudioView[] | null} The persisted views, or `null` when
   *   nothing has been persisted yet (the component falls back to
   *   `defaultViews`).
   */
  read: () => DataStudioView[] | null;
  /**
   * Persist the next list of views. Called every time the views list mutates
   * (add, rename, duplicate, delete, move, updateView). Best-effort —
   * implementations must swallow errors.
   * @param {DataStudioView[]} views The next list of views.
   */
  write: (views: DataStudioView[]) => void;
}

export interface CreateLocalStorageViewsPersistenceAdapterOptions {
  /**
   * Logical namespace for the persisted views. Use distinct keys when the
   * same page hosts independent `<DataStudio>` instances.
   * @default 'default'
   */
  key?: string;
}

const DEFAULT_STORAGE_NAMESPACE = 'default';
const STORAGE_KEY_PREFIX = 'mui-x-data-studio-views:v1';
const VIEWS_PERSISTENCE_VERSION = 1;

interface ViewsPersistenceState {
  version: typeof VIEWS_PERSISTENCE_VERSION;
  views: DataStudioView[];
}

function getStorageKey(namespace: string | undefined): string {
  return `${STORAGE_KEY_PREFIX}:${namespace ?? DEFAULT_STORAGE_NAMESPACE}`;
}

function getViewsLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storage = window.localStorage;
    const testKey = '__mui_x_data_studio_views_storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function isPersistedView(value: unknown): value is DataStudioView {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as { id?: unknown; datasetId?: unknown };
  return typeof candidate.id === 'string' && typeof candidate.datasetId === 'string';
}

/**
 * Build a views-persistence adapter backed by `window.localStorage`. SSR-safe:
 * returns `null` from `read` and is a no-op on `write` when storage is
 * unavailable (no window, private mode, or quota error).
 *
 * @param {CreateLocalStorageViewsPersistenceAdapterOptions} [options] Optional config.
 * @returns {DataStudioViewsPersistenceAdapter} The persistence adapter.
 */
export function createLocalStorageViewsPersistenceAdapter(
  options: CreateLocalStorageViewsPersistenceAdapterOptions = {},
): DataStudioViewsPersistenceAdapter {
  const storageKey = getStorageKey(options.key);

  function read(): DataStudioView[] | null {
    const storage = getViewsLocalStorage();
    if (!storage) {
      return null;
    }
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<ViewsPersistenceState> | undefined;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== VIEWS_PERSISTENCE_VERSION ||
        !Array.isArray(parsed.views)
      ) {
        return null;
      }
      return parsed.views.filter(isPersistedView);
    } catch {
      return null;
    }
  }

  function write(views: DataStudioView[]): void {
    const storage = getViewsLocalStorage();
    if (!storage) {
      return;
    }
    try {
      const payload: ViewsPersistenceState = {
        version: VIEWS_PERSISTENCE_VERSION,
        views,
      };
      storage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage can fail in private browsing or quota-limited contexts.
    }
  }

  return { read, write };
}
