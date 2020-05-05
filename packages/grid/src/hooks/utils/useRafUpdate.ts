import { useRef } from 'react';
import { useLogger } from './useLogger';

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
      logger.debug('Skipping previous update');
      cancelAnimationFrame(rafRef.current);
    }
    logger.debug('Queuing new update');
    rafRef.current = requestAnimationFrame(() => {
      fn!(...args);
      rafRef.current = 0;
    });
  };

  return [runUpdate, setUpdate];
}
