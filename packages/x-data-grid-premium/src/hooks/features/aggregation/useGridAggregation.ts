'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { isObjectEmpty } from '@mui/x-internals/isObjectEmpty';
import {
  gridColumnLookupSelector,
  useGridEvent,
  useGridApiMethod,
  useRunOncePerLoop,
  gridRenderContextSelector,
  gridVisibleColumnFieldsSelector,
  gridSortModelSelector,
  gridRowMaximumTreeDepthSelector,
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  type GridStateInitializer,
  type GridPipeProcessor,
  gridPivotActiveSelector,
} from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  gridAggregationLookupSelector,
  gridAggregationModelSelector,
} from './gridAggregationSelectors';
import type {
  GridAggregationApi,
  GridAggregationLookup,
  GridAggregationPrivateApi,
} from './gridAggregationInterfaces';
import {
  getAggregationRules,
  mergeStateWithAggregationModel,
  areAggregationRulesEqual,
} from './gridAggregationUtils';
import { createAggregationLookup, shouldApplySorting } from './createAggregationLookup';

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
  apiRef: RefObject<GridPrivateApiPremium>,
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
    | 'dataSource'
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
      }
    },
    [apiRef],
  );

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const applyAggregation = React.useCallback(() => {
    // Abort previous if we're proceeding
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const aggregationRules = getAggregationRules(
      gridColumnLookupSelector(apiRef),
      gridAggregationModelSelector(apiRef),
      props.aggregationFunctions,
      !!props.dataSource,
    );
    const aggregatedFields = Object.keys(aggregationRules);
    const currentAggregationLookup = gridAggregationLookupSelector(apiRef);

    const renderContext = gridRenderContextSelector(apiRef);
    const visibleColumns = gridVisibleColumnFieldsSelector(apiRef);

    const chunks: string[][] = [];
    const sortedAggregatedFields = gridSortModelSelector(apiRef)
      .map((s) => s.field)
      .filter((field) => aggregatedFields.includes(field));
    const visibleAggregatedFields = visibleColumns
      .slice(renderContext.firstColumnIndex, renderContext.lastColumnIndex + 1)
      .filter((field) => aggregatedFields.includes(field));
    const visibleAggregatedFieldsWithSort = [
      ...visibleAggregatedFields,
      ...sortedAggregatedFields.filter((field) => !visibleAggregatedFields.includes(field)),
    ];
    const hasAggregatedSortedField =
      gridRowMaximumTreeDepthSelector(apiRef) > 1 && sortedAggregatedFields.length > 0;

    if (visibleAggregatedFields.length > 0) {
      chunks.push(visibleAggregatedFieldsWithSort);
    }
    const otherAggregatedFields = aggregatedFields.filter(
      (field) => !visibleAggregatedFieldsWithSort.includes(field),
    );

    const chunkSize = 20; // columns per chunk
    for (let i = 0; i < otherAggregatedFields.length; i += chunkSize) {
      chunks.push(otherAggregatedFields.slice(i, i + chunkSize));
    }

    let chunkIndex = 0;
    const aggregationLookup: GridAggregationLookup = {};
    let chunkStartTime = performance.now();
    const timeLimit = 1000 / 120;

    const processChunk = () => {
      if (abortController.signal.aborted) {
        return;
      }

      const currentChunk = chunks[chunkIndex];
      if (!currentChunk) {
        apiRef.current.publishEvent('aggregationLookupSet');
        abortControllerRef.current = null;
        return;
      }

      const applySorting = shouldApplySorting(aggregationRules, currentChunk);

      // createAggregationLookup now RETURNS new partial lookup
      const partialLookup = createAggregationLookup({
        apiRef,
        getAggregationPosition: props.getAggregationPosition,
        aggregatedFields: currentChunk,
        aggregationRules,
        aggregationRowsScope: props.aggregationRowsScope,
        isDataSource: !!props.dataSource,
        applySorting,
      });

      for (const key of Object.keys(partialLookup)) {
        for (const field of Object.keys(partialLookup[key])) {
          aggregationLookup[key] ??= {};
          aggregationLookup[key][field] = partialLookup[key][field];
        }
      }

      apiRef.current.setState((state) => ({
        ...state,
        aggregation: { ...state.aggregation, lookup: { ...aggregationLookup } },
      }));

      if (chunkIndex === 0 && hasAggregatedSortedField) {
        apiRef.current.applySorting();
      }

      chunkIndex += 1;

      if (performance.now() - chunkStartTime < timeLimit) {
        processChunk();
        return;
      }

      setTimeout(() => {
        chunkStartTime = performance.now();
        processChunk();
      }, 0);
    };

    processChunk();

    // processChunk() does nothing if there are no aggregated fields
    // make sure that the lookup is empty in this case
    if (aggregatedFields.length === 0 && !isObjectEmpty(currentAggregationLookup)) {
      apiRef.current.setState((state) => ({
        ...state,
        aggregation: { ...state.aggregation, lookup: {} },
      }));
    }
  }, [
    apiRef,
    props.getAggregationPosition,
    props.aggregationFunctions,
    props.aggregationRowsScope,
    props.dataSource,
  ]);

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const { schedule: deferredApplyAggregation } = useRunOncePerLoop(applyAggregation);

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
    const pivotingActive = gridPivotActiveSelector(apiRef);
    const { rulesOnLastRowHydration, rulesOnLastColumnHydration } =
      apiRef.current.caches.aggregation;

    const aggregationRules = props.disableAggregation
      ? {}
      : getAggregationRules(
          gridColumnLookupSelector(apiRef),
          gridAggregationModelSelector(apiRef),
          props.aggregationFunctions,
          !!props.dataSource,
        );

    // Re-apply the row hydration to add / remove the aggregation footers
    if (
      (!props.dataSource || pivotingActive) &&
      !areAggregationRulesEqual(rulesOnLastRowHydration, aggregationRules)
    ) {
      apiRef.current.requestPipeProcessorsApplication('hydrateRows');
      deferredApplyAggregation();
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (!areAggregationRulesEqual(rulesOnLastColumnHydration, aggregationRules)) {
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [
    apiRef,
    deferredApplyAggregation,
    props.aggregationFunctions,
    props.disableAggregation,
    props.dataSource,
  ]);

  useGridEvent(apiRef, 'aggregationModelChange', checkAggregationRulesDiff);
  useGridEvent(apiRef, 'columnsChange', checkAggregationRulesDiff);
  useGridEvent(apiRef, 'filteredRowsSet', deferredApplyAggregation);

  const lastSortModel = React.useRef(gridSortModelSelector(apiRef));
  useGridEvent(apiRef, 'sortedRowsSet', () => {
    const sortModel = gridSortModelSelector(apiRef);
    if (lastSortModel.current === sortModel) {
      return;
    }
    lastSortModel.current = sortModel;

    const aggregationRules = getAggregationRules(
      gridColumnLookupSelector(apiRef),
      gridAggregationModelSelector(apiRef),
      props.aggregationFunctions,
      !!props.dataSource,
    );
    const aggregatedFields = Object.keys(aggregationRules);
    if (!aggregatedFields.length) {
      return;
    }
    const needsSorting = shouldApplySorting(aggregationRules, aggregatedFields);
    if (!needsSorting) {
      return;
    }

    deferredApplyAggregation();
  });

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(props.aggregationModel);
    }
  }, [apiRef, props.aggregationModel]);

  React.useEffect(() => {
    if (props.getAggregationPosition !== undefined) {
      deferredApplyAggregation();
    }
  }, [deferredApplyAggregation, props.getAggregationPosition]);
};
