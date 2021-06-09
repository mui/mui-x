import * as React from 'react';
import {
  GRID_CELL_BLUR,
  GRID_CELL_FOCUS,
  GRID_COLUMN_HEADER_BLUR,
  GRID_COLUMN_HEADER_FOCUS,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFocusApi } from '../../../models/api/gridFocusApi';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridState } from '../core/useGridState';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';

export const useGridFocus = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridFocus');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const setCellFocus = React.useCallback(
    (id: GridRowId, field: string) => {
      setGridState((state) => {
        logger.debug(`Focusing on cell with id=${id} and field=${field}`);
        return {
          ...state,
          tabIndex: { cell: { id, field }, columnHeader: null },
          focus: { cell: { id, field }, columnHeader: null },
        };
      });
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const setColumnHeaderFocus = React.useCallback(
    (field: string) => {
      setGridState((state) => {
        logger.debug(`Focusing on column header with colIndex=${field}`);

        return {
          ...state,
          tabIndex: { columnHeader: { field }, cell: null },
          focus: { columnHeader: { field }, cell: null },
        };
      });
      forceUpdate();
    },
    [forceUpdate, logger, setGridState],
  );

  const handleCellFocus = React.useCallback(
    ({ id, field }: GridCellParams, event?: React.SyntheticEvent) => {
      if (event?.target !== event?.currentTarget) {
        return;
      }
      apiRef.current.setCellFocus(id, field);
    },
    [apiRef],
  );

  const handleColumnHeaderFocus = React.useCallback(
    ({ field }: GridCellParams, event?: React.SyntheticEvent) => {
      if (event?.target !== event?.currentTarget) {
        return;
      }
      apiRef.current.setColumnHeaderFocus(field);
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
