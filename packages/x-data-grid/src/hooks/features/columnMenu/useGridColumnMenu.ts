import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridLogger, useGridApiMethod, useGridApiEventHandler } from '../../utils';
import { gridColumnMenuSelector } from './columnMenuSelector';
import { GridColumnMenuApi } from '../../../models';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  gridColumnLookupSelector,
  gridColumnVisibilityModelSelector,
  gridColumnFieldsSelector,
} from '../columns/gridColumnsSelector';

export const columnMenuStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  columnMenu: { open: false },
});

/**
 * @requires useGridColumnResize (event)
 * @requires useGridInfiniteLoader (event)
 */
export const useGridColumnMenu = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
): void => {
  const logger = useGridLogger(apiRef, 'useGridColumnMenu');

  /**
   * API METHODS
   */
  const showColumnMenu = React.useCallback<GridColumnMenuApi['showColumnMenu']>(
    (field) => {
      const columnMenuState = gridColumnMenuSelector(apiRef.current.state);
      const newState = { open: true, field };
      const shouldUpdate =
        newState.open !== columnMenuState.open || newState.field !== columnMenuState.field;

      if (shouldUpdate) {
        apiRef.current.setState((state) => {
          if (state.columnMenu.open && state.columnMenu.field === field) {
            return state;
          }

          logger.debug('Opening Column Menu');

          return {
            ...state,
            columnMenu: { open: true, field },
          };
        });
        apiRef.current.hidePreferences();
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, logger],
  );

  const hideColumnMenu = React.useCallback<GridColumnMenuApi['hideColumnMenu']>(() => {
    const columnMenuState = gridColumnMenuSelector(apiRef.current.state);

    if (columnMenuState.field) {
      const columnLookup = gridColumnLookupSelector(apiRef);
      const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
      const orderedFields = gridColumnFieldsSelector(apiRef);
      let fieldToFocus = columnMenuState.field;

      // If the column was removed from the grid, we need to find the closest visible field
      if (!columnLookup[fieldToFocus]) {
        fieldToFocus = orderedFields[0];
      }

      // If the field to focus is hidden, we need to find the closest visible field
      if (columnVisibilityModel[fieldToFocus] === false) {
        // contains visible column fields + the field that was just hidden
        const visibleOrderedFields = orderedFields.filter((field) => {
          if (field === fieldToFocus) {
            return true;
          }
          return columnVisibilityModel[field] !== false;
        });
        const fieldIndex = visibleOrderedFields.indexOf(fieldToFocus);
        fieldToFocus = visibleOrderedFields[fieldIndex + 1] || visibleOrderedFields[fieldIndex - 1];
      }
      apiRef.current.setColumnHeaderFocus(fieldToFocus);
    }

    const newState = { open: false, field: undefined };
    const shouldUpdate =
      newState.open !== columnMenuState.open || newState.field !== columnMenuState.field;

    if (shouldUpdate) {
      apiRef.current.setState((state) => {
        logger.debug('Hiding Column Menu');
        return {
          ...state,
          columnMenu: newState,
        };
      });
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

  useGridApiMethod(apiRef, columnMenuApi, 'public');

  useGridApiEventHandler(apiRef, 'columnResizeStart', hideColumnMenu);
  useGridApiEventHandler(apiRef, 'virtualScrollerWheel', apiRef.current.hideColumnMenu);
  useGridApiEventHandler(apiRef, 'virtualScrollerTouchMove', apiRef.current.hideColumnMenu);
};
