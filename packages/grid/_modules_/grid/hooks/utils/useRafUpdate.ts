import * as React from 'react';
import { useLogger } from './useLogger';

type UseRafUpdateReturnType = [(...args: any[]) => void, (fn: (args: any) => void) => void];

// ⚠️ Usage STRICTLY reserved to `useGridState`.
export function useRafUpdate(
  apiRef: any,
  initialFn?: (...args: any) => void,
): UseRafUpdateReturnType {
  const logger = useLogger('useRafUpdate');
  const fn = React.useRef(initialFn);

  const setUpdate = React.useCallback((updateFn: (...args: any[]) => void) => {
    fn.current = updateFn;
  }, []);

  const runUpdate = React.useCallback(
    (...args: any[]) => {
      if (!fn.current) {
        return;
      }
      if (apiRef.current.rafTimer > 0) {
        logger.debug('Skipping previous update');
        cancelAnimationFrame(apiRef.current.rafTimer);
      }
      logger.debug('Queuing new update');
      apiRef.current.rafTimer = requestAnimationFrame(() => {
        fn.current!(...args);
        apiRef.current.rafTimer = 0;
      });
    },
    [apiRef, logger],
  );

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(apiRef!.current!.rafTimer);
    };
  }, [apiRef]);

  return [runUpdate, setUpdate];
}
