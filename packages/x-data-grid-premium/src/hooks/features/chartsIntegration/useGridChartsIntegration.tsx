'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import { RefObject } from '@mui/x-internals/types';
import {
  GridColDef,
  gridColumnGroupsUnwrappedModelSelector,
  gridFilteredSortedTopLevelRowEntriesSelector,
} from '@mui/x-data-grid-pro';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridEvent,
  gridColumnLookupSelector,
  runIf,
  getRowValue,
  gridPivotActiveSelector,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';

import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  ChartState,
  GridChartsIntegrationContextValue,
} from '../../../models/gridChartsIntegration';
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
import { GridSidebarValue } from '../sidebar';

export const chartsIntegrationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'chartsIntegration' | 'initialState' | 'activeChartId'>
> = (state, props) => {
  if (!props.chartsIntegration) {
    return {
      ...state,
      chartsIntegration: {
        activeChartId: '',
        charts: {},
      } as GridChartsIntegrationState,
    };
  }

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
              !isBlockedForSection(columnsLookup[category.field] as GridColDef, 'categories'),
          ),
        series: (chart.series || [])
          .map((seriesItem) =>
            typeof seriesItem === 'string' ? { field: seriesItem, hidden: false } : seriesItem,
          )
          .filter(
            (seriesItem) =>
              columnsLookup[seriesItem.field]?.chartable === true &&
              !isBlockedForSection(columnsLookup[seriesItem.field] as GridColDef, 'series'),
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
  >,
) => {
  const visibleCategories = React.useRef<Record<string, GridColDef[]>>({});
  const visibleSeries = React.useRef<Record<string, GridColDef[]>>({});

  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable = !!props.chartsIntegration && !!context;
  const activeChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);

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
      const pivotActive = gridPivotActiveSelector(apiRef);
      const unwrappedColumnGroupingModel = gridColumnGroupsUnwrappedModelSelector(apiRef);

      const column = columns[field];

      const columnName = column?.headerName || field;
      if (!pivotActive || !unwrappedColumnGroupingModel[field]) {
        return columnName;
      }

      const groupPath = unwrappedColumnGroupingModel[field].slice(-1)[0];
      return [columnName, ...groupPath.split(COLUMN_GROUP_ID_SEPARATOR)].join(' - ');
    },
    [apiRef, props.slotProps?.chartsPanel],
  );

  apiRef.current.registerControlState({
    stateId: 'activeChartId',
    propModel: props.activeChartId,
    propOnChange: props.onActiveChartIdChange,
    stateSelector: gridChartsIntegrationActiveChartIdSelector,
    changeEvent: 'activeChartIdChange',
  });

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
      const rows = Object.values(gridFilteredSortedTopLevelRowEntriesSelector(apiRef));

      // keep only unique columns
      const dataColumns = [
        ...new Set([
          ...Object.values(visibleCategories.current).flat(),
          ...Object.values(visibleSeries.current).flat(),
        ]),
      ];

      // go through data only once and collect everything that will be needed
      const data: Record<any, (string | number | null)[]> = Object.fromEntries(
        dataColumns.map((column) => [column.field, []]),
      );
      for (let i = 0; i < rows.length; i += 1) {
        for (let j = 0; j < dataColumns.length; j += 1) {
          const value: string | { label: string } | null = getRowValue(
            rows[i].model,
            dataColumns[j],
            apiRef,
          );
          if (value !== null) {
            data[dataColumns[j].field].push(
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
    [apiRef, getColumnName, setChartState],
  );

  const debouncedHandleRowDataUpdate = React.useMemo(
    () => debounce(handleRowDataUpdate, 0),
    [handleRowDataUpdate],
  );

  const handleColumnDataUpdate = React.useCallback(
    (chartIds: string[]) => {
      // if there are no charts, skip the data processing
      if (chartIds.length === 0) {
        return;
      }

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
        // if the selection is greater than the max limit, the state will be updated
        const categoriesSize = chartStateLookup[chartId]?.maxCategories
          ? Math.min(
              chartStateLookup[chartId].maxCategories,
              selectedFields[chartId].categories.length,
            )
          : selectedFields[chartId].categories.length;
        const seriesSize = chartStateLookup[chartId]?.maxSeries
          ? Math.min(chartStateLookup[chartId].maxSeries, selectedFields[chartId].series.length)
          : selectedFields[chartId].series.length;

        // sanitize selectedSeries and selectedCategories while maintaining their order
        for (let i = 0; i < seriesSize; i += 1) {
          if (chartableColumns[selectedFields[chartId].series[i].field]) {
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
            chartableColumns[item.field]
          ) {
            if (!categories[chartId]) {
              categories[chartId] = [];
            }
            categories[chartId].push(item);
          }
        }

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

        if (
          visibleCategories.current[chartId].length === 0 ||
          visibleSeries.current[chartId].length === 0
        ) {
          visibleCategories.current[chartId] = [];
          visibleSeries.current[chartId] = [];
        }
      });

      debouncedHandleRowDataUpdate(chartIds);
    },
    [apiRef, chartStateLookup, debouncedHandleRowDataUpdate],
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
    [apiRef, syncedChartIds, debouncedHandleColumnDataUpdate],
  );

  const updateSeries = React.useCallback(
    (
      chartId: string,
      series:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
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
    [apiRef, syncedChartIds, debouncedHandleColumnDataUpdate],
  );

  const setActiveChartId = React.useCallback<GridChartsIntegrationApi['setActiveChartId']>(
    (chartId) => {
      apiRef.current.setState((state) => ({
        ...state,
        chartsIntegration: {
          ...state.chartsIntegration,
          activeChartId: chartId,
        },
      }));
    },
    [apiRef],
  );

  const setChartSynchronizationState = React.useCallback<
    GridChartsIntegrationApi['setChartSynchronizationState']
  >(
    (chartId, synced) => {
      setChartState(chartId, {
        synced,
      });
      apiRef.current.publishEvent('chartSynchronizationStateChange', { chartId, synced });
      if (synced && chartStateLookup[chartId]) {
        debouncedHandleColumnDataUpdate([chartId]);
      }
    },
    [apiRef, chartStateLookup, setChartState, debouncedHandleColumnDataUpdate],
  );

  const updateDataReference = React.useCallback<
    GridChartsIntegrationPrivateApi['chartsIntegration']['updateDataReference']
  >(
    (field, originSection, targetSection, targetField, placementRelativeToTargetField) => {
      const columns = gridColumnLookupSelector(apiRef);
      const categories = gridChartsCategoriesSelector(apiRef, activeChartId);
      const series = gridChartsSeriesSelector(apiRef, activeChartId);

      if (targetSection) {
        if (isBlockedForSection(columns[field], targetSection)) {
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
    [apiRef, activeChartId, chartStateLookup, updateCategories, updateSeries],
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
    {
      setChartsPanelOpen,
      setActiveChartId,
      setChartSynchronizationState,
      updateSeries,
      updateCategories,
    },
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
    const schema = props.slotProps?.chartsPanel?.schema || {};

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
    availableChartIds,
    syncedChartIds,
    props.initialState?.chartsIntegration?.charts,
    props.slotProps?.chartsPanel?.schema,
    setChartState,
    debouncedHandleColumnDataUpdate,
  ]);
};
