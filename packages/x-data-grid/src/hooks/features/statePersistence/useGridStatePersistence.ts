import * as React from 'react';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridStatePersistenceApi } from './gridStatePersistenceInterface';
import { useGridApiMethod } from '../../utils';

export const useGridStatePersistence = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
) => {
  const exportState = React.useCallback<
    GridStatePersistenceApi<GridInitialStateCommunity>['exportState']
  >(
    (params = {}) => {
      const stateToExport = apiRef.current.unstable_applyPipeProcessors('exportState', {}, params);

      return stateToExport as GridInitialStateCommunity;
    },
    [apiRef],
  );

  const restoreState = React.useCallback<
    GridStatePersistenceApi<GridInitialStateCommunity>['restoreState']
  >(
    (stateToRestore) => {
      const response = apiRef.current.unstable_applyPipeProcessors(
        'restoreState',
        {
          callbacks: [],
        },
        {
          stateToRestore,
        },
      );

      response.callbacks.forEach((callback) => {
        callback();
      });

      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const statePersistenceApi: GridStatePersistenceApi<GridInitialStateCommunity> = {
    exportState,
    restoreState,
  };

  useGridApiMethod(apiRef, statePersistenceApi, 'public');
};
