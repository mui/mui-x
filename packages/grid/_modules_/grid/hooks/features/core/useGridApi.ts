import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { GridApi } from '../../../models/api/gridApi';
import { useLogger } from '../../utils/useLogger';
import { getInitialState } from './gridState';

export const useGridApi = (apiRef: ApiRef): GridApi => {
  const logger = useLogger('useGridApi');
  const [, forceUpdate] = React.useState();
  if (!apiRef.current.isInitialised && !apiRef.current.state) {
    logger.info('Initialising state.');
    apiRef.current.state = getInitialState();
    apiRef.current.forceUpdate = forceUpdate;
    apiRef.current.getState = <State>(stateId?: string) =>
      (stateId ? apiRef.current.state[stateId] : apiRef.current.state) as State;
  }

  return apiRef.current;
};
