'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
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
  GridStateInitializer,
  GridPipeProcessor,
  gridPivotActiveSelector,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  gridAggregationLookupSelector,
  gridAggregationModelSelector,
} from './gridAggregationSelectors';
import {
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

  const { aggregationModel, initialState } = props;

  return {
    ...state,
    aggregation: {
      model: aggregationModel ?? initialState?.aggregation?.model ?? {},
    },
  };
};

export const useGridAggregation = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'onAggregationModelChange'
    | 'aggregationModel'
    | 'getAggregationPosition'
    | 'aggregationFunctions'
    | 'aggregationRowsScope'
    | 'disableAggregation'
    | 'dataSource'
  >,
) => {
  const {
    onAggregationModelChange,
    aggregationModel,
    getAggregationPosition,
    aggregationFunctions,
    aggregationRowsScope,
    disableAggregation,
    dataSource,
  } = props;
  apiRef.current.registerControlState({
    stateId: 'aggregation',
    propModel: aggregationModel,
    propOnChange: onAggregationModelChange,
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
      aggregationFunctions,
      !!dataSource,
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
        getAggregationPosition,
        aggregatedFields: currentChunk,
        aggregationRules,
        aggregationRowsScope,
        isDataSource: !!dataSource,
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
  }, [apiRef, getAggregationPosition, aggregationFunctions, aggregationRowsScope, dataSource]);

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

    const aggregationRules = disableAggregation
      ? {}
      : getAggregationRules(
          gridColumnLookupSelector(apiRef),
          gridAggregationModelSelector(apiRef),
          aggregationFunctions,
          !!dataSource,
        );

    // Re-apply the row hydration to add / remove the aggregation footers
    if (
      (!dataSource || pivotingActive) &&
      !areAggregationRulesEqual(rulesOnLastRowHydration, aggregationRules)
    ) {
      apiRef.current.requestPipeProcessorsApplication('hydrateRows');
      deferredApplyAggregation();
    }

    // Re-apply the column hydration to wrap / unwrap the aggregated columns
    if (!areAggregationRulesEqual(rulesOnLastColumnHydration, aggregationRules)) {
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }
  }, [apiRef, deferredApplyAggregation, aggregationFunctions, disableAggregation, dataSource]);

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
      aggregationFunctions,
      !!dataSource,
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
    if (aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(aggregationModel);
    }
  }, [apiRef, aggregationModel]);

  React.useEffect(() => {
    if (getAggregationPosition !== undefined) {
      deferredApplyAggregation();
    }
  }, [deferredApplyAggregation, getAggregationPosition]);
};
