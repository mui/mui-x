import * as React from 'react';
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
} from '@mui/x-data-grid-pro/internals';

import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { GridChartsIntegrationContextValue } from '../../../models/gridChartsIntegration';
import {
  GridChartsIntegrationApi,
  GridChartsIntegrationItem,
  GridChartsIntegrationPrivateApi,
  GridChartsIntegrationState,
} from './gridChartsIntegrationInterfaces';
import {
  gridChartsConfigurationPanelOpenSelector,
  gridChartsCategoriesSelector,
  gridChartsSeriesSelector,
} from './gridChartsIntegrationSelectors';
import { COLUMN_GROUP_ID_SEPARATOR } from '../../../constants/columnGroups';
import { useGridChartsIntegrationContext } from '../../utils/useGridChartIntegration';
import { getBlockedSections } from './utils';

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

  const columnsLookup = state.columns?.lookup ?? {};
  const initialCategories = (props.initialState?.chartsIntegration?.categories ?? [])
    .map((category) =>
      typeof category === 'string' ? { field: category, hidden: false } : category,
    )
    .filter(
      (category) =>
        columnsLookup[category.field] &&
        !getBlockedSections(columnsLookup[category.field] as GridColDef).includes('categories'),
    );
  const initialSeries = (props.initialState?.chartsIntegration?.series ?? [])
    .map((seriesItem) =>
      typeof seriesItem === 'string' ? { field: seriesItem, hidden: false } : seriesItem,
    )
    .filter(
      (seriesItem) =>
        columnsLookup[seriesItem.field] &&
        !getBlockedSections(columnsLookup[seriesItem.field] as GridColDef).includes('series') &&
        !initialCategories.some((category) => category.field === seriesItem.field),
    );

  return {
    ...state,
    chartsIntegration: {
      configurationPanel: {
        open:
          props.chartsConfigurationPanelOpen ??
          props.initialState?.chartsIntegration?.configurationPanel?.open ??
          false,
      },
      categories: initialCategories,
      series: initialSeries,
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
  setConfiguration: () => {},
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

  const { setChartType, setCategories, setSeries, setConfiguration } =
    context || EMPTY_CHART_INTEGRATION_CONTEXT;

  const getColumnName = React.useCallback(
    (field: string) => {
      if (props.slotProps?.chartsConfigurationPanel?.getColumnName) {
        return props.slotProps.chartsConfigurationPanel.getColumnName(field);
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
    [apiRef, props.slotProps?.chartsConfigurationPanel],
  );

  apiRef.current.registerControlState({
    stateId: 'chartsConfigurationPanelOpen',
    propModel: props.chartsConfigurationPanelOpen,
    propOnChange: props.onChartsConfigurationPanelOpenChange,
    stateSelector: gridChartsConfigurationPanelOpenSelector,
    changeEvent: 'chartsConfigurationPanelOpenChange',
  });

  const handleDataUpdate = React.useCallback(() => {
    const columns = gridColumnLookupSelector(apiRef);
    const rows = Object.values(gridFilteredSortedTopLevelRowEntriesSelector(apiRef));

    const selectedSeries = gridChartsSeriesSelector(apiRef);
    const selectedCategories = gridChartsCategoriesSelector(apiRef);

    const series: GridChartsIntegrationItem[] = [];
    const categories: GridChartsIntegrationItem[] = [];

    // Sanitize selectedSeries and selectedCategories while maintaining their order
    for (let i = 0; i < selectedSeries.length; i += 1) {
      if (columns[selectedSeries[i].field]) {
        series.push(selectedSeries[i]);
      }
    }

    // categories cannot contain fields that are already in series
    for (let i = 0; i < selectedCategories.length; i += 1) {
      const item = selectedCategories[i];
      if (
        !selectedSeries.some((seriesItem) => seriesItem.field === item.field) &&
        columns[item.field]
      ) {
        categories.push(item);
      }
    }

    if (selectedCategories.length !== categories.length) {
      apiRef.current.updateCategories(categories);
    }

    if (selectedSeries.length !== series.length) {
      apiRef.current.updateSeries(series);
    }

    const visibleCategories = categories
      .filter((category) => category.hidden !== true)
      .map((category) => columns[category.field]);
    const visibleSeries = series
      .filter((seriesItem) => seriesItem.hidden !== true)
      .map((seriesItem) => columns[seriesItem.field]);

    if (visibleCategories.length === 0 || visibleSeries.length === 0) {
      setCategories([]);
      setSeries([]);
      return;
    }

    const dataColumns = [...visibleCategories, ...visibleSeries];
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

    setCategories(
      visibleCategories.map((category) => ({
        id: category.field,
        label: getColumnName(category.field),
        data: data[category.field] || [],
      })),
    );
    setSeries(
      visibleSeries.map((seriesItem) => ({
        id: seriesItem.field,
        label: getColumnName(seriesItem.field),
        data: (data[seriesItem.field] || []) as (number | null)[],
      })),
    );
  }, [apiRef, getColumnName, setCategories, setSeries]);

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

  useEnhancedEffect(() => {
    if (props.chartsConfigurationPanelOpen !== undefined) {
      apiRef.current.setChartsConfigurationPanelOpen(props.chartsConfigurationPanelOpen);
    }
  }, [apiRef, props.chartsConfigurationPanelOpen]);

  const updateCategories = React.useCallback(
    (
      categories:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      apiRef.current.setState((state) => {
        const newCategories =
          typeof categories === 'function'
            ? categories(state.chartsIntegration.categories)
            : categories;
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            categories: newCategories,
          },
        };
      });
      handleDataUpdate();
    },
    [apiRef, handleDataUpdate],
  );

  const updateSeries = React.useCallback(
    (
      series:
        | GridChartsIntegrationItem[]
        | ((prev: GridChartsIntegrationItem[]) => GridChartsIntegrationItem[]),
    ) => {
      apiRef.current.setState((state) => {
        const newSeries =
          typeof series === 'function' ? series(state.chartsIntegration.series) : series;
        return {
          ...state,
          chartsIntegration: {
            ...state.chartsIntegration,
            series: newSeries,
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
          method(currentItems);
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
          method(remainingItems);
        } else {
          method([...remainingItems, { field, hidden }]);
        }
      }
    },
    [apiRef, updateCategories, updateSeries],
  );

  React.useEffect(() => {
    setChartType(props.initialState?.chartsIntegration?.chartType || '');
    setConfiguration(props.initialState?.chartsIntegration?.configuration || {});
  }, [
    props.initialState?.chartsIntegration?.chartType,
    props.initialState?.chartsIntegration?.configuration,
    setChartType,
    setConfiguration,
  ]);

  useGridApiMethod(
    apiRef,
    { chartsIntegration: { updateDataReference, getColumnName } },
    'private',
  );
  useGridApiMethod(
    apiRef,
    { setChartsConfigurationPanelOpen, updateSeries, updateCategories },
    'public',
  );

  useGridEvent(apiRef, 'columnsChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'filteredRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'sortedRowsSet', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'pivotModeChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
  useGridEvent(apiRef, 'pivotModelChange', runIf(isChartsIntegrationAvailable, handleDataUpdate));
};
