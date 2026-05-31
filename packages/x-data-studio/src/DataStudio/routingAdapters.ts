import type {
  DataStudioRoutingAdapter,
  DataStudioRoutingMode,
  DataStudioRoutingState,
} from './routing';

interface SearchParamsLike {
  get(name: string): string | null;
  toString(): string;
}

const SSR_STATE: DataStudioRoutingState = { activeDataSourceId: null, activeSheetId: null };

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined';
}

function subscribeToBrowserPopstate(onChange: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
  };
}

function buildSearch(
  current: string | SearchParamsLike,
  dataSourceParam: string,
  sheetParam: string,
  next: DataStudioRoutingState,
): string {
  const params =
    typeof current === 'string' ? new URLSearchParams(current) : new URLSearchParams(current.toString());
  if (next.activeDataSourceId == null) {
    params.delete(dataSourceParam);
  } else {
    params.set(dataSourceParam, next.activeDataSourceId);
  }
  if (next.activeSheetId == null) {
    params.delete(sheetParam);
  } else {
    params.set(sheetParam, next.activeSheetId);
  }
  return params.toString();
}

// ────────────────────────────────────────────────────────────────────────────
// Next.js App Router (`next/navigation`)
// ────────────────────────────────────────────────────────────────────────────

export interface NextNavigationRouterLike {
  push: (url: string) => void;
  replace: (url: string) => void;
}

export interface CreateNextNavigationRoutingAdapterOptions {
  /** The router returned by `useRouter()` from `next/navigation`. */
  router: NextNavigationRouterLike;
  /** The current path returned by `usePathname()` from `next/navigation`. */
  pathname: string;
  /** The search params returned by `useSearchParams()` from `next/navigation`. */
  searchParams: SearchParamsLike;
  /** Query-string key for the active dataSource id. @default 'dataSource' */
  dataSourceParam?: string;
  /** Query-string key for the active sheet id. @default 'sheet' */
  sheetParam?: string;
}

/**
 * Build a routing adapter backed by Next.js App Router primitives
 * (`useRouter`, `usePathname`, `useSearchParams` from `next/navigation`).
 *
 * Memoize the result with `React.useMemo` keyed by `[router, pathname, searchParams]`
 * so `<DataStudio>` re-subscribes only when the URL actually changes.
 *
 * @param {CreateNextNavigationRoutingAdapterOptions} options
 * @returns {DataStudioRoutingAdapter}
 */
export function createNextNavigationRoutingAdapter(
  options: CreateNextNavigationRoutingAdapterOptions,
): DataStudioRoutingAdapter {
  const { router, pathname, searchParams } = options;
  const dataSourceParam = options.dataSourceParam ?? 'dataSource';
  const sheetParam = options.sheetParam ?? 'sheet';

  // Live read: `searchParams` is a stable reference for a given URL but its
  // contents can change between renders when the user reuses an adapter that
  // closes over a parent's hook value. Cache by reference to keep `read()`
  // reference-stable while still reflecting the current URL.
  let cachedSource: SearchParamsLike | null = null;
  let cachedSnapshot: DataStudioRoutingState = SSR_STATE;

  function read(): DataStudioRoutingState {
    if (cachedSource !== searchParams) {
      cachedSource = searchParams;
      cachedSnapshot = {
        activeDataSourceId: searchParams.get(dataSourceParam),
        activeSheetId: searchParams.get(sheetParam),
      };
    }
    return cachedSnapshot;
  }

  return {
    read,
    write: (next: DataStudioRoutingState, mode: DataStudioRoutingMode) => {
      const query = buildSearch(searchParams, dataSourceParam, sheetParam, next);
      const url = `${pathname}${query ? `?${query}` : ''}`;
      if (mode === 'push') {
        router.push(url);
      } else {
        router.replace(url);
      }
    },
    subscribe: subscribeToBrowserPopstate,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Next.js Pages Router (`next/router`)
// ────────────────────────────────────────────────────────────────────────────

export interface NextPagesRouterLike {
  push: (url: string) => unknown;
  replace: (url: string) => unknown;
  pathname: string;
  query: Record<string, string | string[] | undefined>;
}

export interface CreateNextRouterRoutingAdapterOptions {
  /** The router returned by `useRouter()` from `next/router`. */
  router: NextPagesRouterLike;
  /** Query-string key for the active dataSource id. @default 'dataSource' */
  dataSourceParam?: string;
  /** Query-string key for the active sheet id. @default 'sheet' */
  sheetParam?: string;
}

function firstQueryValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

/**
 * Build a routing adapter backed by Next.js Pages Router primitives
 * (`useRouter` from `next/router`).
 *
 * Memoize the result with `React.useMemo` keyed by `router` so `<DataStudio>`
 * re-subscribes only when the router instance or its query/pathname changes.
 *
 * @param {CreateNextRouterRoutingAdapterOptions} options
 * @returns {DataStudioRoutingAdapter}
 */
export function createNextRouterRoutingAdapter(
  options: CreateNextRouterRoutingAdapterOptions,
): DataStudioRoutingAdapter {
  const { router } = options;
  const dataSourceParam = options.dataSourceParam ?? 'dataSource';
  const sheetParam = options.sheetParam ?? 'sheet';

  // Live read: `router` is typically a stable wrapper but its `query` is
  // re-assigned to a fresh object on every navigation. Cache by the current
  // `router.query` reference so `read()` returns the latest URL state while
  // still being reference-stable when nothing changed.
  let cachedQuery: typeof router.query | null = null;
  let cachedSnapshot: DataStudioRoutingState = SSR_STATE;

  function read(): DataStudioRoutingState {
    if (cachedQuery !== router.query) {
      cachedQuery = router.query;
      cachedSnapshot = {
        activeDataSourceId: firstQueryValue(router.query[dataSourceParam]),
        activeSheetId: firstQueryValue(router.query[sheetParam]),
      };
    }
    return cachedSnapshot;
  }

  return {
    read,
    write: (next: DataStudioRoutingState, mode: DataStudioRoutingMode) => {
      // Build query from the canonical router.query so unrelated dynamic-route
      // params (e.g. `[id]`) and unrelated query params survive the round-trip.
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(router.query)) {
        if (key === dataSourceParam || key === sheetParam) {
          continue;
        }
        const first = firstQueryValue(value);
        if (first != null) {
          params.set(key, first);
        }
      }
      const query = buildSearch(params.toString(), dataSourceParam, sheetParam, next);
      const url = `${router.pathname}${query ? `?${query}` : ''}`;
      if (mode === 'push') {
        router.push(url);
      } else {
        router.replace(url);
      }
    },
    subscribe: subscribeToBrowserPopstate,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// React Router v6+ (`react-router-dom`)
// ────────────────────────────────────────────────────────────────────────────

export interface ReactRouterNavigateLike {
  (url: string, options?: { replace?: boolean }): void;
}

export interface ReactRouterLocationLike {
  pathname: string;
  search: string;
  hash: string;
}

export interface CreateReactRouterRoutingAdapterOptions {
  /** The navigator returned by `useNavigate()` from `react-router-dom`. */
  navigate: ReactRouterNavigateLike;
  /** The current location returned by `useLocation()` from `react-router-dom`. */
  location: ReactRouterLocationLike;
  /** The first tuple element returned by `useSearchParams()` from `react-router-dom`. */
  searchParams: SearchParamsLike;
  /** Query-string key for the active dataSource id. @default 'dataSource' */
  dataSourceParam?: string;
  /** Query-string key for the active sheet id. @default 'sheet' */
  sheetParam?: string;
}

/**
 * Build a routing adapter backed by React Router v6+ primitives
 * (`useNavigate`, `useLocation`, `useSearchParams`).
 *
 * Memoize the result with `React.useMemo` keyed by `[navigate, location, searchParams]`
 * so `<DataStudio>` re-subscribes only when the URL actually changes.
 *
 * @param {CreateReactRouterRoutingAdapterOptions} options
 * @returns {DataStudioRoutingAdapter}
 */
export function createReactRouterRoutingAdapter(
  options: CreateReactRouterRoutingAdapterOptions,
): DataStudioRoutingAdapter {
  const { navigate, location, searchParams } = options;
  const dataSourceParam = options.dataSourceParam ?? 'dataSource';
  const sheetParam = options.sheetParam ?? 'sheet';

  // Live read with reference-stable caching — see the Pages Router adapter
  // for the rationale.
  let cachedSource: SearchParamsLike | null = null;
  let cachedSnapshot: DataStudioRoutingState = SSR_STATE;

  function read(): DataStudioRoutingState {
    if (cachedSource !== searchParams) {
      cachedSource = searchParams;
      cachedSnapshot = {
        activeDataSourceId: searchParams.get(dataSourceParam),
        activeSheetId: searchParams.get(sheetParam),
      };
    }
    return cachedSnapshot;
  }

  return {
    read,
    write: (next: DataStudioRoutingState, mode: DataStudioRoutingMode) => {
      const query = buildSearch(searchParams, dataSourceParam, sheetParam, next);
      const url = `${location.pathname}${query ? `?${query}` : ''}${location.hash}`;
      navigate(url, { replace: mode === 'replace' });
    },
    subscribe: subscribeToBrowserPopstate,
  };
}
