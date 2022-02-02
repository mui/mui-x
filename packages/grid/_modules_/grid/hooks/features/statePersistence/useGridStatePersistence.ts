import * as React from 'react';
import { GridApiRefCommunity, GridInitialStateCommunity } from '../../../models';
import { GridStatePersistenceApi } from './GridStatePersistenceApi';
import { useGridApiMethod } from '../../utils';

export const useGridStatePersistence = (apiRef: GridApiRefCommunity) => {
  const exportState = React.useCallback<GridStatePersistenceApi['exportState']>(() => {
    const stateToExport = apiRef.current.unstable_applyPreProcessors('exportState', {});

    return stateToExport as GridInitialStateCommunity;
  }, [apiRef]);

  const restoreState = React.useCallback<GridStatePersistenceApi['restoreState']>(
    (stateToRestore) => {
      const response = apiRef.current.unstable_applyPreProcessors(
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

  const statePersistenceApi: GridStatePersistenceApi = {
    exportState,
    restoreState,
  };

  useGridApiMethod(apiRef, statePersistenceApi, 'GridStatePersistenceApi');
};
