import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEvents } from '../../../constants/eventsConstants';
import { useGridStateInit } from '../../utils/useGridStateInit';
import {
  useGridSelector,
  useGridState,
  useGridLogger,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export const useGridColumnMenu = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

  useGridStateInit(apiRef, (state) => ({ ...state, columnMenu: { open: false } }));
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const columnMenu = useGridSelector(apiRef, gridColumnMenuSelector);

  const showColumnMenu = React.useCallback(
    (field: string) => {
      const shouldUpdate = setGridState((state) => {
        if (state.columnMenu.open && state.columnMenu.field === field) {
          return state;
        }

        logger.debug('Opening Column Menu');
        return {
          ...state,
          columnMenu: { open: true, field },
        };
      });

      if (shouldUpdate) {
        apiRef.current.hidePreferences();
        forceUpdate();
      }
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const hideColumnMenu = React.useCallback(() => {
    const shouldUpdate = setGridState((state) => {
      if (!state.columnMenu.open && state.columnMenu.field === undefined) {
        return state;
      }

      logger.debug('Hiding Column Menu');
      return {
        ...state,
        columnMenu: { ...state.columnMenu, open: false, field: undefined },
      };
    });

    if (shouldUpdate) {
      forceUpdate();
    }
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
