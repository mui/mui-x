import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { useGridApiEventHandler } from '../../root';
import { GRID_COLUMN_RESIZE_START } from '../../../constants';

export const useGridColumnMenu = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridColumnMenu');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const showColumnMenu = React.useCallback(
    (field: string) => {
      logger.debug('Opening Column Menu');
      setGridState((state) => ({
        ...state,
        columnMenu: { open: true, field },
      }));
      apiRef.current.hidePreferences();
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const hideColumnMenu = React.useCallback(() => {
    logger.debug('Hiding Column Menu');
    setGridState((state) => ({
      ...state,
      columnMenu: { ...state.columnMenu, open: false, field: undefined },
    }));
    forceUpdate();
  }, [forceUpdate, logger, setGridState]);

  const toggleColumnMenu = React.useCallback(
    (field: string) => {
      logger.debug('Toggle Column Menu');
      if (!gridState.columnMenu.open || gridState.columnMenu.field !== field) {
        showColumnMenu(field);
      } else {
        hideColumnMenu();
      }
    },
    [logger, showColumnMenu, hideColumnMenu, gridState],
  );

  const handleColumnResizeStart = React.useCallback(() => {
    setGridState((oldState) => {
      if (oldState.columnMenu.open) {
        return {
          ...oldState,
          columnMenu: {
            ...oldState.columnMenu,
            open: false,
          },
        };
      }

      return oldState;
    });
  }, [setGridState]);

  React.useEffect(() => {
    if (gridState.isScrolling) {
      hideColumnMenu();
    }
  }, [gridState.isScrolling, hideColumnMenu]);

  useGridApiMethod(
    apiRef,
    {
      showColumnMenu,
      hideColumnMenu,
      toggleColumnMenu,
    },
    'ColumnMenuApi',
  );

  useGridApiEventHandler(apiRef, GRID_COLUMN_RESIZE_START, handleColumnResizeStart);
};
