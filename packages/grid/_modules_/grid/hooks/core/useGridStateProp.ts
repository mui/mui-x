import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';
import { useGridState } from '../utils/useGridState';
import { useGridLogger } from '../utils/useGridLogger';

export function useGridStateProp(apiRef: GridApiRef, { state }: { state?: Partial<GridState> }) {
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
