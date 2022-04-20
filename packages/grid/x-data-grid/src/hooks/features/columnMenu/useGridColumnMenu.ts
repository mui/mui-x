import * as React from 'react';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridEvents } from '../../../models/events';
import { useGridLogger, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';
import { GridColumnMenuApi } from '../../../models';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const columnMenuStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnMenu: { open: false },
});

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export const useGridColumnMenu = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

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
      const columnMenu = gridColumnMenuSelector(apiRef.current.state);
      if (!columnMenu.open || columnMenu.field !== field) {
        showColumnMenu(field);
      } else {
        hideColumnMenu();
      }
    },
    [apiRef, logger, showColumnMenu, hideColumnMenu],
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
  useGridApiEventHandler(apiRef, GridEvents.virtualScrollerWheel, apiRef.current.hideColumnMenu);
  useGridApiEventHandler(
    apiRef,
    GridEvents.virtualScrollerTouchMove,
    apiRef.current.hideColumnMenu,
  );
};
