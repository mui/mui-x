import * as React from 'react';
import {
  gridColumnLookupSelector,
  useGridApiEventHandler,
  useGridApiMethod,
} from '@mui/x-data-grid-pro';
import { GridStateInitializer } from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridAggregationApi } from './gridAggregationInterfaces';
import {
  getAggregationRules,
  mergeStateWithAggregationModel,
  areAggregationRulesEqual,
} from './gridAggregationUtils';
import { createAggregationLookup } from './createAggregationLookup';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'aggregationModel' | 'initialState'>,
  GridApiPremium
> = (state, props, apiRef) => {
  apiRef.current.unstable_caches.aggregation = {
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
  apiRef: React.MutableRefObject<GridApiPremium>,
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
  >,
) => {
  apiRef.current.unstable_registerControlState({
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
  ]);

  const aggregationApi: GridAggregationApi = {
    setAggregationModel,
  };

  useGridApiMethod(apiRef, aggregationApi, 'GridAggregationApi');

  /**
   * EVENTS
   */
  const checkAggregationRulesDiff = React.useCallback(() => {
    const { rulesOnLastRowHydration, rulesOnLastColumnHydration } =
      apiRef.current.unstable_caches.aggregation;

    const aggregationRules = props.disableAggregation
      ? {}
      : getAggregationRules({
          columnsLookup: gridColumnLookupSelector(apiRef),
          aggregationModel: gridAggregationModelSelector(apiRef),
          aggregationFunctions: props.aggregationFunctions,
        });

    // Re-apply the row hydration to add / remove the aggregation footers
    if (!areAggregationRulesEqual(rulesOnLastRowHydration, aggregationRules)) {
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');
      applyAggregation();
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (!areAggregationRulesEqual(rulesOnLastColumnHydration, aggregationRules)) {
      apiRef.current.unstable_caches.aggregation.rulesOnLastColumnHydration = aggregationRules;
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [apiRef, applyAggregation, props.aggregationFunctions, props.disableAggregation]);

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
