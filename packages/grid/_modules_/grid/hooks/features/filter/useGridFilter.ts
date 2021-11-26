import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridFilterApi } from '../../../models/api/gridFilterApi';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
import { GridRowId, GridRowModel, GridRowTreeNodeConfig } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { filterableGridColumnsIdsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../../utils/useGridState';
import { GridPreferencePanelsValue } from '../preferencesPanel/gridPreferencePanelsValue';
import { getDefaultGridFilterModel } from './gridFilterState';
import { GridFilterModel } from '../../../models/gridFilterModel';
import { gridVisibleSortedRowEntriesSelector, gridFilterModelSelector } from './gridFilterSelector';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import { gridRowIdsSelector, gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows';

type GridFilterItemApplier = (rowId: GridRowId) => boolean;

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
    | 'initialState'
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
        filterModel:
          props.filterModel ??
          props.initialState?.filter?.filterModel ??
          getDefaultGridFilterModel(),
        visibleRowsLookup: {},
        filteredDescendantCountLookup: {},
      },
    };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.unstable_updateControlState({
    stateId: 'filter',
    propModel: props.filterModel,
    propOnChange: props.onFilterModelChange,
    stateSelector: gridFilterModelSelector,
    changeEvent: GridEvents.filterModelChange,
  });

  const buildAggregatedFilterApplier = React.useCallback(
    (filterModel: GridFilterModel): GridFilterItemApplier | null => {
      const { items, linkOperator = GridLinkOperator.And } = filterModel;

      const getFilterCallbackFromItem = (
        filterItem: GridFilterItem,
      ): GridFilterItemApplier | null => {
        if (!filterItem.columnField || !filterItem.operatorValue) {
          return null;
        }

        const column = apiRef.current.getColumn(filterItem.columnField);
        if (!column) {
          return null;
        }

        const parsedValue = column.valueParser
          ? column.valueParser(filterItem.value)
          : filterItem.value;
        const newFilterItem: GridFilterItem = { ...filterItem, value: parsedValue };

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
          return null;
        }

        return (rowId: GridRowId) => {
          const cellParams = apiRef.current.getCellParams(rowId, newFilterItem.columnField!);

          return applyFilterOnRow(cellParams);
        };
      };

      const appliers = items
        .map(getFilterCallbackFromItem)
        .filter((callback): callback is GridFilterItemApplier => !!callback);

      if (appliers.length === 0) {
        return null;
      }

      return (rowId: GridRowId) => {
        // Return `false` as soon as we have a failing filter
        if (linkOperator === GridLinkOperator.And) {
          return appliers.every((applier) => applier(rowId));
        }

        // Return `true` as soon as we have a passing filter
        return appliers.some((applier) => applier(rowId));
      };
    },
    [apiRef],
  );

  /**
   * Generate the `visibleRowsLookup` and `visibleDescendantsCountLookup` for the current `filterModel`
   * If the tree is not flat, we have to create the lookups even with "server" filtering or 0 filter item to remove to collapsed rows.
   */
  const applyFilters = React.useCallback<GridFilterApi['unstable_applyFilters']>(() => {
    setGridState((state) => {
      const filterModel = gridFilterModelSelector(state);
      const rowIds = gridRowIdsSelector(state);
      const rowTree = gridRowTreeSelector(state);
      const shouldApplyTreeFiltering = gridRowTreeDepthSelector(state) > 1;
      const filteringMethod =
        props.filterMode === GridFeatureModeConstant.client
          ? buildAggregatedFilterApplier(filterModel)
          : null;

      const visibleRowsLookup: Record<GridRowId, boolean> = {};
      const filteredDescendantCountLookup: Record<GridRowId, number> = {};
      if (shouldApplyTreeFiltering) {
        // A node is visible if
        // - One of its children is passing the filter
        // - It is passing the filter
        const filterTreeNode = (
          node: GridRowTreeNodeConfig,
          isParentMatchingFilters: boolean,
          areAncestorsExpanded: boolean,
        ): number => {
          const shouldSkipFilters = props.disableChildrenFiltering && node.depth > 0;

          let isMatchingFilters: boolean | null;
          if (shouldSkipFilters) {
            isMatchingFilters = null;
          } else if (!filteringMethod) {
            isMatchingFilters = true;
          } else {
            isMatchingFilters = filteringMethod(node.id);
          }

          let filteredDescendantCount = 0;
          node.children?.forEach((childId) => {
            const childNode = rowTree[childId];
            const childSubTreeSize = filterTreeNode(
              childNode,
              isMatchingFilters ?? isParentMatchingFilters,
              areAncestorsExpanded && !!node.childrenExpanded,
            );

            filteredDescendantCount += childSubTreeSize;
          });

          let shouldPassFilters: boolean;
          switch (isMatchingFilters) {
            case true: {
              shouldPassFilters = true;
              break;
            }
            case false: {
              shouldPassFilters = filteredDescendantCount > 0;
              break;
            }
            default: {
              shouldPassFilters = isParentMatchingFilters;
              break;
            }
          }

          visibleRowsLookup[node.id] = shouldPassFilters && areAncestorsExpanded;

          if (!shouldPassFilters) {
            return 0;
          }

          filteredDescendantCountLookup[node.id] = filteredDescendantCount;

          // TODO: For column grouping, we do not want to count the intermediate depth nodes in the visible descendant count
          return filteredDescendantCount + 1;
        };

        const nodes = Object.values(rowTree);
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          if (node.depth === 0) {
            filterTreeNode(node, true, true);
          }
        }
      } else if (props.filterMode === GridFeatureModeConstant.client && filteringMethod) {
        for (let i = 0; i < rowIds.length; i += 1) {
          const rowId = rowIds[i];
          visibleRowsLookup[rowId] = filteringMethod(rowId);
        }
      }

      return {
        ...state,
        filter: {
          ...state.filter,
          visibleRowsLookup,
          filteredDescendantCountLookup,
        },
      };
    });
    apiRef.current.publishEvent(GridEvents.visibleRowsSet);
    forceUpdate();
  }, [
    apiRef,
    setGridState,
    forceUpdate,
    props.filterMode,
    buildAggregatedFilterApplier,
    props.disableChildrenFiltering,
  ]);

  const cleanFilterItem = React.useCallback(
    (item: GridFilterItem) => {
      const cleanItem: GridFilterItem = { ...item };

      if (cleanItem.id == null) {
        cleanItem.id = Math.round(Math.random() * 1e5);
      }

      if (cleanItem.operatorValue == null) {
        // we select a default operator
        const column = apiRef.current.getColumn(cleanItem.columnField);
        cleanItem.operatorValue = column && column!.filterOperators![0].value!;
      }

      return cleanItem;
    },
    [apiRef],
  );

  const upsertFilterItem = React.useCallback<GridFilterApi['upsertFilterItem']>(
    (item) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      const items = [...filterModel.items];
      const itemIndex = items.findIndex((filterItem) => filterItem.id === item.id);
      const newItem = cleanFilterItem(item);
      if (itemIndex === -1) {
        items.push(newItem);
      } else {
        items[itemIndex] = newItem;
      }
      apiRef.current.setFilterModel({ ...filterModel, items });
    },
    [apiRef, cleanFilterItem],
  );

  const deleteFilterItem = React.useCallback<GridFilterApi['deleteFilterItem']>(
    (itemToDelete) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      const items = filterModel.items.filter((item) => item.id !== itemToDelete.id);

      if (items.length === filterModel.items.length) {
        return;
      }

      apiRef.current.setFilterModel({ ...filterModel, items });
    },
    [apiRef],
  );

  const showFilterPanel = React.useCallback<GridFilterApi['showFilterPanel']>(
    (targetColumnField) => {
      logger.debug('Displaying filter panel');
      if (targetColumnField) {
        const filterModel = gridFilterModelSelector(apiRef.current.state);
        const filterItemsWithValue = filterModel.items.filter((item) => item.value !== undefined);

        let newFilterItems: GridFilterItem[];
        const filterItemOnTarget = filterItemsWithValue.find(
          (item) => item.columnField === targetColumnField,
        );

        if (filterItemOnTarget) {
          newFilterItems = filterItemsWithValue;
        } else if (props.disableMultipleColumnsFiltering) {
          newFilterItems = [cleanFilterItem({ columnField: targetColumnField })];
        } else {
          newFilterItems = [
            ...filterItemsWithValue,
            cleanFilterItem({ columnField: targetColumnField }),
          ];
        }

        apiRef.current.setFilterModel({
          ...filterModel,
          items: newFilterItems,
        });
      }
      apiRef.current.showPreferences(GridPreferencePanelsValue.filters);
    },
    [apiRef, logger, cleanFilterItem, props.disableMultipleColumnsFiltering],
  );

  const hideFilterPanel = React.useCallback<GridFilterApi['hideFilterPanel']>(() => {
    logger.debug('Hiding filter panel');
    apiRef.current.hidePreferences();
  }, [apiRef, logger]);

  const setFilterLinkOperator = React.useCallback<GridFilterApi['setFilterLinkOperator']>(
    (linkOperator) => {
      const filterModel = gridFilterModelSelector(apiRef.current.state);
      if (filterModel.linkOperator === linkOperator) {
        return;
      }
      apiRef.current.setFilterModel({
        ...filterModel,
        linkOperator,
      });
    },
    [apiRef],
  );

  const setFilterModel = React.useCallback<GridFilterApi['setFilterModel']>(
    (model) => {
      const currentModel = gridFilterModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        checkFilterModelValidity(model);

        if (model.items.length > 1 && props.disableMultipleColumnsFiltering) {
          model.items = [model.items[0]];
        }

        logger.debug('Setting filter model');
        setGridState((state) => ({
          ...state,
          filter: {
            ...state.filter,
            filterModel: model,
          },
        }));
        apiRef.current.unstable_applyFilters();
      }
    },
    [apiRef, logger, setGridState, props.disableMultipleColumnsFiltering],
  );

  const getVisibleRowModels = React.useCallback<GridFilterApi['getVisibleRowModels']>(() => {
    const visibleSortedRows = gridVisibleSortedRowEntriesSelector(apiRef.current.state);
    return new Map<GridRowId, GridRowModel>(visibleSortedRows.map((row) => [row.id, row.model]));
  }, [apiRef]);

  useGridApiMethod<GridFilterApi>(
    apiRef,
    {
      setFilterLinkOperator,
      unstable_applyFilters: applyFilters,
      deleteFilterItem,
      upsertFilterItem,
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
    const newFilterItems = filterModel.items.filter(
      (item) => item.columnField && columnsIds.includes(item.columnField),
    );
    if (newFilterItems.length < filterModel.items.length) {
      apiRef.current.setFilterModel({ ...filterModel, items: newFilterItems });
    }
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
    apiRef.current.unstable_applyFilters();
  }, [apiRef, props.disableChildrenFiltering]);

  useFirstRender(() => apiRef.current.unstable_applyFilters());

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.unstable_applyFilters);
  useGridApiEventHandler(
    apiRef,
    GridEvents.rowExpansionChange,
    apiRef.current.unstable_applyFilters,
  );
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);
};
