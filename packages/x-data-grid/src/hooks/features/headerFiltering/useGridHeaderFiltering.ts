import * as React from 'react';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridHeaderFilteringState } from '../../../models/gridHeaderFilteringModel';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridLogger } from '../../utils';
import {
  gridColumnLookupSelector,
  gridColumnVisibilityModelSelector,
  gridColumnFieldsSelector,
} from '../columns/gridColumnsSelector';
import {
  GridHeaderFilteringApi,
  GridHeaderFilteringPrivateApi,
} from '../../../models/api/gridHeaderFilteringApi';

export const headerFilteringStateInitializer: GridStateInitializer = (
  state,
  props: DataGridProcessedProps,
) => ({
  ...state,
  headerFiltering: { enabled: props.headerFilters ?? false, editing: null, menuOpen: null },
});

export const useGridHeaderFiltering = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'signature' | 'headerFilters'>,
) => {
  const logger = useGridLogger(apiRef, 'useGridHeaderFiltering');
  const setHeaderFilterState = React.useCallback(
    (headerFilterState: Partial<GridHeaderFilteringState>) => {
      apiRef.current.setState((state) => {
        // Safety check to avoid MIT users from using it
        // This hook should ultimately be moved to the Pro package
        if (props.signature === 'DataGrid') {
          return state;
        }
        return {
          ...state,
          headerFiltering: {
            enabled: props.headerFilters ?? false,
            editing: headerFilterState.editing ?? null,
            menuOpen: headerFilterState.menuOpen ?? null,
          },
        };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef, props.signature, props.headerFilters],
  );

  const startHeaderFilterEditMode = React.useCallback<
    GridHeaderFilteringApi['startHeaderFilterEditMode']
  >(
    (field) => {
      logger.debug(`Starting edit mode on header filter for field: ${field}`);
      apiRef.current.setHeaderFilterState({ editing: field });
    },
    [apiRef, logger],
  );

  const stopHeaderFilterEditMode = React.useCallback<
    GridHeaderFilteringApi['stopHeaderFilterEditMode']
  >(() => {
    logger.debug(`Stopping edit mode on header filter`);
    apiRef.current.setHeaderFilterState({ editing: null });
  }, [apiRef, logger]);

  const showHeaderFilterMenu = React.useCallback<GridHeaderFilteringApi['showHeaderFilterMenu']>(
    (field) => {
      logger.debug(`Opening header filter menu for field: ${field}`);
      apiRef.current.setHeaderFilterState({ menuOpen: field });
    },
    [apiRef, logger],
  );

  const hideHeaderFilterMenu = React.useCallback<
    GridHeaderFilteringApi['hideHeaderFilterMenu']
  >(() => {
    logger.debug(`Hiding header filter menu for active field`);
    let fieldToFocus = apiRef.current.state.headerFiltering.menuOpen;
    if (fieldToFocus) {
      const columnLookup = gridColumnLookupSelector(apiRef);
      const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
      const orderedFields = gridColumnFieldsSelector(apiRef);

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
      apiRef.current.setHeaderFilterState({ menuOpen: null });
      apiRef.current.setColumnHeaderFilterFocus(fieldToFocus);
    }
  }, [apiRef, logger]);

  const headerFilterPrivateApi: GridHeaderFilteringPrivateApi = {
    setHeaderFilterState,
  };

  const headerFilterApi: GridHeaderFilteringApi = {
    startHeaderFilterEditMode,
    stopHeaderFilterEditMode,
    showHeaderFilterMenu,
    hideHeaderFilterMenu,
  };

  useGridApiMethod(apiRef, headerFilterApi, 'public');
  useGridApiMethod(apiRef, headerFilterPrivateApi, 'private');

  /*
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      apiRef.current.setHeaderFilterState({ enabled: props.headerFilters ?? false });
    }
  }, [apiRef, props.headerFilters]);
};
