import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../features/core/gridState';
import { useGridState } from '../features/core/useGridState';
import { useGridLogger } from './useGridLogger';

export function useStateProp(apiRef: GridApiRef, { state }: { state?: Partial<GridState> }) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const logger = useGridLogger(apiRef, 'useStateProp');

  React.useEffect(() => {
    if (state != null && apiRef.current.state !== state) {
      logger.debug('Overriding state with props.state');
      setGridState((previousState) => ({ ...previousState, ...state! }));
      forceUpdate();
    }
  }, [apiRef, forceUpdate, logger, state, setGridState]);
}
