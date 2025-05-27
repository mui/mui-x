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
  GridChartsIntegrationState,
} from './gridChartsIntegrationInterfaces';
import { gridChartsConfigurationPanelOpenSelector } from './gridChartsIntegrationSelectors';
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
    } as GridChartsIntegrationState,
  };
};

const EMPTY_CHART_INTEGRATION_CONTEXT: GridChartsIntegrationContextValue = {
  categories: [],
  series: [],
  chartType: '',
  configuration: {},
  setConfiguration: () => {},
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
    | 'slotProps'
  >,
) => {
  const context = useGridChartsIntegrationContext(true);
  const isChartsIntegrationAvailable = !!props.chartsIntegration && !!context;

  const { configuration, setConfiguration, setChartType, setCategories, setSeries } =
    context || EMPTY_CHART_INTEGRATION_CONTEXT;

  apiRef.current.registerControlState({
    stateId: 'chartsConfigurationPanelOpen',
    propModel: props.chartsConfigurationPanelOpen,
    propOnChange: props.onChartsConfigurationPanelOpenChange,
    stateSelector: gridChartsConfigurationPanelOpenSelector,
    changeEvent: 'chartsConfigurationPanelOpenChange',
  });

  const handleDataUpdate = React.useCallback(() => {
    const columns = gridColumnLookupSelector(apiRef);
    const rows = Object.values(gridFilteredSortedRowEntriesSelector(apiRef)).map((r) => r.model);

    // TODO: should be configurable
    const category = Object.values(columns).find((c) => c.type === 'string')?.field;
    const series = Object.values(columns).find((c) => c.type === 'number')?.field;

    if (!category || !series) {
      return;
    }

    setCategories(rows.map((r) => r[category]));
    setSeries([
      {
        id: columns[series].field,
        label: columns[series].headerName || columns[series].field,
        data: rows.map((r) => r[series]),
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
      apiRef.current.setPivotPanelOpen(props.chartsConfigurationPanelOpen);
    }
  }, [apiRef, props.chartsConfigurationPanelOpen]);

  useEnhancedEffect(() => {
    if (props.slotProps?.chartsConfigurationPanel?.schema !== undefined) {
      setConfiguration(props.slotProps?.chartsConfigurationPanel?.schema);

      // select first chart type
      // TODO: should come from the initial state
      if (configuration.chartType === undefined) {
        setChartType(props.slotProps?.chartsConfigurationPanel?.schema.chartType[0]);
      }
    }
  }, [
    apiRef,
    configuration.chartType,
    props.slotProps?.chartsConfigurationPanel?.schema,
    setConfiguration,
    setChartType,
  ]);

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

  useGridEvent(apiRef, 'columnsChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
};
