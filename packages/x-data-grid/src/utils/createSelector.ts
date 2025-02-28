import { RefObject } from '@mui/x-internals/types';
import { lruMemoize, createSelectorCreator, Selector, SelectorResultArray } from 'reselect';
import { argsEqual } from '../hooks/utils/useGridSelector';
import { weakMapMemoize as customWeakMapMemoize } from './weakMapMemoize';

type CacheKey = { id: number };

const reselectCreateSelector = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: {
    maxSize: 1,
    equalityCheck: Object.is,
  },
  argsMemoize: customWeakMapMemoize,
});

type GridCreateSelectorFunction = ReturnType<typeof reselectCreateSelector> & {
  selectorArgs?: any;
};

export interface OutputSelector<State, Args, Result> {
  (apiRef: RefObject<{ state: State } | null>, args?: Args): Result;
}

type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any
  ? F extends RefObject<{ state: infer F2 } | null>
    ? F2
    : F
  : never;

type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [
  f: infer F,
  ...other: infer R,
]
  ? StateFromSelector<F> extends StateFromSelectorList<R>
    ? StateFromSelector<F>
    : StateFromSelectorList<R>
  : {};

type SelectorResultArrayWithArgs<Selectors extends ReadonlyArray<Selector<any>>, Args> = [
  ...SelectorResultArray<Selectors>,
  Args,
];

type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Args, Result> =
  // Input selectors as a separate array
  | [
      selectors: [...Selectors],
      combiner: (...args: SelectorResultArrayWithArgs<Selectors, Args>) => Result,
    ]
  // Input selectors as separate inline arguments
  | [...Selectors, (...args: SelectorResultArrayWithArgs<Selectors, Args>) => Result];

type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Args, Result>(
  ...items: SelectorArgs<Selectors, Args, Result>
) => OutputSelector<StateFromSelectorList<Selectors>, Args, Result>;

const cache = new WeakMap<CacheKey, Map<any[], any>>();

export const createSelector = ((
  a: Function,
  b: Function,
  c?: Function,
  d?: Function,
  // eslint-disable-next-line id-denylist
  e?: Function,
  f?: Function,
  ...other: any[]
) => {
  if (other.length > 0) {
    throw new Error('Unsupported number of selectors');
  }

  let selector: any;

  // eslint-disable-next-line id-denylist
  if (a && b && c && d && e && f) {
    selector = (apiRef: RefObject<any>, args: any) => {
      const va = a(apiRef, args);
      const vb = b(apiRef, args);
      const vc = c(apiRef, args);
      const vd = d(apiRef, args);
      const ve = e(apiRef, args);
      return f(va, vb, vc, vd, ve, args);
    };
    // eslint-disable-next-line id-denylist
  } else if (a && b && c && d && e) {
    selector = (apiRef: RefObject<any>, args: any) => {
      const va = a(apiRef, args);
      const vb = b(apiRef, args);
      const vc = c(apiRef, args);
      const vd = d(apiRef, args);
      return e(va, vb, vc, vd, args);
    };
  } else if (a && b && c && d) {
    selector = (apiRef: RefObject<any>, args: any) => {
      const va = a(apiRef, args);
      const vb = b(apiRef, args);
      const vc = c(apiRef, args);
      return d(va, vb, vc, args);
    };
  } else if (a && b && c) {
    selector = (apiRef: RefObject<any>, args: any) => {
      const va = a(apiRef, args);
      const vb = b(apiRef, args);
      return c(va, vb, args);
    };
  } else if (a && b) {
    selector = (apiRef: RefObject<any>, args: any) => {
      const va = a(apiRef, args);
      return b(va, args);
    };
  } else {
    throw new Error('Missing arguments');
  }

  return selector;
}) as unknown as CreateSelectorFunction;

/**
 * Used to create the root selector for a feature. It assumes that the state is already initialized
 * and strips from the types the possibility of `apiRef` being `null`.
 * Users are warned about this in our documentation https://mui.com/x/react-data-grid/state/#direct-selector-access
 */
export const createRootSelector =
  <State, Args, Result>(
    fn: (state: State, args: Args) => Result,
  ): OutputSelector<State, Args, Result> =>
  (apiRef: RefObject<{ state: State } | null>, args?: Args) =>
    fn(apiRef.current!.state, args!);

export const createSelectorMemoized: CreateSelectorFunction = (...args: any) => {
  const selector = (apiRef: RefObject<any>, selectorArgs: any) => {
    const cacheKey = apiRef.current.instanceId;
    const cacheArgsInit = cache.get(cacheKey);
    const cacheArgs = cacheArgsInit ?? new Map();
    const cacheFn = cacheArgs.get(args);

    if (cacheArgs && cacheFn) {
      if (!argsEqual(cacheFn.selectorArgs, selectorArgs)) {
        const reselectArgs =
          selectorArgs !== undefined
            ? [...args.slice(0, args.length - 1), () => selectorArgs, args[args.length - 1]]
            : args;
        const fn: GridCreateSelectorFunction = reselectCreateSelector(...reselectArgs);
        fn.selectorArgs = selectorArgs;
        cacheArgs.set(args, fn);
        return fn(apiRef, selectorArgs);
      }
      return cacheFn(apiRef, selectorArgs);
    }

    const reselectArgs =
      selectorArgs !== undefined
        ? [...args.slice(0, args.length - 1), () => selectorArgs, args[args.length - 1]]
        : args;

    const fn: GridCreateSelectorFunction = reselectCreateSelector(...reselectArgs);
    fn.selectorArgs = selectorArgs;

    if (!cacheArgsInit) {
      cache.set(cacheKey, cacheArgs);
    }
    cacheArgs.set(args, fn);

    return fn(apiRef, selectorArgs);
  };

  return selector;
};
