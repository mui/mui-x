import { useCallback, useRef } from 'react';
import { useLogger } from './useLogger';

type UseRafUpdateReturnType = [(...args: any[]) => void, (fn: (args: any) => void) => void];
export function useRafUpdate(initialFn?: (...args: any) => void): UseRafUpdateReturnType {
  const logger = useLogger('useRafUpdate');
  const rafRef = useRef(0);
  const fn = useRef(initialFn);

  const setUpdate = useCallback((updateFn: (...args: any[]) => void) => {
    fn.current = updateFn;
  }, []);

  const runUpdate = useCallback(
    (...args: any[]) => {
      if (!fn) {
        return;
      }
      if (rafRef.current > 0) {
        logger.debug('Skipping previous update');
        cancelAnimationFrame(rafRef.current);
      }
      logger.debug('Queuing new update');
      rafRef.current = requestAnimationFrame(() => {
        fn.current!(...args);
        rafRef.current = 0;
      });
    },
    [logger],
  );

  return [runUpdate, setUpdate];
}
