import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import {
  GridColumnsPreProcessing,
  GridColumnsPreProcessingApi,
} from './gridColumnsPreProcessingApi';
import { useGridApiMethod } from '../useGridApiMethod';
import { GridEvents } from '../../../constants/eventsConstants';

export const useGridColumnsPreProcessing = (apiRef: GridApiRef) => {
  const columnsPreProcessingRef = React.useRef(new Map<string, GridColumnsPreProcessing>());

  const registerColumnPreProcessing = React.useCallback<
    GridColumnsPreProcessingApi['registerColumnPreProcessing']
  >(
    (processingName, columnsPreProcessing: GridColumnsPreProcessing) => {
      columnsPreProcessingRef.current.set(processingName, columnsPreProcessing);

      apiRef.current.publishEvent(GridEvents.columnsPreProcessingChange);

      return () => columnsPreProcessingRef.current.delete(processingName);
    },
    [apiRef],
  );

  const applyAllColumnPreProcessing = React.useCallback<
    GridColumnsPreProcessingApi['applyAllColumnPreProcessing']
  >((columns) => {
    let preProcessedColumns = columns;

    columnsPreProcessingRef.current.forEach((columnsPreProcessing) => {
      preProcessedColumns = columnsPreProcessing(preProcessedColumns);
    });

    return preProcessedColumns;
  }, []);

  const columnsPreProcessingApi: GridColumnsPreProcessingApi = {
    registerColumnPreProcessing,
    applyAllColumnPreProcessing,
  };

  useGridApiMethod(apiRef, columnsPreProcessingApi, 'GridColumnsPreProcessing');
};
