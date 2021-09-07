import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../core/useGridState';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useGridSelector } from '../core/useGridSelector';
import { gridColumnMenuSelector } from './columnMenuSelector';

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 * @requires useGridVirtualization (event)
 */
export const useGridColumnMenu = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

  useGridStateInit(apiRef, (state) => ({ ...state, columnMenu: { open: false } }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const columnMenu = useGridSelector(apiRef, gridColumnMenuSelector);

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
      if (!columnMenu.open || columnMenu.field !== field) {
        showColumnMenu(field);
      } else {
        hideColumnMenu();
      }
    },
    [logger, showColumnMenu, hideColumnMenu, columnMenu],
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
