import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GridColumnsPreProcessing,
  GridColumnsPreProcessingApi,
} from './gridColumnsPreProcessingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridEvents } from '../../../constants/eventsConstants';

export const useGridColumnsPreProcessing = (apiRef: GridApiRef) => {
  const columnsPreProcessingRef = React.useRef(new Map<string, GridColumnsPreProcessing | null>());

  const registerColumnPreProcessing = React.useCallback<
    GridColumnsPreProcessingApi['unstable_registerColumnPreProcessing']
  >(
    (processingName, columnsPreProcessing) => {
      const columnPreProcessingBefore = columnsPreProcessingRef.current.get(processingName) ?? null;

      if (columnPreProcessingBefore !== columnsPreProcessing) {
        columnsPreProcessingRef.current.set(processingName, columnsPreProcessing);
        apiRef.current.publishEvent(GridEvents.columnsPreProcessingChange);
      }
    },
    [apiRef],
  );

  const applyAllColumnPreProcessing = React.useCallback<
    GridColumnsPreProcessingApi['unstable_applyAllColumnPreProcessing']
  >((columns) => {
    let preProcessedColumns = columns;

    columnsPreProcessingRef.current.forEach((columnsPreProcessing) => {
      if (columnsPreProcessing) {
        preProcessedColumns = columnsPreProcessing(preProcessedColumns);
      }
    });

    return preProcessedColumns;
  }, []);

  const columnsPreProcessingApi: GridColumnsPreProcessingApi = {
    unstable_registerColumnPreProcessing: registerColumnPreProcessing,
    unstable_applyAllColumnPreProcessing: applyAllColumnPreProcessing,
  };

  useGridApiMethod(apiRef, columnsPreProcessingApi, 'GridColumnsPreProcessing');
};
