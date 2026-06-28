import type { DataStudioJointSourceConfig } from './DataStudio.types';

/**
 * Adapter contract used by `<DataStudio>` to persist user-created joint sources
 * across mounts. Joint sources are never defined in code — they are authored in
 * the UI and stored here so they survive reloads.
 *
 * SSR contract: `read` must return `null` and `write` must be a no-op when no
 * storage is available. Neither may throw.
 */
export interface DataStudioJointSourcesPersistenceAdapter {
  /**
   * Read the persisted joint sources. Called once during hydration.
   * @returns {DataStudioJointSourceConfig[] | null} The persisted joint sources,
   *   or `null` when nothing has been persisted yet.
   */
  read: () => DataStudioJointSourceConfig[] | null;
  /**
   * Persist the next list of joint sources. Called on every create/delete.
   * Best-effort — implementations must swallow errors.
   * @param {DataStudioJointSourceConfig[]} jointSources The next list.
   */
  write: (jointSources: DataStudioJointSourceConfig[]) => void;
}

export interface CreateLocalStorageJointSourcesPersistenceAdapterOptions {
  /**
   * Logical namespace for the persisted joint sources. Use distinct keys when
   * the same page hosts independent `<DataStudio>` instances.
   * @default 'default'
   */
  key?: string;
}

const DEFAULT_STORAGE_NAMESPACE = 'default';
const STORAGE_KEY_PREFIX = 'mui-x-data-studio-joint-sources:v1';
const JOINT_SOURCES_PERSISTENCE_VERSION = 1;

interface JointSourcesPersistenceState {
  version: typeof JOINT_SOURCES_PERSISTENCE_VERSION;
  jointSources: DataStudioJointSourceConfig[];
}

function getStorageKey(namespace: string | undefined): string {
  return `${STORAGE_KEY_PREFIX}:${namespace ?? DEFAULT_STORAGE_NAMESPACE}`;
}

function getJointSourcesLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storage = window.localStorage;
    const testKey = '__mui_x_data_studio_joint_sources_storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function isPersistedJointSource(value: unknown): value is DataStudioJointSourceConfig {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as {
    id?: unknown;
    label?: unknown;
    definition?: { base?: unknown; joins?: unknown; columns?: unknown };
  };
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.definition === 'object' &&
    candidate.definition !== null &&
    typeof candidate.definition.base === 'string' &&
    Array.isArray(candidate.definition.joins) &&
    Array.isArray(candidate.definition.columns)
  );
}

/**
 * Build a joint-sources persistence adapter backed by `window.localStorage`.
 * SSR-safe: returns `null` from `read` and is a no-op on `write` when storage is
 * unavailable (no window, private mode, or quota error).
 * @param {CreateLocalStorageJointSourcesPersistenceAdapterOptions} [options] Optional config.
 * @returns {DataStudioJointSourcesPersistenceAdapter} The persistence adapter.
 */
export function createLocalStorageJointSourcesPersistenceAdapter(
  options: CreateLocalStorageJointSourcesPersistenceAdapterOptions = {},
): DataStudioJointSourcesPersistenceAdapter {
  const storageKey = getStorageKey(options.key);

  function read(): DataStudioJointSourceConfig[] | null {
    const storage = getJointSourcesLocalStorage();
    if (!storage) {
      return null;
    }
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as Partial<JointSourcesPersistenceState> | undefined;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== JOINT_SOURCES_PERSISTENCE_VERSION ||
        !Array.isArray(parsed.jointSources)
      ) {
        return null;
      }
      return parsed.jointSources.filter(isPersistedJointSource);
    } catch {
      return null;
    }
  }

  function write(jointSources: DataStudioJointSourceConfig[]): void {
    const storage = getJointSourcesLocalStorage();
    if (!storage) {
      return;
    }
    try {
      const payload: JointSourcesPersistenceState = {
        version: JOINT_SOURCES_PERSISTENCE_VERSION,
        jointSources,
      };
      storage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Storage can fail in private browsing or quota-limited contexts.
    }
  }

  return { read, write };
}
