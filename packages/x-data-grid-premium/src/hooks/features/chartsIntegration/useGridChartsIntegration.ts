import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { RefObject } from '@mui/x-internals/types';
import useOnMount from '@mui/utils/useOnMount';
import {
  gridRowsLoadingSelector,
  gridFilteredSortedTopLevelRowEntriesSelector,
} from '@mui/x-data-grid-pro';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridEvent,
  gridColumnLookupSelector,
  runIf,
  getRowValue,
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
    const rows = Object.values(gridFilteredSortedTopLevelRowEntriesSelector(apiRef));

    const selectedSeries = gridChartsSeriesSelector(apiRef);
    const selectedCategories = gridChartsCategoriesSelector(apiRef);
    const series = columns.filter((c) => selectedSeries.includes(c.field));
    const category = columns.filter((c) => selectedCategories.includes(c.field));

    if (!category || !series) {
      setCategories([]);
      setSeries([]);
      return;
    }

    const itemCount = new Map<string, number>();
    setCategories(
      category.map((cat) => ({
        id: cat.field,
        label: cat.headerName || cat.field,
        data: rows.map((r) => {
          const value = getRowValue(r.model, cat, apiRef);
          const currentCount = itemCount.get(value) || 0;
          itemCount.set(value, currentCount + 1);
          return currentCount ? `${value} (${currentCount})` : value;
        }),
      })),
    );
    setSeries(
      series.map((ser) => ({
        id: ser.field,
        label: ser.headerName || ser.field,
        data: rows.map((r) => getRowValue(r.model, ser, apiRef)),
      })),
    );
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

        // if the target is another section, remove the field from the origin section
        if (targetSection !== originSection) {
          method(currentItems.filter((item) => item !== field));
        }
        // otherwise, continue to add the field at the tagetted position
      }

      if (targetSection) {
        const method = targetSection === 'categories' ? updateCategories : updateSeries;
        const currentItems = targetSection === 'categories' ? categories : series;
        const remainingItems =
          targetSection === originSection
            ? currentItems.filter((item) => item !== field)
            : currentItems;

        if (targetField) {
          const targetFieldIndex = remainingItems.findIndex((item) => item === targetField);
          const targetIndex =
            placementRelativeToTargetField === 'top' ? targetFieldIndex : targetFieldIndex + 1;
          remainingItems.splice(targetIndex, 0, field);
          method(remainingItems);
        } else {
          method([...remainingItems, field]);
        }
      }
    },
    [apiRef, updateCategories, updateSeries],
  );

  useGridApiMethod(apiRef, { chartsIntegration: { updateDataReference } }, 'private');

  useGridEvent(apiRef, 'columnsChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'sortedRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
};
