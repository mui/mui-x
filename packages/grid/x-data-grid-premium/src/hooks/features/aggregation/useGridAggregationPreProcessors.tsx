import * as React from 'react';
import MuiDivider, { DividerProps } from '@mui/material/Divider';
import { gridColumnLookupSelector, insertItemsInColumnMenu } from '@mui/x-data-grid-pro';
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
  wrapColumnWithAggregationValue,
  unwrapColumnFromAggregation,
} from './wrapColumnWithAggregation';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationColumnMenuItem } from '../../../components/GridAggregationColumnMenuItem';
import { GridAggregationColumnMenuSimpleItem } from '../../../components/GridAggregationColumnMenuSimpleItem';
import { gridAggregationModelSelector } from './gridAggregationSelectors';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';

const Divider = (props: DividerProps) => (
  <MuiDivider {...props} onClick={(event) => event.stopPropagation()} />
);

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'aggregationFunctions' | 'disableAggregation' | 'getAggregationPosition' | 'componentsProps'
  >,
) => {
  const updateAggregatedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const { rulesOnLastColumnHydration } = apiRef.current.unstable_caches.aggregation;

      const aggregationRules = props.disableAggregation
        ? {}
        : getAggregationRules({
            columnsLookup: columnsState.lookup,
            aggregationModel: gridAggregationModelSelector(apiRef),
            aggregationFunctions: props.aggregationFunctions,
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
    [apiRef, props.aggregationFunctions, props.disableAggregation],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (value) => {
      const aggregationRules = props.disableAggregation
        ? {}
        : getAggregationRules({
            columnsLookup: gridColumnLookupSelector(apiRef),
            aggregationModel: gridAggregationModelSelector(apiRef),
            aggregationFunctions: props.aggregationFunctions,
          });

      const hasAggregationRule = Object.keys(aggregationRules).length > 0;

      // If we did not have any aggregation footer before, and we still don't have any,
      // Then we can skip this step
      if (
        Object.keys(apiRef.current.unstable_caches.aggregation.rulesOnLastRowHydration).length ===
          0 &&
        !hasAggregationRule
      ) {
        return value;
      }

      apiRef.current.unstable_caches.aggregation.rulesOnLastRowHydration = aggregationRules;

      return addFooterRows({
        apiRef,
        groupingParams: value,
        getAggregationPosition: props.getAggregationPosition,
        hasAggregationRule,
      });
    },
    [apiRef, props.disableAggregation, props.getAggregationPosition, props.aggregationFunctions],
  );

  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, column) => {
      if (props.disableAggregation) {
        return columnMenuItems;
      }

      const availableAggregationFunctions = getAvailableAggregationFunctions({
        aggregationFunctions: props.aggregationFunctions,
        column,
      });

      if (availableAggregationFunctions.length === 0) {
        return columnMenuItems;
      }

      const aggregationItemProps = {
        column,
        label: apiRef.current.getLocaleText('aggregationMenuItemHeader'),
        availableAggregationFunctions,
      };

      const item = columnMenuItems.some(({ displayName }) =>
        displayName?.includes('GridFilterMenuSimple'),
      )
        ? {
            displayName: 'GridAggregationColumnMenuSimpleItem',
            component: <GridAggregationColumnMenuSimpleItem {...aggregationItemProps} />,
          }
        : {
            displayName: 'GridAggregationColumnMenuItem',
            component: <GridAggregationColumnMenuItem {...aggregationItemProps} />,
          };

      const nodesToInsert = [{ displayName: 'divider', component: <Divider /> }, item];

      return insertItemsInColumnMenu(columnMenuItems, nodesToInsert, 'GridFilterMenuItem');
    },
    [apiRef, props.aggregationFunctions, props.disableAggregation],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      if (props.disableAggregation) {
        return prevState;
      }

      const aggregationModelToExport = gridAggregationModelSelector(apiRef);

      if (Object.values(aggregationModelToExport).length === 0) {
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
