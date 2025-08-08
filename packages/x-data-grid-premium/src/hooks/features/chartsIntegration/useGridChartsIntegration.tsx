'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import { RefObject } from '@mui/x-internals/types';
import {
  GridColDef,
  gridColumnGroupsUnwrappedModelSelector,
  gridRowIdSelector,
  gridRowNodeSelector,
  gridRowTreeSelector,
} from '@mui/x-data-grid-pro';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridEvent,
  gridColumnLookupSelector,
  runIf,
  gridPivotActiveSelector,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
  gridColumnFieldsSelector,
  gridFilteredSortedDepthRowEntriesSelector,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-pro/internals';

import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  ChartState,
  GridChartsIntegrationContextValue,
} from '../../../models/gridChartsIntegration';
import { getRowGroupingFieldFromGroupingCriteria } from '../rowGrouping/gridRowGroupingUtils';
import {
  GridChartsIntegrationApi,
  GridChartsIntegrationItem,
  GridChartsIntegrationPrivateApi,
  GridChartsIntegrationState,
} from './gridChartsIntegrationInterfaces';
import {
  gridChartsPanelOpenSelector,
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartableColumnsSelector,
} from './gridChartsIntegrationSelectors';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';
import { useGridChartsIntegrationContext } from '../../utils/useGridChartIntegration';
import { isBlockedForSection } from './utils';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { GridSidebarValue } from '../sidebar';
import { getAvailableAggregationFunctions } from '../aggregation/gridAggregationUtils';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import type { GridPivotModel } from '../pivoting/gridPivotingInterfaces';

export const chartsIntegrationStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'chartsIntegration'
    | 'initialState'
    | 'activeChartId'
    | 'rowGroupingModel'
    | 'pivotModel'
    | 'experimentalFeatures'
  >,
  GridPrivateApiPremium
> = (state, props) => {
  if (!props.chartsIntegration || !props.experimentalFeatures?.chartsIntegration) {
    return {
      ...state,
      chartsIntegration: {
        activeChartId: '',
        charts: {},
      } as GridChartsIntegrationState,
    };
  }

  const rowGroupingModel = (state.rowGrouping?.model ?? []).filter((item) => item !== undefined);
  const pivotModel = state.pivoting?.active ? (state.pivoting?.model as GridPivotModel) : undefined;
  const columnsLookup = state.columns?.lookup ?? {};
  const charts = Object.fromEntries(
    Object.entries(props.initialState?.chartsIntegration?.charts || {}).map(([chartId, chart]) => [
      chartId,
      {
        categories: (chart.categories || [])
          .map((category) =>
            typeof category === 'string' ? { field: category, hidden: false } : category,
          )
          .filter(
            (category) =>
              columnsLookup[category.field]?.chartable === true &&
              !isBlockedForSection(
                columnsLookup[category.field] as GridColDef,
                'categories',
                rowGroupingModel,
                pivotModel,
              ),
          ),
        series: (chart.series || [])
          .map((seriesItem) =>
            typeof seriesItem === 'string' ? { field: seriesItem, hidden: false } : seriesItem,
          )
          .filter(
            (seriesItem) =>
              columnsLookup[seriesItem.field]?.chartable === true &&
              !isBlockedForSection(
                columnsLookup[seriesItem.field] as GridColDef,
                'series',
                rowGroupingModel,
                pivotModel,
              ),
          ),
      },
    ]),
  );

  return {
    ...state,
    chartsIntegration: {
      activeChartId:
        props.activeChartId ?? props.initialState?.chartsIntegration?.activeChartId ?? '',
      charts,
    } as GridChartsIntegrationState,
  };
};

const EMPTY_CHART_INTEGRATION_CONTEXT: GridChartsIntegrationContextValue = {
  chartStateLookup: {},
  setChartState: () => {},
};

export const EMPTY_CHART_INTEGRATION_CONTEXT_STATE: ChartState = {
  synced: true,
  categories: [],
  series: [],
  type: '',
  configuration: {},
};

export const useGridChartsIntegration = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'chartsIntegration'
    | 'activeChartId'
    | 'onActiveChartIdChange'
    | 'initialState'
    | 'slots'
    | 'slotProps'
    | 'aggregationFunctions'
    | 'dataSource'
    | 'experimentalFeatures'
  >,
) => {
  const visibleCategories = React.useRef<Record<string, GridColDef[]>>({});
  const visibleSeries = React.useRef<Record<string, GridColDef[]>>({});
  const schema = React.useMemo(
    () => props.slotProps?.chartsPanel?.schema || {},
    [props.slotProps?.chartsPanel?.schema],
  );

  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable =
    !!props.chartsIntegration && !!props.experimentalFeatures?.chartsIntegration && !!context;
  const activeChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);
  const orderedFields = gridColumnFieldsSelector(apiRef);
  const aggregationModel = gridAggregationModelSelector(apiRef);
  const pivotActive = gridPivotActiveSelector(apiRef);
  const pivotModel = gridPivotModelSelector(apiRef);

  const { chartStateLookup, setChartState } = context || EMPTY_CHART_INTEGRATION_CONTEXT;
  const availableChartIds = React.useMemo(() => {
    const ids = Object.keys(chartStateLookup);
    // cleanup visibleCategories and visibleSeries references
    Object.keys(visibleCategories.current).forEach((chartId) => {
      if (!ids.includes(chartId)) {
        delete visibleCategories.current[chartId];
        delete visibleSeries.current[chartId];
      }
    });

    return ids;
  }, [chartStateLookup]);
  const syncedChartIds = React.useMemo(
    () => availableChartIds.filter((chartId) => chartStateLookup[chartId].synced !== false),
    [availableChartIds, chartStateLookup],
  );

  const getColumnName = React.useCallback(
    (field: string) => {
      const customFieldName = props.slotProps?.chartsPanel?.getColumnName?.(field);
      if (customFieldName) {
        return customFieldName;
      }

      const columns = gridColumnLookupSelector(apiRef);
      const unwrappedColumnGroupingModel = gridColumnGroupsUnwrappedModelSelector(apiRef);

      const column = columns[field];

      const columnName = column?.headerName || field;
      if (!pivotActive || !unwrappedColumnGroupingModel[field]) {
        return columnName;
      }

      const groupPath = unwrappedColumnGroupingModel[field].slice(-1)[0];
      return [columnName, ...groupPath.split(COLUMN_GROUP_ID_SEPARATOR)].join(' - ');
    },
    [apiRef, pivotActive, props.slotProps?.chartsPanel],
  );

  apiRef.current.registerControlState({
    stateId: 'activeChartId',
    propModel: props.activeChartId,
    propOnChange: props.onActiveChartIdChange,
    stateSelector: gridChartsIntegrationActiveChartIdSelector,
    changeEvent: 'activeChartIdChange',
  });

  // sometimes, updates made to the chart categories and series require updating other models
  // for example, if we are adding more than one category, we need to set the new grouping model
  // if we are adding new series to the grouped data, we need to set the aggregation model, otherwise the values will be undefined
  const updateOtherModels = React.useCallback(() => {
    const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

    if (
      visibleCategories.current[activeChartId]?.length > 0 &&
      // if there was row grouping or if we are adding more than one category, set the new grouping model
      (rowGroupingModel.length > 0 || visibleCategories.current[activeChartId].length > 1) &&
      // if row grouping model starts with categories in the same order, we don't have to do anything
      visibleCategories.current[activeChartId].some(
        (item, index) => item.field !== rowGroupingModel[index],
      )
    ) {
      // if pivoting is enabled, then the row grouping model is driven by the pivoting rows
      const newGroupingModel = visibleCategories.current[activeChartId].map((item) => item.field);
      if (pivotActive) {
        apiRef.current.setPivotModel((prev) => ({
          ...prev,
          rows: newGroupingModel.map((item) => ({ field: item, hidden: false })),
        }));
      } else {
        apiRef.current.setRowGroupingModel(newGroupingModel);
        apiRef.current.setColumnVisibilityModel({
          ...apiRef.current.state.columns.columnVisibilityModel,
          ...Object.fromEntries(rowGroupingModel.map((item) => [item, true])),
          ...Object.fromEntries(newGroupingModel.map((item) => [item, false])),
        });
      }
    }

    if (!pivotActive && visibleSeries.current[activeChartId] && rowGroupingModel.length > 0) {
      // with row grouping add the aggregation model to the newly added series
      const aggregatedFields = Object.keys(aggregationModel);

      visibleSeries.current[activeChartId].forEach((item) => {
        const hasAggregation = aggregatedFields.includes(item.field);
        if (!hasAggregation) {
          apiRef.current.setAggregationModel({
            ...aggregationModel,
            // use the first available aggregation function
            [item.field]: getAvailableAggregationFunctions({
              aggregationFunctions: props.aggregationFunctions,
              colDef: item,
              isDataSource: !!props.dataSource,
            })[0],
          });
        }
      });
    }
  }, [
    apiRef,
    props.aggregationFunctions,
    props.dataSource,
    activeChartId,
    pivotActive,
    aggregationModel,
  ]);

  const handleRowDataUpdate = React.useCallback(
    (chartIds: string[]) => {
      if (
        chartIds.length === 0 ||
        chartIds.some(
          (chartId) => !visibleCategories.current[chartId] || !visibleSeries.current[chartId],
        )
      ) {
        return;
      }

      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);
      const rowsPerDepth = gridFilteredSortedDepthRowEntriesSelector(apiRef);
      const defaultDepth = Math.max(0, (visibleCategories.current[activeChartId]?.length ?? 0) - 1);
      const rowsAtDefaultDepth = (rowsPerDepth[defaultDepth] ?? []).length;

      // keep only unique columns and transform the grouped column to carry the correct field name to get the grouped value
      const dataColumns = [
        ...new Set([
          ...Object.values(visibleCategories.current).flat(),
          ...Object.values(visibleSeries.current).flat(),
        ]),
      ].map((column) => {
        const isColumnGrouped = rowGroupingModel.includes(column.field);

        if (isColumnGrouped) {
          const groupedFieldName = isColumnGrouped
            ? getRowGroupingFieldFromGroupingCriteria(
                orderedFields.includes(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD)
                  ? null
                  : column.field,
              )
            : column.field;
          const columnDefinition = apiRef.current.getColumn(groupedFieldName);

          return {
            ...columnDefinition,
            dataFieldName: column.field,
            depth: rowGroupingModel.indexOf(column.field),
          };
        }

        return {
          ...column,
          dataFieldName: column.field,
          depth: defaultDepth,
        };
      });

      // go through the data only once and collect everything that will be needed
      const data: Record<any, (string | number | null)[]> = Object.fromEntries(
        dataColumns.map((column) => [column.dataFieldName, []]),
      );
      const dataColumnsCount = dataColumns.length;

      for (let i = 0; i < rowsAtDefaultDepth; i += 1) {
        for (let j = 0; j < dataColumnsCount; j += 1) {
          // if multiple columns are grouped, we need to get the value from the parent to properly create category groups
          let targetRow = rowsPerDepth[defaultDepth][i].model;
          // if we are not at the same depth as the column we are currently processing change the target to the parent at the correct depth
          for (let d = defaultDepth; d > dataColumns[j].depth; d -= 1) {
            const rowId = gridRowIdSelector(apiRef, targetRow);
            targetRow = gridRowNodeSelector(apiRef, rowTree[rowId]!.parent!);
          }

          const value: string | { label: string } | null = apiRef.current.getRowValue(
            targetRow,
            dataColumns[j],
          );
          if (value !== null) {
            data[dataColumns[j].dataFieldName].push(
              typeof value === 'object' && 'label' in value ? value.label : value,
            );
          }
        }
      }

      chartIds.forEach((chartId) => {
        setChartState(chartId, {
          categories: visibleCategories.current[chartId].map((category) => ({
            id: category.field,
            label: getColumnName(category.field),
            data: data[category.field] || [],
          })),
          series: visibleSeries.current[chartId].map((seriesItem) => ({
            id: seriesItem.field,
            label: getColumnName(seriesItem.field),
            data: (data[seriesItem.field] || []) as (number | null)[],
          })),
        });
      });
    },
    [apiRef, activeChartId, orderedFields, getColumnName, setChartState],
  );

  const debouncedHandleRowDataUpdate = React.useMemo(
    () => debounce(handleRowDataUpdate, 0),
    [handleRowDataUpdate],
  );

  const handleColumnDataUpdate = React.useCallback(
    (chartIds: string[], updatedChartStateLookup?: Record<string, ChartState>) => {
      // if there are no charts, skip the data processing
      if (chartIds.length === 0) {
        return;
      }

      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const chartableColumns = gridChartableColumnsSelector(apiRef);
      const selectedFields = chartIds.reduce(
        (acc, chartId) => {
          const series = gridChartsSeriesSelector(apiRef, chartId);
          const categories = gridChartsCategoriesSelector(apiRef, chartId);
          return {
            ...acc,
            [chartId]: {
              series,
              categories,
            },
          };
        },
        {} as Record<
          string,
          { series: GridChartsIntegrationItem[]; categories: GridChartsIntegrationItem[] }
        >,
      );

      const series: Record<string, GridChartsIntegrationItem[]> = {};
      const categories: Record<string, GridChartsIntegrationItem[]> = {};

      chartIds.forEach((chartId) => {
        categories[chartId] = [];
        series[chartId] = [];

        // loop through categories and series either through their length or to the max limit
        // if the current selection is greater than the max limit, the state will be updated
        const chartState = updatedChartStateLookup?.[chartId] || chartStateLookup[chartId];
        const categoriesSize = chartState?.maxCategories
          ? Math.min(chartState.maxCategories, selectedFields[chartId].categories.length)
          : selectedFields[chartId].categories.length;
        const seriesSize = chartState?.maxSeries
          ? Math.min(chartState.maxSeries, selectedFields[chartId].series.length)
          : selectedFields[chartId].series.length;

        // sanitize selectedSeries and selectedCategories while maintaining their order
        for (let i = 0; i < seriesSize; i += 1) {
          if (
            chartableColumns[selectedFields[chartId].series[i].field] &&
            !isBlockedForSection(
              chartableColumns[selectedFields[chartId].series[i].field],
              'series',
              rowGroupingModel,
              pivotActive ? pivotModel : undefined,
            )
          ) {
            if (!series[chartId]) {
              series[chartId] = [];
            }
            series[chartId].push(selectedFields[chartId].series[i]);
          }
        }

        // categories cannot contain fields that are already in series
        for (let i = 0; i < categoriesSize; i += 1) {
          const item = selectedFields[chartId].categories[i];
          if (
            !selectedFields[chartId].series.some((seriesItem) => seriesItem.field === item.field) &&
            chartableColumns[item.field] &&
            !isBlockedForSection(
              chartableColumns[item.field],
              'categories',
              rowGroupingModel,
              pivotActive ? pivotModel : undefined,
            )
          ) {
            if (!categories[chartId]) {
              categories[chartId] = [];
            }
            categories[chartId].push(item);
          }
        }

        // we can compare the lengths, because this function is called after the state was updated.
        // different lengths will occur only if some items were removed during the checks above
        if (
          categories[chartId] &&
          selectedFields[chartId].categories.length !== categories[chartId].length
        ) {
          apiRef.current.updateCategories(chartId, categories[chartId]);
        }

        if (series[chartId] && selectedFields[chartId].series.length !== series[chartId].length) {
          apiRef.current.updateSeries(chartId, series[chartId]);
        }

        visibleCategories.current[chartId] = categories[chartId]
          .filter((category) => category.hidden !== true)
          .map((category) => chartableColumns[category.field]);
        visibleSeries.current[chartId] = series[chartId]
          .filter((seriesItem) => seriesItem.hidden !== true)
          .map((seriesItem) => chartableColumns[seriesItem.field]);

        // we need to have both categories and series to be able to display the chart
        if (
          visibleCategories.current[chartId].length === 0 ||
          visibleSeries.current[chartId].length === 0
        ) {
          visibleCategories.current[chartId] = [];
          visibleSeries.current[chartId] = [];
        }
      });

      updateOtherModels();
      debouncedHandleRowDataUpdate(chartIds);
    },
    [
      apiRef,
      chartStateLookup,
      pivotActive,
      pivotModel,
      debouncedHandleRowDataUpdate,
      updateOtherModels,
    ],
  );

  const debouncedHandleColumnDataUpdate = React.useMemo(
    () => debounce(handleColumnDataUpdate, 0),
    [handleColumnDataUpdate],
  );

  const setChartsPanelOpen = React.useCallback<GridChartsIntegrationApi['setChartsPanelOpen']>(
    (callback) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      const panelOpen = gridChartsPanelOpenSelector(apiRef);
      const newPanelOpen = typeof callback === 'function' ? callback(panelOpen) : callback;

      if (panelOpen === newPanelOpen) {
        return;
      }

      if (newPanelOpen) {
        apiRef.current.showSidebar(GridSidebarValue.Charts);
      } else {
        apiRef.current.hideSidebar();
      }
    },
    [apiRef, isChartsIntegrationAvailable],
  );

  const updateCategories = React.useCallback(
    (
      chartId: string,
      categories:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      apiRef.current.setState((state) => {
        const newCategories =
          typeof categories === 'function'
            ? categories(state.chartsIntegration.charts[chartId].categories)
            : categories;
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            charts: {
              ...state.chartsIntegration.charts,
              [chartId]: {
                ...state.chartsIntegration.charts[chartId],
                categories: newCategories,
              },
            },
          },
        };
      });
      debouncedHandleColumnDataUpdate(syncedChartIds);
    },
    [apiRef, isChartsIntegrationAvailable, syncedChartIds, debouncedHandleColumnDataUpdate],
  );

  const updateSeries = React.useCallback(
    (
      chartId: string,
      series:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      apiRef.current.setState((state) => {
        const newSeries =
          typeof series === 'function'
            ? series(state.chartsIntegration.charts[chartId].series)
            : series;

        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            charts: {
              ...state.chartsIntegration.charts,
              [chartId]: {
                ...state.chartsIntegration.charts[chartId],
                series: newSeries,
              },
            },
          },
        };
      });
      debouncedHandleColumnDataUpdate(syncedChartIds);
    },
    [apiRef, isChartsIntegrationAvailable, syncedChartIds, debouncedHandleColumnDataUpdate],
  );

  const setActiveChartId = React.useCallback<GridChartsIntegrationApi['setActiveChartId']>(
    (chartId) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      apiRef.current.setState((state) => ({
        ...state,
        chartsIntegration: {
          ...state.chartsIntegration,
          activeChartId: chartId,
        },
      }));
    },
    [apiRef, isChartsIntegrationAvailable],
  );

  const setChartType = React.useCallback<GridChartsIntegrationApi['setChartType']>(
    (chartId, type) => {
      if (!isChartsIntegrationAvailable || !chartStateLookup[chartId]) {
        return;
      }

      const stateUpdate = {
        type,
        maxCategories: schema[type]?.maxCategories,
        maxSeries: schema[type]?.maxSeries,
      };

      const updatedChartStateLookup = {
        ...chartStateLookup,
        [chartId]: {
          ...chartStateLookup[chartId],
          ...stateUpdate,
        },
      };

      setChartState(chartId, stateUpdate);
      debouncedHandleColumnDataUpdate([chartId], updatedChartStateLookup);
    },
    [
      isChartsIntegrationAvailable,
      chartStateLookup,
      schema,
      setChartState,
      debouncedHandleColumnDataUpdate,
    ],
  );

  const setChartSynchronizationState = React.useCallback<
    GridChartsIntegrationApi['setChartSynchronizationState']
  >(
    (chartId, synced) => {
      if (!isChartsIntegrationAvailable || !chartStateLookup[chartId]) {
        return;
      }

      const stateUpdate = {
        synced,
      };

      const updatedChartStateLookup = {
        ...chartStateLookup,
        [chartId]: {
          ...chartStateLookup[chartId],
          ...stateUpdate,
        },
      };

      setChartState(chartId, stateUpdate);
      apiRef.current.publishEvent('chartSynchronizationStateChange', { chartId, synced });
      if (synced) {
        debouncedHandleColumnDataUpdate([chartId], updatedChartStateLookup);
      }
    },
    [
      apiRef,
      isChartsIntegrationAvailable,
      chartStateLookup,
      setChartState,
      debouncedHandleColumnDataUpdate,
    ],
  );

  // called when a column is dragged and dropped to a different section
  const updateDataReference = React.useCallback<
    GridChartsIntegrationPrivateApi['chartsIntegration']['updateDataReference']
  >(
    (field, originSection, targetSection, targetField, placementRelativeToTargetField) => {
      const columns = gridColumnLookupSelector(apiRef);
      const categories = gridChartsCategoriesSelector(apiRef, activeChartId);
      const series = gridChartsSeriesSelector(apiRef, activeChartId);
      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

      if (targetSection) {
        if (
          isBlockedForSection(
            columns[field],
            targetSection,
            rowGroupingModel,
            pivotActive ? pivotModel : undefined,
          )
        ) {
          return;
        }

        const currentTargetItems = targetSection === 'categories' ? categories : series;
        const currentMaxItems =
          targetSection === 'categories'
            ? chartStateLookup[activeChartId]?.maxCategories
            : chartStateLookup[activeChartId]?.maxSeries;

        if (currentMaxItems && currentTargetItems.length >= currentMaxItems) {
          return;
        }
      }

      let hidden: boolean | undefined;
      if (originSection) {
        const method = originSection === 'categories' ? updateCategories : updateSeries;
        const currentItems = originSection === 'categories' ? [...categories] : [...series];

        const fieldIndex = currentItems.findIndex((item) => item.field === field);
        if (fieldIndex !== -1) {
          hidden = currentItems[fieldIndex].hidden;
        }

        // if the target is another section, remove the field from the origin section
        if (targetSection !== originSection) {
          currentItems.splice(fieldIndex, 1);
          method(activeChartId, currentItems);
        }
      }

      if (targetSection) {
        const method = targetSection === 'categories' ? updateCategories : updateSeries;
        const currentItems = targetSection === 'categories' ? categories : series;
        const remainingItems =
          targetSection === originSection
            ? currentItems.filter((item) => item.field !== field)
            : [...currentItems];

        // with row grouping add the aggregation model to the newly added series
        if (rowGroupingModel.length > 0 && targetSection === 'series') {
          const hasAggregation = Object.keys(aggregationModel).includes(field);
          if (!hasAggregation) {
            apiRef.current.setAggregationModel({
              ...aggregationModel,
              [field]: getAvailableAggregationFunctions({
                aggregationFunctions: props.aggregationFunctions,
                colDef: columns[field],
                isDataSource: !!props.dataSource,
              })[0],
            });
          }
        }

        if (targetField) {
          const targetFieldIndex = remainingItems.findIndex((item) => item.field === targetField);
          const targetIndex =
            placementRelativeToTargetField === 'top' ? targetFieldIndex : targetFieldIndex + 1;
          remainingItems.splice(targetIndex, 0, { field, hidden });
          method(activeChartId, remainingItems);
        } else {
          method(activeChartId, [...remainingItems, { field, hidden }]);
        }
      }
    },
    [
      apiRef,
      props.aggregationFunctions,
      props.dataSource,
      activeChartId,
      chartStateLookup,
      updateCategories,
      updateSeries,
      aggregationModel,
      pivotActive,
      pivotModel,
    ],
  );

  const addColumnMenuButton = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (menuItems) => {
      if (isChartsIntegrationAvailable) {
        return [...menuItems, 'columnMenuManagePanelItem'];
      }
      return menuItems;
    },
    [isChartsIntegrationAvailable],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButton);

  const addChartsPanel = React.useCallback<GridPipeProcessor<'sidebar'>>(
    (initialValue, value) => {
      if (
        props.slots.chartsPanel &&
        isChartsIntegrationAvailable &&
        value === GridSidebarValue.Charts
      ) {
        return <props.slots.chartsPanel {...props.slotProps?.chartsPanel} />;
      }

      return initialValue;
    },
    [props, isChartsIntegrationAvailable],
  );

  useGridRegisterPipeProcessor(apiRef, 'sidebar', addChartsPanel);

  useGridApiMethod(
    apiRef,
    { chartsIntegration: { updateDataReference, getColumnName } },
    'private',
  );
  useGridApiMethod(
    apiRef,
    props.experimentalFeatures?.chartsIntegration
      ? {
          setChartsPanelOpen,
          setActiveChartId,
          setChartType,
          setChartSynchronizationState,
          updateSeries,
          updateCategories,
        }
      : {},
    'public',
  );

  useGridEvent(
    apiRef,
    'columnsChange',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleColumnDataUpdate(syncedChartIds)),
  );
  useGridEvent(
    apiRef,
    'pivotModeChange',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleColumnDataUpdate(syncedChartIds)),
  );
  useGridEvent(
    apiRef,
    'filteredRowsSet',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleRowDataUpdate(syncedChartIds)),
  );
  useGridEvent(
    apiRef,
    'sortedRowsSet',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleRowDataUpdate(syncedChartIds)),
  );

  React.useEffect(() => {
    if (!activeChartId && availableChartIds.length > 0) {
      setActiveChartId(availableChartIds[0]);
    }
  }, [availableChartIds, activeChartId, setActiveChartId]);

  const isInitialized = React.useRef(false);
  React.useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    if (availableChartIds.length === 0) {
      return;
    }

    isInitialized.current = true;

    availableChartIds.forEach((chartId) => {
      const chartType = props.initialState?.chartsIntegration?.charts?.[chartId]?.chartType || '';
      setChartState(chartId, {
        type: chartType,
        maxCategories: schema[chartType]?.maxCategories,
        maxSeries: schema[chartType]?.maxSeries,
        configuration:
          props.initialState?.chartsIntegration?.charts?.[chartId]?.configuration || {},
      });
    });

    debouncedHandleColumnDataUpdate(syncedChartIds);
  }, [
    schema,
    availableChartIds,
    syncedChartIds,
    props.initialState?.chartsIntegration?.charts,
    setChartState,
    debouncedHandleColumnDataUpdate,
  ]);
};
