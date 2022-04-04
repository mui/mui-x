import * as React from 'react';
import {
  GridEventListener,
  GridEvents,
  useGridApiEventHandler,
  useGridApiMethod,
} from '@mui/x-data-grid-pro';
import { GridStateInitializer, isDeepEqual } from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  gridAggregationModelSelector,
  gridAggregationSanitizedModelSelector,
} from './gridAggregationSelectors';
import { GridAggregationApi } from './gridAggregationInterfaces';
import { mergeStateWithAggregationModel } from './gridAggregationUtils';
import { createAggregationLookup } from './createAggregationLookup';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'aggregationModel' | 'initialState'>,
  GridApiPremium
> = (state, props) => ({
  ...state,
  aggregation: {
    model: props.aggregationModel ?? props.initialState?.aggregation?.model ?? {},
  },
});

export const useGridAggregation = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'onAggregationModelChange'
    | 'initialState'
    | 'aggregationModel'
    | 'isGroupAggregated'
    | 'aggregationPosition'
    | 'aggregationFunctions'
    | 'aggregatedRows'
  >,
) => {
  apiRef.current.unstable_updateControlState({
    stateId: 'aggregation',
    propModel: props.aggregationModel,
    propOnChange: props.onAggregationModelChange,
    stateSelector: gridAggregationModelSelector,
    changeEvent: GridEvents.aggregationModelChange,
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

  const aggregationPositionRef = React.useRef(props.aggregationPosition);
  aggregationPositionRef.current = props.aggregationPosition;
  const applyAggregation = React.useCallback(() => {
    const aggregationLookup = createAggregationLookup({
      apiRef,
      aggregationPositionRef,
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
  const checkAggregationModelDiff = React.useCallback<
    GridEventListener<GridEvents.columnsChange>
  >(() => {
    const aggregationModel = gridAggregationSanitizedModelSelector(apiRef);
    const lastAggregationModelApplied =
      apiRef.current.unstable_getCache('aggregation')?.sanitizedModelOnLastHydration;

    if (!isDeepEqual(lastAggregationModelApplied, aggregationModel)) {
      applyAggregation();
      // Refresh the column pre-processing
      // TODO: Add a clean way to re-run a pipe processing without faking a change
      apiRef.current.updateColumns([]);
    }
  }, [apiRef, applyAggregation]);

  useGridApiEventHandler(apiRef, GridEvents.aggregationModelChange, checkAggregationModelDiff);
  useGridApiEventHandler(apiRef, GridEvents.filteredRowsSet, applyAggregation);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(props.aggregationModel);
    }
  }, [apiRef, props.aggregationModel]);
};
