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
  hasAggregationRulesChanged,
} from './gridAggregationUtils';
import { createAggregationLookup } from './createAggregationLookup';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'private_aggregationModel' | 'initialState'>,
  GridApiPremium
> = (state, props, apiRef) => {
  apiRef.current.unstable_caches.aggregation = {
    rulesOnLastColumnHydration: {},
    rulesOnLastRowHydration: {},
  };

  return {
    ...state,
    private_aggregation: {
      model: props.private_aggregationModel ?? props.initialState?.private_aggregation?.model ?? {},
    },
  };
};

export const useGridAggregation = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'private_onAggregationModelChange'
    | 'initialState'
    | 'private_aggregationModel'
    | 'private_getAggregationPosition'
    | 'private_aggregationFunctions'
    | 'private_aggregationRowsScope'
    | 'private_disableAggregation'
    | 'rowGroupingColumnMode'
  >,
) => {
  apiRef.current.unstable_registerControlState({
    stateId: 'aggregation',
    propModel: props.private_aggregationModel,
    propOnChange: props.private_onAggregationModelChange,
    stateSelector: gridAggregationModelSelector,
    changeEvent: 'aggregationModelChange',
  });

  /**
   * API METHODS
   */
  const setAggregationModel = React.useCallback<GridAggregationApi['private_setAggregationModel']>(
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
      getAggregationPosition: props.private_getAggregationPosition,
      aggregationFunctions: props.private_aggregationFunctions,
      aggregationRowsScope: props.private_aggregationRowsScope,
    });

    apiRef.current.setState((state) => ({
      ...state,
      private_aggregation: { ...state.private_aggregation, lookup: aggregationLookup },
    }));
  }, [
    apiRef,
    props.private_getAggregationPosition,
    props.private_aggregationFunctions,
    props.private_aggregationRowsScope,
  ]);

  const aggregationApi: GridAggregationApi = {
    private_setAggregationModel: setAggregationModel,
  };

  useGridApiMethod(apiRef, aggregationApi, 'GridAggregationApi');

  /**
   * EVENTS
   */
  const checkAggregationRulesDiff = React.useCallback(() => {
    const { rulesOnLastRowHydration, rulesOnLastColumnHydration } =
      apiRef.current.unstable_caches.aggregation;

    const aggregationRules = props.private_disableAggregation
      ? {}
      : getAggregationRules({
          columnsLookup: gridColumnLookupSelector(apiRef),
          aggregationModel: gridAggregationModelSelector(apiRef),
          aggregationFunctions: props.private_aggregationFunctions,
        });

    // Re-apply the row hydration to add / remove the aggregation footers
    if (hasAggregationRulesChanged(rulesOnLastRowHydration, aggregationRules)) {
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');
      applyAggregation();
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (hasAggregationRulesChanged(rulesOnLastColumnHydration, aggregationRules)) {
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [
    apiRef,
    applyAggregation,
    props.private_aggregationFunctions,
    props.private_disableAggregation,
  ]);

  useGridApiEventHandler(apiRef, 'aggregationModelChange', checkAggregationRulesDiff);
  useGridApiEventHandler(apiRef, 'columnsChange', checkAggregationRulesDiff);
  useGridApiEventHandler(apiRef, 'filteredRowsSet', applyAggregation);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.private_aggregationModel !== undefined) {
      apiRef.current.private_setAggregationModel(props.private_aggregationModel);
    }
  }, [apiRef, props.private_aggregationModel]);
};
