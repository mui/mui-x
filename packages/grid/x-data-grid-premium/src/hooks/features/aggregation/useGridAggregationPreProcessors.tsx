import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { gridColumnLookupSelector, GridPreferencePanelsValue } from '@mui/x-data-grid-pro';
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
import { GridAggregationPanel } from '../../../components/GridAggregationPanel';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'aggregationFunctions' | 'aggregationPosition' | 'isGroupAggregated' | 'disableAggregation'
  >,
) => {
  const aggregationPositionRef = React.useRef(props.aggregationPosition);
  aggregationPositionRef.current = props.aggregationPosition;

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
            aggregationRule: aggregationRules[field],
            apiRef,
            aggregationPositionRef,
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
    [
      apiRef,
      props.aggregationFunctions,
      props.disableAggregation,
      props.isGroupAggregated,
      aggregationPositionRef,
    ],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (props.disableAggregation || props.aggregationPosition === 'inline') {
        return groupingParams;
      }

      const aggregationRules = getAggregationRules({
        columnsLookup: gridColumnLookupSelector(apiRef),
        aggregationModel: gridAggregationModelSelector(apiRef),
        aggregationFunctions: props.aggregationFunctions,
      });

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
    [
      apiRef,
      props.aggregationPosition,
      props.disableAggregation,
      props.isGroupAggregated,
      props.aggregationFunctions,
    ],
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

  const preferencePanelPreProcessing = React.useCallback<GridPipeProcessor<'preferencePanel'>>(
    (initialValue, value) => {
      if (value === GridPreferencePanelsValue.aggregation) {
        return <GridAggregationPanel />;
      }

      return initialValue;
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateAggregatedColumns);
  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addGroupFooterRows);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
};
