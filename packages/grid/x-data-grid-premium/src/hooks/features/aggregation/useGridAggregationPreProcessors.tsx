import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import {
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  getAvailableAggregationFunctions,
  addFooterRows,
  getAggregationRules,
  mergeStateWithAggregationModel,
} from './gridAggregationUtils';
import {
  wrapColumnWithAggregation,
  unwrapColumnFromAggregation,
} from './wrapColumnWithAggregation';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationColumnMenuItems } from '../../../components/GridAggregationColumnMenuItems';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'aggregationFunctions' | 'isGroupAggregated' | 'disableAggregation'
  >,
) => {
  const updateAggregatedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const lastAppliedAggregationRules =
        apiRef.current.unstable_caches.aggregation?.aggregationRulesOnLastColumnHydration ?? {};

      const aggregationRules = getAggregationRules({
        columnsLookup: columnsState.lookup,
        aggregationModel: gridAggregationModelSelector(apiRef),
        aggregationFunctions: props.aggregationFunctions,
      });

      columnsState.all.forEach((field) => {
        const shouldHaveAggregation = !props.disableAggregation && !!aggregationRules[field];
        const haveAggregationColumn = !!lastAppliedAggregationRules[field];
        let column = columnsState.lookup[field];

        if (haveAggregationColumn) {
          column = unwrapColumnFromAggregation({
            column,
          });
        }

        if (shouldHaveAggregation) {
          column = wrapColumnWithAggregation({
            column,
            columnAggregationRules: aggregationRules[field],
            apiRef,
            isGroupAggregated: props.isGroupAggregated,
          });
        }

        columnsState.lookup[field] = column;
      });

      apiRef.current.unstable_caches.aggregation = {
        ...apiRef.current.unstable_caches.aggregation,
        aggregationRulesOnLastColumnHydration: aggregationRules,
      };

      return columnsState;
    },
    [apiRef, props.aggregationFunctions, props.disableAggregation, props.isGroupAggregated],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (props.disableAggregation) {
        apiRef.current.unstable_caches.aggregation = {
          ...apiRef.current.unstable_caches.aggregation,
          aggregationRulesOnLastRowHydration: {},
        };

        return groupingParams;
      }

      const aggregationRules = getAggregationRules({
        columnsLookup: gridColumnLookupSelector(apiRef),
        aggregationModel: gridAggregationModelSelector(apiRef),
        aggregationFunctions: props.aggregationFunctions,
      });

      // If no column have a footer aggregation rule
      // Then don't create the footer rows
      if (
        Object.values(aggregationRules).every(
          (columnAggregationRules) => !columnAggregationRules.footer,
        )
      ) {
        return groupingParams;
      }

      const groupingParamsWithFooterRows = addFooterRows({
        groupingParams,
        aggregationRules,
        isGroupAggregated: props.isGroupAggregated,
      });

      apiRef.current.unstable_caches.aggregation = {
        ...apiRef.current.unstable_caches.aggregation,
        aggregationRulesOnLastRowHydration: aggregationRules,
      };

      return groupingParamsWithFooterRows;
    },
    [apiRef, props.disableAggregation, props.isGroupAggregated, props.aggregationFunctions],
  );

  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (initialValue, column) => {
      if (props.disableAggregation) {
        return initialValue;
      }

      const availableAggregationFunction = getAvailableAggregationFunctions({
        aggregationFunctions: props.aggregationFunctions,
        column,
      });
      if (availableAggregationFunction.length === 0) {
        return initialValue;
      }

      return [...initialValue, <Divider />, <GridAggregationColumnMenuItems />];
    },
    [props.aggregationFunctions, props.disableAggregation],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      if (props.disableAggregation) {
        return prevState;
      }

      const aggregationModelToExport = gridAggregationModelSelector(apiRef);
      const isModelEmpty = Object.values(aggregationModelToExport).every((item) => {
        if (item == null) {
          return true;
        }

        if (typeof item === 'string') {
          return false;
        }

        return item.inline == null && item.footer == null;
      });

      if (isModelEmpty) {
        return prevState;
      }

      return {
        ...prevState,
        aggregation: {
          model: aggregationModelToExport,
        },
      };
    },
    [apiRef, props.disableAggregation],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      if (props.disableAggregation) {
        return params;
      }

      const aggregationModel = context.stateToRestore.aggregation?.model;
      if (aggregationModel != null) {
        apiRef.current.setState(mergeStateWithAggregationModel(aggregationModel));
      }
      return params;
    },
    [apiRef, props.disableAggregation],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateAggregatedColumns);
  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addGroupFooterRows);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
};
