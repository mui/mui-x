'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import { RefObject } from '@mui/x-internals/types';
import {
  GridColDef,
  gridColumnGroupsLookupSelector,
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
  GridRestoreStatePreProcessingContext,
} from '@mui/x-data-grid-pro/internals';

import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
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
  gridChartsDimensionsSelector,
  gridChartsValuesSelector,
  gridChartsIntegrationActiveChartIdSelector,
  gridChartableColumnsSelector,
  gridChartsIntegrationChartsLookupSelector,
} from './gridChartsIntegrationSelectors';
import { useGridChartsIntegrationContext } from '../../utils/useGridChartIntegration';
import { isBlockedForSection } from './utils';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { GridSidebarValue } from '../sidebar';
import {
  getAggregationFunctionLabel,
  getAvailableAggregationFunctions,
} from '../aggregation/gridAggregationUtils';
import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import type { GridPivotModel } from '../pivoting/gridPivotingInterfaces';

const EMPTY_CHART_INTEGRATION_CONTEXT: GridChartsIntegrationContextValue = {
  chartStateLookup: {},
  setChartState: () => {},
};

export const EMPTY_CHART_INTEGRATION_CONTEXT_STATE: ChartState = {
  synced: true,
  dimensions: [],
  values: [],
  type: '',
  configuration: {},
};

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
  if (!props.chartsIntegration || !props.experimentalFeatures?.charts) {
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
        dimensions: (chart.dimensions || [])
          .map((dimension) =>
            typeof dimension === 'string' ? { field: dimension, hidden: false } : dimension,
          )
          .filter(
            (dimension) =>
              columnsLookup[dimension.field]?.chartable === true &&
              !isBlockedForSection(
                columnsLookup[dimension.field] as GridColDef,
                'dimensions',
                rowGroupingModel,
                pivotModel,
              ),
          ),
        values: (chart.values || [])
          .map((value) => (typeof value === 'string' ? { field: value, hidden: false } : value))
          .filter(
            (value) =>
              columnsLookup[value.field]?.chartable === true &&
              !isBlockedForSection(
                columnsLookup[value.field] as GridColDef,
                'values',
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
  const visibleDimensions = React.useRef<Record<string, GridColDef[]>>({});
  const visibleValues = React.useRef<Record<string, GridColDef[]>>({});
  const schema = React.useMemo(
    () => props.slotProps?.chartsPanel?.schema || {},
    [props.slotProps?.chartsPanel?.schema],
  );

  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable =
    !!props.chartsIntegration && !!props.experimentalFeatures?.charts && !!context;
  const activeChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);
  const aggregationModel = gridAggregationModelSelector(apiRef);
  const pivotActive = gridPivotActiveSelector(apiRef);
  const pivotModel = gridPivotModelSelector(apiRef);

  const { chartStateLookup, setChartState } = context || EMPTY_CHART_INTEGRATION_CONTEXT;
  const availableChartIds = React.useMemo(() => {
    const ids = Object.keys(chartStateLookup);
    // cleanup visibleDimensions and visibleValues references
    Object.keys(visibleDimensions.current).forEach((chartId) => {
      if (!ids.includes(chartId)) {
        delete visibleDimensions.current[chartId];
        delete visibleValues.current[chartId];
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
      const columnGroupPath = gridColumnGroupsUnwrappedModelSelector(apiRef)[field] ?? [];
      const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);

      const column = columns[field];

      const columnName = column?.headerName || field;
      if (!pivotActive || !columnGroupPath) {
        return columnName;
      }

      const groupNames = columnGroupPath.map(
        (group) => columnGroupLookup[group].headerName || group,
      );
      return [columnName, ...groupNames].join(' - ');
    },
    [apiRef, pivotActive, props.slotProps?.chartsPanel],
  );

  // Adds aggregation function label to the column name
  const getValueDatasetLabel = React.useCallback(
    (field: string) => {
      const customFieldName = props.slotProps?.chartsPanel?.getColumnName?.(field);
      if (customFieldName) {
        return customFieldName;
      }

      const columnName = getColumnName(field);
      const fieldAggregation = gridAggregationModelSelector(apiRef)[field];

      const suffix = fieldAggregation
        ? ` (${getAggregationFunctionLabel({
            apiRef,
            aggregationRule: {
              aggregationFunctionName: fieldAggregation,
              aggregationFunction: props.aggregationFunctions[fieldAggregation] || {},
            },
          })})`
        : '';

      return `${columnName}${suffix}`;
    },
    [apiRef, props.aggregationFunctions, props.slotProps?.chartsPanel, getColumnName],
  );

  apiRef.current.registerControlState({
    stateId: 'activeChartId',
    propModel: props.activeChartId,
    propOnChange: props.onActiveChartIdChange,
    stateSelector: gridChartsIntegrationActiveChartIdSelector,
    changeEvent: 'activeChartIdChange',
  });

  // sometimes, updates made to the chart dimensions and values require updating other models
  // for example, if we are adding more than one dimension, we need to set the new grouping model
  // if we are adding new value dataset to the grouped data, we need to set the aggregation model, otherwise the values will be undefined
  const updateOtherModels = React.useCallback(() => {
    const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);

    if (
      visibleDimensions.current[activeChartId]?.length > 0 &&
      // if there was row grouping or if we are adding more than one dimension, set the new grouping model
      (rowGroupingModel.length > 0 || visibleDimensions.current[activeChartId].length > 1) &&
      // if row grouping model starts with dimensions in the same order, we don't have to do anything
      visibleDimensions.current[activeChartId].some(
        (item, index) => item.field !== rowGroupingModel[index],
      )
    ) {
      // if pivoting is enabled, then the row grouping model is driven by the pivoting rows
      const newGroupingModel = visibleDimensions.current[activeChartId].map((item) => item.field);
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

    if (!pivotActive && visibleValues.current[activeChartId] && rowGroupingModel.length > 0) {
      // with row grouping add the aggregation model to the newly added value dataset
      const aggregatedFields = Object.keys(aggregationModel);
      const aggregationsToAdd: GridAggregationModel = {};

      visibleValues.current[activeChartId].forEach((item) => {
        const hasAggregation = aggregatedFields.includes(item.field);
        if (!hasAggregation) {
          // use the first available aggregation function
          aggregationsToAdd[item.field] = getAvailableAggregationFunctions({
            aggregationFunctions: props.aggregationFunctions,
            colDef: item,
            isDataSource: !!props.dataSource,
          })[0];
        }
      });

      if (Object.keys(aggregationsToAdd).length > 0) {
        apiRef.current.setAggregationModel({
          ...aggregationModel,
          ...aggregationsToAdd,
        });
      }
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
          (chartId) => !visibleDimensions.current[chartId] || !visibleValues.current[chartId],
        )
      ) {
        return;
      }

      const orderedFields = gridColumnFieldsSelector(apiRef);
      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);
      const rowsPerDepth = gridFilteredSortedDepthRowEntriesSelector(apiRef);
      const currentChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);
      const defaultDepth = Math.max(
        0,
        (visibleDimensions.current[currentChartId]?.length ?? 0) - 1,
      );
      const rowsAtDefaultDepth = (rowsPerDepth[defaultDepth] ?? []).length;

      // keep only unique columns and transform the grouped column to carry the correct field name to get the grouped value
      const dataColumns = [
        ...new Set([
          ...Object.values(visibleDimensions.current).flat(),
          ...Object.values(visibleValues.current).flat(),
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
          // if multiple columns are grouped, we need to get the value from the parent to properly create dimension groups
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
          dimensions: visibleDimensions.current[chartId].map((dimension) => ({
            id: dimension.field,
            label: getColumnName(dimension.field),
            data: data[dimension.field] || [],
          })),
          values: visibleValues.current[chartId].map((value) => ({
            id: value.field,
            label: getValueDatasetLabel(value.field),
            data: (data[value.field] || []) as (number | null)[],
          })),
        });
      });
    },
    [apiRef, getColumnName, getValueDatasetLabel, setChartState],
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
          const values = gridChartsValuesSelector(apiRef, chartId);
          const dimensions = gridChartsDimensionsSelector(apiRef, chartId);
          return {
            ...acc,
            [chartId]: {
              values,
              dimensions,
            },
          };
        },
        {} as Record<
          string,
          { values: GridChartsIntegrationItem[]; dimensions: GridChartsIntegrationItem[] }
        >,
      );

      const values: Record<string, GridChartsIntegrationItem[]> = {};
      const dimensions: Record<string, GridChartsIntegrationItem[]> = {};

      chartIds.forEach((chartId) => {
        dimensions[chartId] = [];
        values[chartId] = [];

        // loop through dimensions and values datasets either through their length or to the max limit
        // if the current selection is greater than the max limit, the state will be updated
        const chartState = updatedChartStateLookup?.[chartId] || chartStateLookup[chartId];
        const dimensionsSize = chartState?.maxDimensions
          ? Math.min(chartState.maxDimensions, selectedFields[chartId].dimensions.length)
          : selectedFields[chartId].dimensions.length;
        const valuesSize = chartState?.maxValues
          ? Math.min(chartState.maxValues, selectedFields[chartId].values.length)
          : selectedFields[chartId].values.length;

        // sanitize selectedDimensions and selectedValues while maintaining their order
        for (let i = 0; i < valuesSize; i += 1) {
          if (
            chartableColumns[selectedFields[chartId].values[i].field] &&
            !isBlockedForSection(
              chartableColumns[selectedFields[chartId].values[i].field],
              'values',
              rowGroupingModel,
              pivotActive ? pivotModel : undefined,
            )
          ) {
            if (!values[chartId]) {
              values[chartId] = [];
            }
            values[chartId].push(selectedFields[chartId].values[i]);
          }
        }

        // dimensions cannot contain fields that are already in values
        for (let i = 0; i < dimensionsSize; i += 1) {
          const item = selectedFields[chartId].dimensions[i];
          if (
            !selectedFields[chartId].values.some((valueItem) => valueItem.field === item.field) &&
            chartableColumns[item.field] &&
            !isBlockedForSection(
              chartableColumns[item.field],
              'dimensions',
              rowGroupingModel,
              pivotActive ? pivotModel : undefined,
            )
          ) {
            if (!dimensions[chartId]) {
              dimensions[chartId] = [];
            }
            dimensions[chartId].push(item);
          }
        }

        // we can compare the lengths, because this function is called after the state was updated.
        // different lengths will occur only if some items were removed during the checks above
        if (
          dimensions[chartId] &&
          selectedFields[chartId].dimensions.length !== dimensions[chartId].length
        ) {
          apiRef.current.updateChartDimensionsData(chartId, dimensions[chartId]);
        }

        if (values[chartId] && selectedFields[chartId].values.length !== values[chartId].length) {
          apiRef.current.updateChartValuesData(chartId, values[chartId]);
        }

        visibleDimensions.current[chartId] = dimensions[chartId]
          .filter((dimension) => dimension.hidden !== true)
          .map((dimension) => chartableColumns[dimension.field]);
        visibleValues.current[chartId] = values[chartId]
          .filter((value) => value.hidden !== true)
          .map((value) => chartableColumns[value.field]);

        // we need to have both dimensions and values to be able to display the chart
        if (
          visibleDimensions.current[chartId].length === 0 ||
          visibleValues.current[chartId].length === 0
        ) {
          visibleDimensions.current[chartId] = [];
          visibleValues.current[chartId] = [];
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

  const updateChartDimensionsData = React.useCallback(
    (
      chartId: string,
      dimensions:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      apiRef.current.setState((state) => {
        const newDimensions =
          typeof dimensions === 'function'
            ? dimensions(state.chartsIntegration.charts[chartId].dimensions)
            : dimensions;
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            charts: {
              ...state.chartsIntegration.charts,
              [chartId]: {
                ...state.chartsIntegration.charts[chartId],
                dimensions: newDimensions,
              },
            },
          },
        };
      });
      debouncedHandleColumnDataUpdate(syncedChartIds);
    },
    [apiRef, isChartsIntegrationAvailable, syncedChartIds, debouncedHandleColumnDataUpdate],
  );

  const updateChartValuesData = React.useCallback(
    (
      chartId: string,
      values:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      if (!isChartsIntegrationAvailable) {
        return;
      }

      apiRef.current.setState((state) => {
        const newValues =
          typeof values === 'function'
            ? values(state.chartsIntegration.charts[chartId].values)
            : values;

        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            charts: {
              ...state.chartsIntegration.charts,
              [chartId]: {
                ...state.chartsIntegration.charts[chartId],
                values: newValues,
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
        dimensionsLabel: schema[type]?.dimensionsLabel,
        valuesLabel: schema[type]?.valuesLabel,
        maxDimensions: schema[type]?.maxDimensions,
        maxValues: schema[type]?.maxValues,
      };

      const updatedChartStateLookup = {
        ...chartStateLookup,
        [chartId]: {
          ...chartStateLookup[chartId],
          ...stateUpdate,
        },
      };

      // make sure that the new dimensions and values limits are applied before changing the chart type
      handleColumnDataUpdate([chartId], updatedChartStateLookup);
      setChartState(chartId, stateUpdate);
    },
    [isChartsIntegrationAvailable, chartStateLookup, schema, setChartState, handleColumnDataUpdate],
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
      const dimensions = gridChartsDimensionsSelector(apiRef, activeChartId);
      const values = gridChartsValuesSelector(apiRef, activeChartId);
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

        const currentTargetItems = targetSection === 'dimensions' ? dimensions : values;
        const currentMaxItems =
          targetSection === 'dimensions'
            ? chartStateLookup[activeChartId]?.maxDimensions
            : chartStateLookup[activeChartId]?.maxValues;

        if (currentMaxItems && currentTargetItems.length >= currentMaxItems) {
          return;
        }
      }

      let hidden: boolean | undefined;
      if (originSection) {
        const method =
          originSection === 'dimensions' ? updateChartDimensionsData : updateChartValuesData;
        const currentItems = originSection === 'dimensions' ? [...dimensions] : [...values];

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
        const method =
          targetSection === 'dimensions' ? updateChartDimensionsData : updateChartValuesData;
        const currentItems = targetSection === 'dimensions' ? dimensions : values;
        const remainingItems =
          targetSection === originSection
            ? currentItems.filter((item) => item.field !== field)
            : [...currentItems];

        // with row grouping add the aggregation model to the newly added values dataset
        if (rowGroupingModel.length > 0 && targetSection === 'values') {
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
      updateChartDimensionsData,
      updateChartValuesData,
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
    props.experimentalFeatures?.charts
      ? {
          setChartsPanelOpen,
          setActiveChartId,
          setChartType,
          setChartSynchronizationState,
          updateChartDimensionsData,
          updateChartValuesData,
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
  useGridEvent(
    apiRef,
    'aggregationLookupSet',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleRowDataUpdate(syncedChartIds)),
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, exportContext) => {
      if (!props.chartsIntegration || !props.experimentalFeatures?.charts) {
        return prevState;
      }

      const currentActiveChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);
      const chartsLookup = gridChartsIntegrationChartsLookupSelector(apiRef);
      const integrationContextToExport = Object.fromEntries(
        Object.entries(chartStateLookup).map(([chartId, chartState]) => [
          chartId,
          // keep only the state that is controlled by the user, drop the data and labels
          {
            synced: chartState.synced,
            type: chartState.type,
            configuration: chartState.configuration,
          },
        ]),
      );

      const shouldExportChartState =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !exportContext.exportOnlyDirtyModels ||
        // Always export if the chart state has been initialized
        props.initialState?.chartsIntegration != null ||
        // Export if the chart model or context is not empty
        Object.keys(chartsLookup).length > 0 ||
        Object.keys(integrationContextToExport).length > 0;

      if (!shouldExportChartState) {
        return prevState;
      }

      const chartStateToExport = {
        activeChartId: currentActiveChartId,
        charts: chartsLookup,
        // add a custom prop to keep the integration context in the exported state
        integrationContext: integrationContextToExport,
      };

      return {
        ...prevState,
        chartsIntegration: chartStateToExport,
      };
    },
    [
      apiRef,
      chartStateLookup,
      props.chartsIntegration,
      props.experimentalFeatures?.charts,
      props.initialState?.chartsIntegration,
    ],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, restoreContext) => {
      const chartsRestoreState = (
        restoreContext as GridRestoreStatePreProcessingContext<GridInitialStatePremium>
      ).stateToRestore.chartsIntegration;

      if (!chartsRestoreState) {
        return params;
      }

      const {
        activeChartId: activeChartIdToRestore,
        charts: chartsToRestore,
        integrationContext,
      } = chartsRestoreState as GridChartsIntegrationState & {
        integrationContext: Record<string, ChartState>;
      };

      if (
        activeChartIdToRestore === undefined ||
        chartsToRestore === undefined ||
        Object.keys(chartsToRestore).length === 0
      ) {
        return params;
      }

      apiRef.current.setState({
        ...apiRef.current.state,
        chartsIntegration: {
          activeChartId: activeChartIdToRestore,
          charts: chartsToRestore,
        },
      });

      // restore the integration context for each chart
      Object.entries(integrationContext).forEach(([chartId, chartContextState]) => {
        setChartState(chartId, chartContextState as ChartState);
      });

      return params;
    },
    [apiRef, setChartState],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

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
        maxDimensions: schema[chartType]?.maxDimensions,
        maxValues: schema[chartType]?.maxValues,
        dimensionsLabel: schema[chartType]?.dimensionsLabel,
        valuesLabel: schema[chartType]?.valuesLabel,
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
