import * as React from 'react';
import {
  GridEventListener,
  GridEvents,
  useGridApiEventHandler,
  useGridApiMethod,
} from '@mui/x-data-grid';
import { GridStateInitializer, isDeepEqual } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  gridAggregationModelSelector,
  gridAggregationSanitizedModelSelector,
} from './gridAggregationSelectors';
import { GridAggregationApi } from './gridAggregationInterfaces';
import { mergeStateWithAggregationModel } from './gridAggregationUtils';

export const aggregationStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'aggregationModel' | 'initialState'>,
  GridApiPro
> = (state, props) => ({
  ...state,
  aggregation: {
    model: props.aggregationModel ?? props.initialState?.aggregation?.model ?? {},
  },
});

export const useGridAggregation = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'onAggregationModelChange' | 'initialState' | 'aggregationModel'
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
      console.log('HEY');
      // Refresh the column pre-processing
      // TODO: Add a clean way to re-run a pipe processing without faking a change
      apiRef.current.updateColumns([]);
    }
  }, [apiRef]);

  useGridApiEventHandler(apiRef, GridEvents.aggregationModelChange, checkAggregationModelDiff);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(props.aggregationModel);
    }
  }, [apiRef, props.aggregationModel]);
};
