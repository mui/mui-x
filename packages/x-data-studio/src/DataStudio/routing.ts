/**
 * Navigation state mirrored to a URL by a `DataStudioRoutingAdapter`.
 */
export interface DataStudioRoutingState {
  activeDatasetId: string | null;
  activeViewId: string | null;
}

/**
 * History mode used when writing navigation state back to the routing source.
 * - `'push'`: appends a new entry to the history stack (user-driven navigation).
 * - `'replace'`: rewrites the current entry (programmatic alignment, e.g. clamping invalid ids).
 */
export type DataStudioRoutingMode = 'push' | 'replace';

/**
 * Adapter contract used by `<DataStudio>` to mirror the active dataset and view
 * into an external routing source (URL, in-memory router, etc.) and react to
 * external navigation (back/forward).
 */
export interface DataStudioRoutingAdapter {
  /**
   * Read the current navigation state from the routing source.
   * Called from `useSyncExternalStore`'s snapshot path — must be cheap and must
   * return a reference-stable result for the same underlying URL.
   * @returns {DataStudioRoutingState} The current routing state.
   */
  read: () => DataStudioRoutingState;
  /**
   * Write the new navigation state back to the routing source.
   * @param {DataStudioRoutingState} next The next navigation state.
   * @param {DataStudioRoutingMode} mode Either `'push'` or `'replace'`.
   */
  write: (next: DataStudioRoutingState, mode: DataStudioRoutingMode) => void;
  /**
   * Subscribe to external navigation events (popstate, programmatic navigation
   * outside of `<DataStudio>`).
   * @param {() => void} onChange Called whenever the underlying URL changes.
   * @returns {() => void} Unsubscribe function.
   */
  subscribe: (onChange: () => void) => () => void;
}

export interface CreateSearchParamsRoutingAdapterOptions {
  /**
   * Query-string key for the active dataset id.
   * @default 'dataset'
   */
  datasetParam?: string;
  /**
   * Query-string key for the active view id.
   * @default 'view'
   */
  viewParam?: string;
}

const SSR_STATE: DataStudioRoutingState = { activeDatasetId: null, activeViewId: null };
const ROUTING_CHANGE_EVENT = 'mui-data-studio-routing';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.history !== 'undefined';
}

/**
 * Build a routing adapter that mirrors the active dataset/view into the URL's
 * query string using `window.history` + `URLSearchParams`. Suitable for any
 * client-side app that exposes a real `window.location`; SSR returns the
 * neutral state and never throws.
 *
 * @param {CreateSearchParamsRoutingAdapterOptions} [options] Optional config.
 * @returns {DataStudioRoutingAdapter} The routing adapter.
 */
export function createSearchParamsRoutingAdapter(
  options: CreateSearchParamsRoutingAdapterOptions = {},
): DataStudioRoutingAdapter {
  const datasetParam = options.datasetParam ?? 'dataset';
  const viewParam = options.viewParam ?? 'view';

  // Snapshot cache: keep a reference-stable object for each unique search string.
  // `useSyncExternalStore` invokes `read` on every render and will loop if we
  // return a fresh object every time.
  let cachedSearch: string | null = null;
  let cachedState: DataStudioRoutingState = SSR_STATE;

  function read(): DataStudioRoutingState {
    if (!isBrowser()) {
      return SSR_STATE;
    }
    const search = window.location.search;
    if (search === cachedSearch) {
      return cachedState;
    }
    const params = new URLSearchParams(search);
    cachedSearch = search;
    cachedState = {
      activeDatasetId: params.get(datasetParam),
      activeViewId: params.get(viewParam),
    };
    return cachedState;
  }

  function write(next: DataStudioRoutingState, mode: DataStudioRoutingMode): void {
    if (!isBrowser()) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (next.activeDatasetId == null) {
      params.delete(datasetParam);
    } else {
      params.set(datasetParam, next.activeDatasetId);
    }
    if (next.activeViewId == null) {
      params.delete(viewParam);
    } else {
      params.set(viewParam, next.activeViewId);
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    if (mode === 'push') {
      window.history.pushState(null, '', url);
    } else {
      window.history.replaceState(null, '', url);
    }
    // history.pushState/replaceState do not fire popstate; broadcast our own
    // event so other adapter subscribers (and other <DataStudio> instances on
    // the page) pick up the change.
    window.dispatchEvent(new Event(ROUTING_CHANGE_EVENT));
  }

  function subscribe(onChange: () => void): () => void {
    if (!isBrowser()) {
      return () => {};
    }
    window.addEventListener('popstate', onChange);
    window.addEventListener(ROUTING_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener(ROUTING_CHANGE_EVENT, onChange);
    };
  }

  return { read, write, subscribe };
}
