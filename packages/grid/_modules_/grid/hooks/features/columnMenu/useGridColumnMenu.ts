import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants/eventsConstants';

/**
 * @requires useGridPreferencePanel (method)
 * @requires useGridVirtualRows (state)
 */
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
    [logger, showColumnMenu, hideColumnMenu, gridState.columnMenu],
  );

  const handleColumnResizeStart = React.useCallback(() => {
    setGridState((state) => {
      if (state.columnMenu.open) {
        return {
          ...state,
          columnMenu: {
            ...state.columnMenu,
            open: false,
          },
        };
      }

      return state;
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

  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, handleColumnResizeStart);
};
