import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { GridPreferencePanelsValue } from '@mui/x-data-grid';
import { GridPreProcessor, useGridRegisterPreProcessor } from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  getAvailableAggregationFunctions,
  wrapColumnWithAggregation,
  unwrapColumnFromAggregation,
  sanitizeAggregationModel,
  addFooterRows,
} from './gridAggregationUtils';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridAggregationColumnMenuItems } from '../../../components/GridAggregationColumnMenuItems';
import { GridAggregationPanel } from '../../../components/GridAggregationPanel';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'aggregationFunctions' | 'aggregationPosition' | 'isGroupAggregated' | 'disableAggregation'
  >,
) => {
  const aggregationPositionRef = React.useRef(props.aggregationPosition);
  aggregationPositionRef.current = props.aggregationPosition;

  const updateAggregatedColumns = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (props.disableAggregation) {
        return columnsState;
      }

      // We can't use `gridAggregationSanitizedModelSelector` here because the new columns are not in the state yet
      const aggregationModel = sanitizeAggregationModel(
        gridAggregationModelSelector(apiRef),
        columnsState.lookup,
      );

      const lastAggregationModelApplied =
        apiRef.current.unstable_getCache('aggregation')?.sanitizedModelOnLastHydration ?? {};

      columnsState.all.forEach((field) => {
        const shouldHaveAggregation = !props.disableAggregation && !!aggregationModel[field];
        const haveAggregationColumn = !!lastAggregationModelApplied[field];

        if (!shouldHaveAggregation && haveAggregationColumn) {
          columnsState.lookup[field] = unwrapColumnFromAggregation({
            colDef: columnsState.lookup[field],
          });
        } else if (shouldHaveAggregation) {
          const colDef = unwrapColumnFromAggregation({
            colDef: columnsState.lookup[field],
          });

          columnsState.lookup[field] = wrapColumnWithAggregation({
            colDef,
            aggregationItem: aggregationModel[field],
            apiRef,
            aggregationFunctions: props.aggregationFunctions,
            aggregationPositionRef,
            isGroupAggregated: props.isGroupAggregated,
          });
        }
      });

      apiRef.current.unstable_setCache('aggregation', {
        sanitizedModelOnLastHydration: aggregationModel,
      });

      return columnsState;
    },
    [apiRef, props.aggregationFunctions, props.disableAggregation, aggregationPositionRef],
  );

  const addGroupFooterRows = React.useCallback<GridPreProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (props.disableAggregation || props.aggregationPosition === 'inline') {
        return groupingParams;
      }

      return addFooterRows({ groupingParams, isGroupAggregated: props.isGroupAggregated });
    },
    [props.aggregationPosition, props.disableAggregation, props.isGroupAggregated],
  );

  const addColumnMenuButtons = React.useCallback<GridPreProcessor<'columnMenu'>>(
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

  const preferencePanelPreProcessing = React.useCallback<GridPreProcessor<'preferencePanel'>>(
    (initialValue, value) => {
      if (value === GridPreferencePanelsValue.aggregation) {
        return <GridAggregationPanel />;
      }

      return initialValue;
    },
    [],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateAggregatedColumns);
  useGridRegisterPreProcessor(apiRef, 'hydrateRows', addGroupFooterRows);
  useGridRegisterPreProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPreProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);
};
