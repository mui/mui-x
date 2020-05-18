import { useRef } from 'react';
import { useLogger } from './useLogger';

type UseRafUpdateReturnType = [(...args: any[]) => void, (fn: (args: any) => void) => void];
export function useRafUpdate(initialFn?: (...args: any) => void): UseRafUpdateReturnType {
  const logger = useLogger('useRafUpdate');
  const rafRef = useRef(0);
  let fn = initialFn;

  const setUpdate = (updateFn: (...args: any[]) => void) => {
    fn = updateFn;
  };

  const runUpdate = (...args: any[]) => {
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
