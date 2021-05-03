import * as React from 'react';
import {
  GRID_CELL_BLUR,
  GRID_CELL_FOCUS,
  GRID_COLUMN_HEADER_BLUR,
  GRID_COLUMN_HEADER_FOCUS,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFocusApi } from '../../../models/api/gridFocusApi';
import {
  GridCellIndexCoordinates,
  GridColumnHeaderIndexCoordinates,
} from '../../../models/gridCell';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridState } from '../core/useGridState';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridCellIdentifier, GridColIdentifier } from './gridFocusState';

export const useGridFocus = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridFocus');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const setCellFocus = React.useCallback(
    ({id, field}: GridCellIdentifier) => {
      setGridState((state) => {
        logger.debug(`Focusing on cell with id=${id} and field=${field}`);
        return {
          ...state,
          tabIndex: { cell: {id, field}, columnHeader: null },
          focus: { cell: {id, field}, columnHeader: null },
        };
      });
      apiRef.current.publishEvent('cellFocusChange');
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const setColumnHeaderFocus = React.useCallback(
    ({field}: GridColIdentifier) => {
      setGridState((state) => {
        logger.debug(`Focusing on column header with colIndex=${field}`);

        return {
          ...state,
          tabIndex: { columnHeader: { field }, cell: null },
          focus: { columnHeader: { field }, cell: null },
        };
      });
      apiRef.current.publishEvent('cellFocusChange');

      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const handleCellFocus = React.useCallback(
    (params: GridCellParams, event?: React.SyntheticEvent) => {
      if (event?.target !== event?.currentTarget) {
        return;
      }
      apiRef.current.setCellFocus(params);
    },
    [apiRef],
  );

  const handleColumnHeaderFocus = React.useCallback(
    (params: GridCellParams, event?: React.SyntheticEvent) => {
      if (event?.target !== event?.currentTarget) {
        return;
      }
      apiRef.current.setColumnHeaderFocus(params);
    },
    [apiRef],
  );

  const handleBlur = React.useCallback(() => {
    logger.debug(`Clearing focus`);
    setGridState((previousState) => ({
      ...previousState,
      focus: { cell: null, columnHeader: null },
    }));
  }, [logger, setGridState]);

  useGridApiMethod<GridFocusApi>(
    apiRef,
    {
      setCellFocus,
      setColumnHeaderFocus,
    },
    'GridFocusApi',
  );
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_BLUR, handleBlur);
  useGridApiEventHandler(apiRef, GRID_CELL_BLUR, handleBlur);
  useGridApiEventHandler(apiRef, GRID_CELL_FOCUS, handleCellFocus);
  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_FOCUS, handleColumnHeaderFocus);
};
