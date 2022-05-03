import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  getAvailableAggregationFunctions,
  addFooterRows,
  getAggregationRules,
} from './gridAggregationUtils';
import {
  wrapColumnWithAggregation,
  unwrapColumnFromAggregation,
} from './wrapColumnWithAggregation';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationColumnMenuItems } from '../../../components/GridAggregationColumnMenuItems';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

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
        apiRef.current.unstable_getCache('aggregation')?.aggregationRulesOnLastColumnHydration ??
        {};

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

      apiRef.current.unstable_setCache('aggregation', (prev) => ({
        ...prev,
        aggregationRulesOnLastColumnHydration: aggregationRules,
      }));

      return columnsState;
    },
    [apiRef, props.aggregationFunctions, props.disableAggregation, props.isGroupAggregated],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (props.disableAggregation) {
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

      apiRef.current.unstable_setCache('aggregation', (prev) => ({
        ...prev,
        aggregationRulesOnLastRowHydration: aggregationRules,
      }));

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

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateAggregatedColumns);
  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addGroupFooterRows);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
};
