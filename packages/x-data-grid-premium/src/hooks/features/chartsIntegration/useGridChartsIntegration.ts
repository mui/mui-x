'use client';
import * as React from 'react';
import debounce from '@mui/utils/debounce';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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
import { getBlockedSections } from './utils';

export const chartsIntegrationStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    'chartsIntegration' | 'chartsPanelOpen' | 'initialState' | 'activeChartId'
  >
> = (state, props) => {
  if (!props.chartsIntegration) {
    return {
      ...state,
      chartsIntegration: {
        activeChartId: '',
        configurationPanel: {
          open: false,
        },
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
              !getBlockedSections(columnsLookup[category.field] as GridColDef).includes(
                'categories',
              ),
          ),
        series: (chart.series || [])
          .map((seriesItem) =>
            typeof seriesItem === 'string' ? { field: seriesItem, hidden: false } : seriesItem,
          )
          .filter(
            (seriesItem) =>
              columnsLookup[seriesItem.field]?.chartable === true &&
              !getBlockedSections(columnsLookup[seriesItem.field] as GridColDef).includes('series'),
          ),
      },
    ]),
  );

  return {
    ...state,
    chartsIntegration: {
      activeChartId:
        props.activeChartId ?? props.initialState?.chartsIntegration?.activeChartId ?? '',
      configurationPanel: {
        open:
          props.chartsPanelOpen ??
          props.initialState?.chartsIntegration?.configurationPanel?.open ??
          false,
      },
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
    | 'chartsPanelOpen'
    | 'onChartsPanelOpenChange'
    | 'activeChartId'
    | 'onActiveChartIdChange'
    | 'initialState'
    | 'slotProps'
  >,
) => {
  const visibleCategories = React.useRef<Record<string, GridColDef[]>>({});
  const visibleSeries = React.useRef<Record<string, GridColDef[]>>({});

  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable = !!props.chartsIntegration && !!context;
  const activeChartId = gridChartsIntegrationActiveChartIdSelector(apiRef);

  const { chartStateLookup, setChartState } = context || EMPTY_CHART_INTEGRATION_CONTEXT;
  const chartIds = Object.keys(chartStateLookup);

  const getColumnName = React.useCallback(
    (field: string) => {
      if (props.slotProps?.chartsPanel?.getColumnName) {
        return props.slotProps.chartsPanel.getColumnName(field);
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
    stateId: 'chartsPanelOpen',
    propModel: props.chartsPanelOpen,
    propOnChange: props.onChartsPanelOpenChange,
    stateSelector: gridChartsPanelOpenSelector,
    changeEvent: 'chartsPanelOpenChange',
  });

  apiRef.current.registerControlState({
    stateId: 'activeChartId',
    propModel: props.activeChartId,
    propOnChange: props.onActiveChartIdChange,
    stateSelector: gridChartsIntegrationActiveChartIdSelector,
    changeEvent: 'activeChartIdChange',
  });

  const handleRowDataUpdate = React.useCallback(
    (forceChartId?: string) => {
      const availableCharts = chartIds.filter((chartId) =>
        forceChartId ? chartId === forceChartId : chartStateLookup[chartId].synced !== false,
      );

      if (availableCharts.length === 0) {
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

      availableCharts.forEach((chartId) => {
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
    [apiRef, getColumnName, setChartState, chartIds, chartStateLookup],
  );

  const debouncedHandleRowDataUpdate = React.useMemo(
    () => debounce(handleRowDataUpdate, 0),
    [handleRowDataUpdate],
  );

  const handleColumnDataUpdate = React.useCallback(
    (forceChartId?: string) => {
      // if there are no charts, skip the data processing
      if (chartIds.length === 0) {
        return;
      }

      const availableCharts = chartIds.filter((chartId) =>
        forceChartId ? chartId === forceChartId : chartStateLookup[chartId].synced !== false,
      );

      if (availableCharts.length === 0) {
        return;
      }

      const chartableColumns = gridChartableColumnsSelector(apiRef);
      const selectedFields = availableCharts.reduce(
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

      availableCharts.forEach((chartId) => {
        categories[chartId] = [];
        series[chartId] = [];

        // Sanitize selectedSeries and selectedCategories while maintaining their order
        for (let i = 0; i < selectedFields[chartId].series.length; i += 1) {
          if (chartableColumns[selectedFields[chartId].series[i].field]) {
            if (!series[chartId]) {
              series[chartId] = [];
            }
            series[chartId].push(selectedFields[chartId].series[i]);
          }
        }

        // categories cannot contain fields that are already in series
        for (let i = 0; i < selectedFields[chartId].categories.length; i += 1) {
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

      debouncedHandleRowDataUpdate(forceChartId);
    },
    [apiRef, debouncedHandleRowDataUpdate],
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
      apiRef.current.setState((state) => ({
        ...state,
        chartsIntegration: {
          ...state.chartsIntegration,
          configurationPanel: {
            ...state.chartsIntegration.configurationPanel,
            open:
              typeof callback === 'function'
                ? callback(state.chartsIntegration.configurationPanel.open)
                : callback,
          },
        },
      }));
    },
    [apiRef, isChartsIntegrationAvailable],
  );

  useEnhancedEffect(() => {
    if (props.chartsPanelOpen !== undefined) {
      apiRef.current.setChartsPanelOpen(props.chartsPanelOpen);
    }
  }, [apiRef, props.chartsPanelOpen]);

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
      debouncedHandleColumnDataUpdate();
    },
    [apiRef, debouncedHandleColumnDataUpdate],
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
      debouncedHandleColumnDataUpdate();
    },
    [apiRef, debouncedHandleColumnDataUpdate],
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
      if (synced) {
        debouncedHandleColumnDataUpdate(chartId);
      }
    },
    [apiRef, setChartState, debouncedHandleColumnDataUpdate],
  );

  const updateDataReference = React.useCallback<
    GridChartsIntegrationPrivateApi['chartsIntegration']['updateDataReference']
  >(
    (field, originSection, targetSection, targetField, placementRelativeToTargetField) => {
      const columns = gridColumnLookupSelector(apiRef);
      const categories = gridChartsCategoriesSelector(apiRef, activeChartId);
      const series = gridChartsSeriesSelector(apiRef, activeChartId);

      if (targetSection && getBlockedSections(columns[field]).includes(targetSection)) {
        return;
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
    [apiRef, activeChartId, updateCategories, updateSeries],
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
    runIf(isChartsIntegrationAvailable, () => debouncedHandleColumnDataUpdate()),
  );
  useGridEvent(
    apiRef,
    'pivotModeChange',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleColumnDataUpdate()),
  );
  useGridEvent(
    apiRef,
    'filteredRowsSet',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleRowDataUpdate()),
  );
  useGridEvent(
    apiRef,
    'sortedRowsSet',
    runIf(isChartsIntegrationAvailable, () => debouncedHandleRowDataUpdate()),
  );

  React.useEffect(() => {
    if (!activeChartId && chartIds.length > 0) {
      setActiveChartId(chartIds[0]);
    }
  }, [chartIds, activeChartId, setActiveChartId]);

  const isInitialized = React.useRef(false);
  React.useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    if (chartIds.length === 0) {
      return;
    }

    isInitialized.current = true;

    chartIds.forEach((chartId) => {
      setChartState(chartId, {
        type: props.initialState?.chartsIntegration?.charts?.[chartId]?.chartType || '',
        configuration:
          props.initialState?.chartsIntegration?.charts?.[chartId]?.configuration || {},
      });
    });

    debouncedHandleColumnDataUpdate();
  }, [
    chartIds,
    props.initialState?.chartsIntegration?.charts,
    setChartState,
    debouncedHandleColumnDataUpdate,
  ]);
};
