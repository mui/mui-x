import * as React from 'react';
import {
  gridColumnLookupSelector,
  useGridApiEventHandler,
  useGridApiMethod,
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  GridStateInitializer,
  GridPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridAggregationApi, GridAggregationPrivateApi } from './gridAggregationInterfaces';
import {
  getAggregationRules,
  mergeStateWithAggregationModel,
  areAggregationRulesEqual,
} from './gridAggregationUtils';
import { createAggregationLookup } from './createAggregationLookup';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'aggregationModel' | 'initialState'>,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  apiRef.current.caches.aggregation = {
    rulesOnLastColumnHydration: {},
    rulesOnLastRowHydration: {},
  };

  return {
    ...state,
    aggregation: {
      model: props.aggregationModel ?? props.initialState?.aggregation?.model ?? {},
    },
  };
};

export const useGridAggregation = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'onAggregationModelChange'
    | 'initialState'
    | 'aggregationModel'
    | 'getAggregationPosition'
    | 'aggregationFunctions'
    | 'aggregationRowsScope'
    | 'disableAggregation'
    | 'rowGroupingColumnMode'
    | 'unstable_dataSource'
  >,
) => {
  apiRef.current.registerControlState({
    stateId: 'aggregation',
    propModel: props.aggregationModel,
    propOnChange: props.onAggregationModelChange,
    stateSelector: gridAggregationModelSelector,
    changeEvent: 'aggregationModelChange',
  });

  /**
   * API METHODS
   */
  const setAggregationModel = React.useCallback<GridAggregationApi['setAggregationModel']>(
    (model) => {
      const currentModel = gridAggregationModelSelector(apiRef);
      if (currentModel !== model) {
        apiRef.current.setState(mergeStateWithAggregationModel(model));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef],
  );

  const applyAggregation = React.useCallback(() => {
    const aggregationLookup = createAggregationLookup({
      apiRef,
      getAggregationPosition: props.getAggregationPosition,
      aggregationFunctions: props.aggregationFunctions,
      aggregationRowsScope: props.aggregationRowsScope,
      isDataSource: !!props.unstable_dataSource,
    });

    apiRef.current.setState((state) => ({
      ...state,
      aggregation: { ...state.aggregation, lookup: aggregationLookup },
    }));
  }, [
    apiRef,
    props.getAggregationPosition,
    props.aggregationFunctions,
    props.aggregationRowsScope,
    props.unstable_dataSource,
  ]);

  const aggregationApi: GridAggregationApi = {
    setAggregationModel,
  };

  const aggregationPrivateApi: GridAggregationPrivateApi = {
    applyAggregation,
  };

  useGridApiMethod(apiRef, aggregationApi, 'public');
  useGridApiMethod(apiRef, aggregationPrivateApi, 'private');

  const addGetRowsParams = React.useCallback<GridPipeProcessor<'getRowsParams'>>(
    (params) => {
      return {
        ...params,
        aggregationModel: gridAggregationModelSelector(apiRef),
      };
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'getRowsParams', addGetRowsParams);

  /**
   * EVENTS
   */
  const checkAggregationRulesDiff = React.useCallback(() => {
    const { rulesOnLastRowHydration, rulesOnLastColumnHydration } =
      apiRef.current.caches.aggregation;

    const aggregationRules = props.disableAggregation
      ? {}
      : getAggregationRules(
          gridColumnLookupSelector(apiRef),
          gridAggregationModelSelector(apiRef),
          props.aggregationFunctions,
          !!props.unstable_dataSource,
        );

    // Re-apply the row hydration to add / remove the aggregation footers
    if (!areAggregationRulesEqual(rulesOnLastRowHydration, aggregationRules)) {
      if (props.unstable_dataSource) {
        apiRef.current.unstable_dataSource.fetchRows();
      } else {
        apiRef.current.requestPipeProcessorsApplication('hydrateRows');
        applyAggregation();
      }
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (!areAggregationRulesEqual(rulesOnLastColumnHydration, aggregationRules)) {
      apiRef.current.caches.aggregation.rulesOnLastColumnHydration = aggregationRules;
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [
    apiRef,
    applyAggregation,
    props.aggregationFunctions,
    props.disableAggregation,
    props.unstable_dataSource,
  ]);

  useGridApiEventHandler(apiRef, 'aggregationModelChange', checkAggregationRulesDiff);
  useGridApiEventHandler(apiRef, 'columnsChange', checkAggregationRulesDiff);
  useGridApiEventHandler(apiRef, 'filteredRowsSet', applyAggregation);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(props.aggregationModel);
    }
  }, [apiRef, props.aggregationModel]);
};
