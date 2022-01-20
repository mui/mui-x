import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEvents } from '../../../models/events';
import { useGridStateInit } from '../../utils/useGridStateInit';
import {
  useGridSelector,
  useGridLogger,
  useGridApiMethod,
  useGridApiEventHandler,
} from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';
import { GridColumnMenuApi } from '../../../models';

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export const useGridColumnMenu = (apiRef: GridApiRef): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

  useGridStateInit(apiRef, (state) => ({ ...state, columnMenu: { open: false } }));
  const columnMenu = useGridSelector(apiRef, gridColumnMenuSelector);

  /**
   * API METHODS
   */
  const showColumnMenu = React.useCallback<GridColumnMenuApi['showColumnMenu']>(
    (field) => {
      const shouldUpdate = apiRef.current.setState((state) => {
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
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, logger],
  );

  const hideColumnMenu = React.useCallback<GridColumnMenuApi['hideColumnMenu']>(() => {
    const shouldUpdate = apiRef.current.setState((state) => {
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
      apiRef.current.forceUpdate();
    }
  }, [apiRef, logger]);

  const toggleColumnMenu = React.useCallback<GridColumnMenuApi['toggleColumnMenu']>(
    (field) => {
      logger.debug('Toggle Column Menu');
      if (!columnMenu.open || columnMenu.field !== field) {
        showColumnMenu(field);
      } else {
        hideColumnMenu();
      }
    },
    [logger, showColumnMenu, hideColumnMenu, columnMenu],
  );

  const columnMenuApi: GridColumnMenuApi = {
    showColumnMenu,
    hideColumnMenu,
    toggleColumnMenu,
  };

  useGridApiMethod(apiRef, columnMenuApi, 'GridColumnMenuApi');

  /**
   * EVENTS
   */
  useGridApiEventHandler(apiRef, GridEvents.columnResizeStart, hideColumnMenu);
  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, hideColumnMenu);
};
