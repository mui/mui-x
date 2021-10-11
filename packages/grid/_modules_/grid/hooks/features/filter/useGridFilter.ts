import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridRowId } from '../../../models/gridRows';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../core/useGridState';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import {
  gridSortedRowIdsFlatSelector,
  gridSortedRowsSelector,
} from '../sorting/gridSortingSelector';
import { getDefaultGridFilterModel, getEmptyVisibleRows } from './gridFilterState';
import { GridFilterModel } from '../../../models/gridFilterModel';
import {
  gridVisibleRowsLookupSelector,
  gridSortedVisibleRowsSelector,
  gridFilterModelSelector,
} from './gridFilterSelector';
import { GridSortedRowsTree } from '../sorting';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import {
  gridExpandedRowCountSelector,
  gridTopLevelRowCountSelector,
} from '../rows/gridRowsSelector';

const checkFilterModelValidity = (model: GridFilterModel) => {
  if (model.items.length > 1) {
    const hasItemsWithoutIds = model.items.find((item) => item.id == null);
    if (hasItemsWithoutIds) {
      throw new Error(
        "MUI: The 'id' field is required on `filterModel.items` when you use multiple filters.",
      );
    }
  }
};

/**
 * @requires useGridColumns (state, method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 * @requires useGridControlState (method)
 */
export const useGridFilter = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'filterModel'
    | 'onFilterModelChange'
    | 'filterMode'
    | 'disableMultipleColumnsFiltering'
    | 'disableChildrenFiltering'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridFilter');

  useGridStateInit(apiRef, (state) => {
    if (props.filterModel) {
      checkFilterModelValidity(props.filterModel);
    }

    return {
      ...state,
      filter: {
        filterModel: props.filterModel ?? getDefaultGridFilterModel(),
        ...getEmptyVisibleRows(),
      },
    };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.updateControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: GridEvents.filterModelChange,
  });

  const applyFilter = React.useCallback<GridFilterApi['applyFilter']>(
    (filterItem: GridFilterItem, linkOperator: GridLinkOperator = GridLinkOperator.And) => {
      if (!filterItem.columnField || !filterItem.operatorValue) {
        return false;
      }

      const column = apiRef.current.getColumn(filterItem.columnField);

      if (!column) {
        return false;
      }

      const parsedValue = column.valueParser
        ? column.valueParser(filterItem.value)
        : filterItem.value;
      const newFilterItem = { ...filterItem, value: parsedValue };

      logger.debug(
        `Filtering column: ${newFilterItem.columnField} ${newFilterItem.operatorValue} ${newFilterItem.value} `,
      );

      const filterOperators = column.filterOperators;
      if (!filterOperators?.length) {
        throw new Error(`MUI: No filter operators found for column '${column.field}'.`);
      }

      const filterOperator = filterOperators.find(
        (operator) => operator.value === newFilterItem.operatorValue,
      )!;
      if (!filterOperator) {
        throw new Error(
          `MUI: No filter operator found for column '${column.field}' and operator value '${newFilterItem.operatorValue}'.`,
        );
      }

      const applyFilterOnRow = filterOperator.getApplyFilterFn(newFilterItem, column)!;
      if (typeof applyFilterOnRow !== 'function') {
        return false;
      }

      setGridState((state) => {
        const visibleRowsLookup = { ...gridVisibleRowsLookupSelector(state) };
        let visibleRowCount = 0;
        let visibleTopLevelRowCount = 0;
        const visibleRows: GridRowId[] = [];

        // We run the selector on the state here to avoid rendering the rows and then filtering again.
        // This way we have latest rows on the first rendering
        const rowTree = gridSortedRowsSelector(state);

        const filterRowTree = (tree: GridSortedRowsTree, depth = 0) => {
          tree.forEach((node, id) => {
            let hasCurrentFilter: boolean;

            if (depth > 0 && props.disableChildrenFiltering) {
              hasCurrentFilter = true;
            } else {
              const params = apiRef.current.getCellParams(id, newFilterItem.columnField!);
              hasCurrentFilter = applyFilterOnRow(params);
            }

            const lookupElementBeforeCurrentFilter = visibleRowsLookup[id];

            let isVisible: boolean;

            if (lookupElementBeforeCurrentFilter == null) {
              isVisible = hasCurrentFilter;
            } else if (linkOperator === GridLinkOperator.And) {
              isVisible = lookupElementBeforeCurrentFilter && hasCurrentFilter;
            } else {
              isVisible = lookupElementBeforeCurrentFilter || hasCurrentFilter;
            }

            visibleRowsLookup[id] = isVisible;

            if (isVisible) {
              visibleRows.push(id);
              visibleRowCount += 1;
              if (depth === 0) {
                visibleTopLevelRowCount += 1;
              }
            }

            if (node.children) {
              filterRowTree(node.children, depth + 1);
            }
          });
        };

        filterRowTree(rowTree);

        return {
          ...state,
          filter: {
            ...state.filter,
            visibleRowsLookup,
            visibleRows,
            visibleRowCount,
            visibleTopLevelRowCount,
          },
        };
      });
      forceUpdate();

      return true;
    },
    [apiRef, forceUpdate, logger, setGridState, props.disableChildrenFiltering],
  );

  const applyFilters = React.useCallback<GridFilterApi['applyFilters']>(() => {
    const { items, linkOperator } = gridFilterModelSelector(apiRef.current.state);

    let hasAppliedAtLeastOneFilter = false;

    if (props.filterMode === GridFeatureModeConstant.client) {
      // Clearing filtered rows
      setGridState((state) => ({
        ...state,
        filter: {
          ...state.filter,
          ...getEmptyVisibleRows(),
        },
      }));

      items.forEach((filterItem) => {
        const hasAppliedFilter = apiRef.current.applyFilter(filterItem, linkOperator);
        hasAppliedAtLeastOneFilter = hasAppliedAtLeastOneFilter || hasAppliedFilter;
      });
    }

    //  If no filter has been applied, we set all rows to be visible
    if (!hasAppliedAtLeastOneFilter) {
      setGridState((state) => {
        const rowIds = gridSortedRowIdsFlatSelector(state);
        const visibleRowsLookup = Object.fromEntries(rowIds.map((rowId) => [rowId, true]));
        const visibleRows = [...rowIds];

        return {
          ...state,
          filter: {
            ...state.filter,
            visibleRowsLookup,
            visibleRows,
            visibleRowCount: gridExpandedRowCountSelector(state),
            visibleTopLevelRowCount: gridTopLevelRowCountSelector(state),
          },
        };
      });
    }

    apiRef.current.publishEvent(GridEvents.visibleRowsSet);
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, props.filterMode]);

  const upsertFilter = React.useCallback<GridFilterApi['upsertFilter']>(
    (item) => {
      logger.debug('Upserting filter');

      setGridState((state) => {
        const filterableColumnsIds = filterableGridColumnsIdsSelector(state);
        const items = [...gridFilterModelSelector(state).items];
        const newItem = { ...item };
        const itemIndex = items.findIndex((filterItem) => filterItem.id === newItem.id);

        if (items.length === 1 && isDeepEqual(items[0], {})) {
          // we replace the first filter as it's empty
          items[0] = newItem;
        } else if (itemIndex === -1) {
          items.push(newItem);
        } else {
          items[itemIndex] = newItem;
        }

        if (newItem.id == null) {
          newItem.id = Math.round(Math.random() * 1e5);
        }

        if (newItem.columnField == null) {
          newItem.columnField = filterableColumnsIds[0];
        }
        if (newItem.columnField != null && newItem.operatorValue == null) {
          // we select a default operator
          const column = apiRef.current.getColumn(newItem.columnField);
          newItem.operatorValue = column && column!.filterOperators![0].value!;
        }
        if (props.disableMultipleColumnsFiltering && items.length > 1) {
          items.length = 1;
        }

        return {
          ...state,
          filter: { ...state.filter, filterModel: { ...state.filter.filterModel, items } },
        };
      });
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState, props.disableMultipleColumnsFiltering],
  );

  const deleteFilter = React.useCallback<GridFilterApi['deleteFilter']>(
    (item) => {
      logger.debug(`Deleting filter on column ${item.columnField} with value ${item.value}`);
      setGridState((state) => {
        const items = [
          ...gridFilterModelSelector(state).items.filter((filterItem) => filterItem.id !== item.id),
        ];

        return {
          ...state,
          filter: { ...state.filter, filterModel: { ...state.filter.filterModel, items } },
        };
      });
      if (gridFilterModelSelector(apiRef.current.state).items.length === 0) {
        apiRef.current.upsertFilter({});
      }
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState],
  );

  const showFilterPanel = React.useCallback<GridFilterApi['showFilterPanel']>(
    (targetColumnField) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef.current.state);

        const lastFilter =
          filterModel.items.length > 0 ? filterModel.items[filterModel.items.length - 1] : null;
        if (!lastFilter || lastFilter.columnField !== targetColumnField) {
          apiRef.current.upsertFilter({ columnField: targetColumnField });
        }
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, logger],
  );

  const hideFilterPanel = React.useCallback<GridFilterApi['hideFilterPanel']>(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);

  const applyFilterLinkOperator = React.useCallback<GridFilterApi['applyFilterLinkOperator']>(
    (linkOperator) => {
      logger.debug('Applying filter link operator');
      setGridState((state) => ({
        ...state,
        filter: { ...state.filter, filterModel: { ...state.filter.filterModel, linkOperator } },
      }));
      apiRef.current.applyFilters();
    },
    [apiRef, logger, setGridState],
  );

  const setFilterModel = React.useCallback<GridFilterApi['setFilterModel']>(
    (model) => {
      const currentModel = gridFilterModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        checkFilterModelValidity(model);

        logger.debug('Setting filter model');
        setGridState((state) => ({
          ...state,
          filter: {
            ...state.filter,
            filterModel: model,
          },
        }));
        apiRef.current.applyFilters();
      }
    },
    [apiRef, logger, setGridState],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(
    () => gridSortedVisibleRowsSelector(apiRef.current.state),
    [apiRef],
  );

  useGridApiMethod<GridFilterApi>(
    apiRef,
    {
      applyFilterLinkOperator,
      applyFilters,
      applyFilter,
      deleteFilter,
      upsertFilter,
      setFilterModel,
      showFilterPanel,
      hideFilterPanel,
      getVisibleRowModels,
    },
    'FilterApi',
  );

  const onColUpdated = React.useCallback(() => {
    logger.debug('onColUpdated - GridColumns changed, applying filters');
    const filterModel = gridFilterModelSelector(apiRef.current.state);
    const columnsIds = filterableGridColumnsIdsSelector(apiRef.current.state);
    logger.debug('GridColumns changed, applying filters');

    filterModel.items.forEach((filter) => {
      if (!columnsIds.find((field) => field === filter.columnField)) {
        apiRef.current.deleteFilter(filter);
      }
    });
    apiRef.current.applyFilters();
  }, [apiRef, logger]);

  React.useEffect(() => {
    if (props.filterModel !== undefined) {
      apiRef.current.setFilterModel(props.filterModel);
    }
  }, [apiRef, logger, props.filterModel]);

  // The filter options have changed
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.applyFilters();
  }, [apiRef, props.disableChildrenFiltering]);

  useFirstRender(() => apiRef.current.applyFilters());

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applyFilters);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);
};
