import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../core/useGridState';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridStateInit } from '../../utils/useGridStateInit';

/**
 * @requires useGridPreferencesPanel (method)
 * @requires useGridVirtualRows (state)
 */
export const useGridColumnMenu = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

  useGridStateInit(apiRef, (state) => ({ ...state, columnMenu: { open: false } }));
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

  useGridApiMethod(
    apiRef,
    {
      showColumnMenu,
      hideColumnMenu,
      toggleColumnMenu,
    },
    'ColumnMenuApi',
  );

  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, hideColumnMenu);
  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, hideColumnMenu);
};
