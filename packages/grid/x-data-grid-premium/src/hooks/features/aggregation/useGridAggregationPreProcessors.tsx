import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import {
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridRowTreeCreationValue,
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
  wrapColumnWithAggregationValue,
  unwrapColumnFromAggregation,
} from './wrapColumnWithAggregation';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationColumnMenuItem } from '../../../components/GridAggregationColumnMenuItem';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import { GridAggregationRules } from './gridAggregationInterfaces';

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'private_aggregationFunctions' | 'private_disableAggregation' | 'private_getAggregationPosition'
  >,
) => {
  const updateAggregatedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const { rulesOnLastColumnHydration } = apiRef.current.unstable_caches.aggregation;

      const aggregationRules = props.private_disableAggregation
        ? {}
        : getAggregationRules({
            columnsLookup: columnsState.lookup,
            aggregationModel: gridAggregationModelSelector(apiRef),
            aggregationFunctions: props.private_aggregationFunctions,
          });

      columnsState.all.forEach((field) => {
        const shouldHaveAggregationValue = !!aggregationRules[field];
        const haveAggregationColumnValue = !!rulesOnLastColumnHydration[field];

        let column = columnsState.lookup[field];

        if (haveAggregationColumnValue) {
          column = unwrapColumnFromAggregation({
            column,
          });
        }

        if (shouldHaveAggregationValue) {
          column = wrapColumnWithAggregationValue({
            column,
            aggregationRule: aggregationRules[field],
            apiRef,
          });
        }

        columnsState.lookup[field] = column;
      });

      apiRef.current.unstable_caches.aggregation.rulesOnLastColumnHydration = aggregationRules;

      return columnsState;
    },
    [apiRef, props.private_aggregationFunctions, props.private_disableAggregation],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      let newGroupingParams: GridRowTreeCreationValue;
      let rulesOnLastRowHydration: GridAggregationRules;

      if (props.private_disableAggregation) {
        newGroupingParams = groupingParams;
        rulesOnLastRowHydration = {};
      } else {
        const aggregationRules = getAggregationRules({
          columnsLookup: gridColumnLookupSelector(apiRef),
          aggregationModel: gridAggregationModelSelector(apiRef),
          aggregationFunctions: props.private_aggregationFunctions,
        });

        rulesOnLastRowHydration = aggregationRules;

        // If no column have an aggregation rule
        // Then don't create the footer rows
        if (Object.values(aggregationRules).length === 0) {
          newGroupingParams = groupingParams;
        } else {
          newGroupingParams = addFooterRows({
            groupingParams,
            aggregationRules,
            getAggregationPosition: props.private_getAggregationPosition,
            apiRef,
          });
        }
      }

      apiRef.current.unstable_caches.aggregation.rulesOnLastRowHydration = rulesOnLastRowHydration;

      return newGroupingParams;
    },
    [
      apiRef,
      props.private_disableAggregation,
      props.private_getAggregationPosition,
      props.private_aggregationFunctions,
    ],
  );

  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (initialValue, column) => {
      if (props.private_disableAggregation) {
        return initialValue;
      }

      const availableAggregationFunctions = getAvailableAggregationFunctions({
        aggregationFunctions: props.private_aggregationFunctions,
        column,
      });

      if (availableAggregationFunctions.length === 0) {
        return initialValue;
      }

      return [
        ...initialValue,
        <Divider />,
        <GridAggregationColumnMenuItem
          column={column}
          label={apiRef.current.getLocaleText('aggregationMenuItemHeader')}
          availableAggregationFunctions={availableAggregationFunctions}
        />,
      ];
    },
    [apiRef, props.private_aggregationFunctions, props.private_disableAggregation],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      if (props.private_disableAggregation) {
        return prevState;
      }

      const aggregationModelToExport = gridAggregationModelSelector(apiRef);

      if (Object.values(aggregationModelToExport).length === 0) {
        return prevState;
      }

      return {
        ...prevState,
        private_aggregation: {
          model: aggregationModelToExport,
        },
      };
    },
    [apiRef, props.private_disableAggregation],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      if (props.private_disableAggregation) {
        return params;
      }

      const aggregationModel = context.stateToRestore.private_aggregation?.model;
      if (aggregationModel != null) {
        apiRef.current.setState(mergeStateWithAggregationModel(aggregationModel));
      }
      return params;
    },
    [apiRef, props.private_disableAggregation],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateAggregatedColumns);
  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addGroupFooterRows);
  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
};
