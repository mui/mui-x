'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  gridColumnLookupSelector,
  useGridEvent,
  useGridApiMethod,
  useRunOncePerLoop,
  gridRenderContextSelector,
  gridVisibleColumnFieldsSelector,
  gridSortModelSelector,
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  GridStateInitializer,
  GridPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
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
  const applyAggregation = React.useCallback(
    (reason?: 'filter' | 'sort') => {
      // Abort previous if any
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
      const needsSorting = shouldApplySorting(aggregationRules, aggregatedFields);
      if (reason === 'sort' && !needsSorting) {
        // no need to re-apply aggregation on `sortedRowsSet` if sorting is not needed
        return;
      }

      const renderContext = gridRenderContextSelector(apiRef);
      const visibleColumns = gridVisibleColumnFieldsSelector(apiRef);

      const chunks: string[][] = [];
      const visibleAggregatedFields = visibleColumns
        .slice(renderContext.firstColumnIndex, renderContext.lastColumnIndex + 1)
        .filter((field) => aggregatedFields.includes(field));
      if (visibleAggregatedFields.length > 0) {
        chunks.push(visibleAggregatedFields);
      }
      const otherAggregatedFields = aggregatedFields.filter(
        (field) => !visibleAggregatedFields.includes(field),
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
          const sortModel = gridSortModelSelector(apiRef).map((s) => s.field);
          const hasAggregatedSorting = sortModel.some((field) => aggregationRules[field]);
          if (hasAggregatedSorting) {
            apiRef.current.applySorting();
          }
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

        chunkIndex += 1;

        if (performance.now() - chunkStartTime < timeLimit) {
          return processChunk();
        }

        setTimeout(() => {
          chunkStartTime = performance.now();
          processChunk();
        }, 0);
      };

      processChunk();
    },
    [
      apiRef,
      props.getAggregationPosition,
      props.aggregationFunctions,
      props.aggregationRowsScope,
      props.dataSource,
    ],
  );

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const deferredApplyAggregation = useRunOncePerLoop(applyAggregation);

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
          !!props.dataSource,
        );

    // Re-apply the row hydration to add / remove the aggregation footers
    if (!props.dataSource && !areAggregationRulesEqual(rulesOnLastRowHydration, aggregationRules)) {
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
  useGridEvent(apiRef, 'sortedRowsSet', () => deferredApplyAggregation('sort'));

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.aggregationModel !== undefined) {
      apiRef.current.setAggregationModel(props.aggregationModel);
    }
  }, [apiRef, props.aggregationModel]);
};
