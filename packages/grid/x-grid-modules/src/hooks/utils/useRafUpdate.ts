import * as React from 'react';
import { useLogger } from './useLogger';

type UseRafUpdateReturnType = [(...args: any[]) => void, (fn: (args: any) => void) => void];
export function useRafUpdate(initialFn?: (...args: any) => void): UseRafUpdateReturnType {
  const logger = useLogger('useRafUpdate');
  const fn = React.useRef(initialFn);

  const setUpdate = React.useCallback((updateFn: (...args: any[]) => void) => {
    fn.current = updateFn;
  }, []);

  const runUpdate = React.useCallback(
    (...args: any[]) => {
      if (!fn) {
        return;
      }

      logger.debug('Queuing new update');
      fn.current!(...args);
    },
    [logger],
  );

  return [runUpdate, setUpdate];
}
