import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { RefObject } from '@mui/x-internals/types';
import useOnMount from '@mui/utils/useOnMount';
import {
  gridRowsLoadingSelector,
  gridFilteredSortedRowEntriesSelector,
} from '@mui/x-data-grid-pro';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridEvent,
  gridColumnLookupSelector,
  runIf,
} from '@mui/x-data-grid-pro/internals';

import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { GridChartsIntegrationContextValue } from '../../../models/gridChartsIntegration';
import {
  GridChartsIntegrationApi,
  GridChartsIntegrationPrivateApi,
  GridChartsIntegrationState,
} from './gridChartsIntegrationInterfaces';
import {
  gridChartsConfigurationPanelOpenSelector,
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
} from './gridChartsIntegrationSelectors';
import { useGridChartsIntegrationContext } from '../../utils/useGridChartIntegration';

export const chartsIntegrationStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    'chartsIntegration' | 'chartsConfigurationPanelOpen' | 'initialState'
  >
> = (state, props) => {
  if (!props.chartsIntegration) {
    return {
      ...state,
      chartsIntegration: {
        configurationPanel: {
          open: false,
        },
        categories: [],
        series: [],
      } as GridChartsIntegrationState,
    };
  }

  return {
    ...state,
    chartsIntegration: {
      configurationPanel: {
        open:
          props.chartsConfigurationPanelOpen ??
          props.initialState?.chartsIntegration?.configurationPanel?.open ??
          false,
      },
      categories: props.initialState?.chartsIntegration?.categories ?? [],
      series: props.initialState?.chartsIntegration?.series ?? [],
    } as GridChartsIntegrationState,
  };
};

const EMPTY_CHART_INTEGRATION_CONTEXT: Partial<GridChartsIntegrationContextValue> = {
  categories: [],
  series: [],
  chartType: '',
  setChartType: () => {},
  setCategories: () => {},
  setSeries: () => {},
};

export const useGridChartsIntegration = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'chartsIntegration'
    | 'chartsConfigurationPanelOpen'
    | 'onChartsConfigurationPanelOpenChange'
    | 'initialState'
    | 'slotProps'
  >,
) => {
  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable = !!props.chartsIntegration && !!context;

  const { setChartType, setCategories, setSeries } = context || EMPTY_CHART_INTEGRATION_CONTEXT;

  apiRef.current.registerControlState({
    stateId: 'chartsConfigurationPanelOpen',
    propModel: props.chartsConfigurationPanelOpen,
    propOnChange: props.onChartsConfigurationPanelOpenChange,
    stateSelector: gridChartsConfigurationPanelOpenSelector,
    changeEvent: 'chartsConfigurationPanelOpenChange',
  });

  const handleDataUpdate = React.useCallback(() => {
    const columns = Object.values(gridColumnLookupSelector(apiRef));
    const rows = Object.values(gridFilteredSortedRowEntriesSelector(apiRef)).map((r) => r.model);

    const selectedSeries = gridChartsSeriesSelector(apiRef);
    const selectedCategories = gridChartsCategoriesSelector(apiRef);
    const series = columns.find((c) => c.field === selectedSeries[0]);
    const category = columns.find((c) => c.field === selectedCategories[0]);

    if (!category || !series) {
      setCategories([]);
      setSeries([]);
      return;
    }

    setCategories([
      {
        id: category.field,
        label: category.headerName || category.field,
        data: rows.map((r) => r[category.field]),
      },
    ]);
    setSeries([
      {
        id: series.field,
        label: series.headerName || series.field,
        data: rows.map((r) => r[series.field]),
      },
    ]);
  }, [apiRef, setCategories, setSeries]);

  const setChartsConfigurationPanelOpen = React.useCallback<
    GridChartsIntegrationApi['setChartsConfigurationPanelOpen']
  >(
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

  useGridApiMethod(apiRef, { setChartsConfigurationPanelOpen }, 'public');

  useEnhancedEffect(() => {
    if (props.chartsConfigurationPanelOpen !== undefined) {
      apiRef.current.setChartsConfigurationPanelOpen(props.chartsConfigurationPanelOpen);
    }
  }, [apiRef, props.chartsConfigurationPanelOpen]);

  useEnhancedEffect(() => {
    setChartType(props.initialState?.chartsIntegration?.chartType || '');
  }, [apiRef, props.initialState?.chartsIntegration?.chartType, setChartType]);

  useOnMount(() => {
    if (!isChartsIntegrationAvailable) {
      return undefined;
    }

    const isLoading = gridRowsLoadingSelector(apiRef) ?? false;

    if (!isLoading) {
      handleDataUpdate();
      return undefined;
    }

    const unsubscribe = apiRef.current?.store.subscribe(() => {
      const loading = gridRowsLoadingSelector(apiRef);
      if (loading === false) {
        unsubscribe();
        handleDataUpdate();
      }
    });

    return unsubscribe;
  });

  const updateCategories = React.useCallback(
    (categories: string[]) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            categories,
          },
        };
      });
      handleDataUpdate();
    },
    [apiRef, handleDataUpdate],
  );

  const updateSeries = React.useCallback(
    (series: string[]) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            series,
          },
        };
      });
      handleDataUpdate();
    },
    [apiRef, handleDataUpdate],
  );

  const updateDataReference = React.useCallback<
    GridChartsIntegrationPrivateApi['chartsIntegration']['updateDataReference']
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (field, originSection, targetSection, targetField, placementRelativeToTargetField) => {
      const columns = gridColumnLookupSelector(apiRef);
      const categories = gridChartsCategoriesSelector(apiRef);
      const series = gridChartsSeriesSelector(apiRef);

      // TODO: update UI for this
      if (targetSection === 'series' && columns[field].type !== 'number') {
        return;
      }

      if (originSection) {
        const method = originSection === 'categories' ? updateCategories : updateSeries;
        const currentItems = originSection === 'categories' ? categories : series;
        method(currentItems.filter((item) => item !== field));
      }

      if (targetSection) {
        const method = targetSection === 'categories' ? updateCategories : updateSeries;
        // const currentItems = targetSection === 'categories' ? categories : series;
        // method([...currentItems, field]);
        // TODO: allow more fields in section
        method([field]);
      }
    },
    [apiRef, updateCategories, updateSeries],
  );

  useGridApiMethod(apiRef, { chartsIntegration: { updateDataReference } }, 'private');

  useGridEvent(apiRef, 'columnsChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'sortedRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
};
