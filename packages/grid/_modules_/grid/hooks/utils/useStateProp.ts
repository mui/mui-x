import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { GridState } from '../features/core/gridState';
import { useGridState } from '../features/core/useGridState';
import { useLogger } from './useLogger';

export function useStateProp(apiRef: ApiRef, stateProp?: Partial<GridState>) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const logger = useLogger('useStateProp');

  React.useEffect(() => {
    if (stateProp != null && apiRef.current.state !== stateProp) {
      logger.debug('Overriding state with props.state');
      setGridState((previousState) => ({ ...previousState, ...stateProp! }));
      forceUpdate();
    }
  }, [apiRef, forceUpdate, logger, stateProp, setGridState]);
}
