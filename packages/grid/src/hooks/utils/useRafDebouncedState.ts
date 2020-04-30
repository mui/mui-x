import { useEffect, useRef, useState } from 'react';
import { useLogger } from './useLogger';
import { debounce, isEqual } from '../../utils/utils';

type UseRafUpdateReturnType = [(...args) => void, (fn: (args) => void) => void];
export function useRafUpdate(initialFn?: (...args: any) => void): UseRafUpdateReturnType {
  const logger = useLogger('useRafUpdate');
  const rafRef = useRef(0);
  let fn = initialFn;

  const setUpdate = (updateFn: (...args) => void) => {
    fn = updateFn;
  };

  const runUpdate = (...args) => {
    if (!fn) {
      return;
    }
    if (rafRef.current > 0) {
      logger.debug('Skipping another update');
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      fn!(...args);
    });
  };

  return [runUpdate, setUpdate];
}

export function useRafDebouncedState<S>(
  initialState: S | (() => S),
  time = 30,
  deepEqualCheck = true,
): [S, (v: S) => void] {
  const logger = useLogger('useRafDebouncedState');
  const [state, setState] = useState<S>(initialState);
  const [runUpdate, setUpdateFn] = useRafUpdate();
  const previousStateRef = useRef<S>(state);

  const updateState = (v: S) => {
    const shouldUpdate = deepEqualCheck ? !isEqual(v, previousStateRef.current) : v !== previousStateRef.current;
    if (shouldUpdate) {
      logger.debug('+++++ FORCING RENDER +++++');
      logger.debug('resetting state ');
      previousStateRef.current = v;
      setState(v);
    } else {
      logger.debug('Same state as current one');
    }
  };

  setUpdateFn(updateState);
  const rerender = debounce(v => runUpdate(v), time);

  useEffect(() => {
    return () => {
      rerender.cancel();
    };
  }, []);

  return [state, (rerender as unknown) as (v: S) => void];
}
