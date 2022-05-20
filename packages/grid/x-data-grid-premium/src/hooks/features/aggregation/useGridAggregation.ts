import * as React from 'react';
import {
  gridColumnLookupSelector,
  useGridApiEventHandler,
  useGridApiMethod,
} from '@mui/x-data-grid-pro';
import { GridStateInitializer, isDeepEqual } from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridAggregationApi } from './gridAggregationInterfaces';
import {
  getAggregationRules,
  mergeStateWithAggregationModel,
  hasAggregationRulesChanged,
  getAggregationFooterLabelColumns,
} from './gridAggregationUtils';
import { createAggregationLookup } from './createAggregationLookup';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'aggregationModel' | 'initialState'>,
  GridApiPremium
> = (state, props, apiRef) => {
  apiRef.current.unstable_caches.aggregation = {
    rulesOnLastColumnHydration: {},
    rulesOnLastRowHydration: {},
    footerLabelColumnOnLastColumnHydration: [],
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
    | 'isGroupAggregated'
    | 'aggregationFunctions'
    | 'aggregatedRows'
    | 'aggregationFooterLabel'
    | 'disableAggregation'
    | 'rowGroupingColumnMode'
    | 'aggregationFooterLabelField'
  >,
) => {
  apiRef.current.unstable_updateControlState({
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
      isGroupAggregated: props.isGroupAggregated,
      aggregationFunctions: props.aggregationFunctions,
      aggregatedRows: props.aggregatedRows,
    });

    apiRef.current.setState((state) => ({
      ...state,
      aggregation: { ...state.aggregation, lookup: aggregationLookup },
    }));
  }, [apiRef, props.isGroupAggregated, props.aggregationFunctions, props.aggregatedRows]);

  const aggregationApi: GridAggregationApi = {
    setAggregationModel,
  };

  useGridApiMethod(apiRef, aggregationApi, 'GridAggregationApi');

  /**
   * EVENTS
   */
  const checkAggregationRulesDiff = React.useCallback(() => {
    const {
      rulesOnLastRowHydration,
      rulesOnLastColumnHydration,
      footerLabelColumnOnLastColumnHydration,
    } = apiRef.current.unstable_caches.aggregation;

    const aggregationRules = getAggregationRules({
      columnsLookup: gridColumnLookupSelector(apiRef),
      aggregationModel: gridAggregationModelSelector(apiRef),
      aggregationFunctions: props.aggregationFunctions,
    });

    const footerLabelColumns = getAggregationFooterLabelColumns({
      apiRef,
      columnsLookup: gridColumnLookupSelector(apiRef),
      aggregationFooterLabelField: props.aggregationFooterLabelField,
    });

    // Re-apply the row hydration to add / remove the aggregation footers
    if (hasAggregationRulesChanged(rulesOnLastRowHydration, aggregationRules)) {
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateRows');
      applyAggregation();
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (
      hasAggregationRulesChanged(rulesOnLastColumnHydration, aggregationRules) ||
      !isDeepEqual(footerLabelColumnOnLastColumnHydration, footerLabelColumns)
    ) {
      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [apiRef, applyAggregation, props.aggregationFunctions, props.aggregationFooterLabelField]);

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
