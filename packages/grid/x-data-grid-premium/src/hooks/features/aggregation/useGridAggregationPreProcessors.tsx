import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import { gridColumnLookupSelector, gridRowTreeDepthSelector } from '@mui/x-data-grid-pro';
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
  getAggregationFooterLabelColumns,
} from './gridAggregationUtils';
import {
  wrapColumnWithAggregationValue,
  unwrapColumnFromAggregation,
  wrapColumnWithAggregationLabel,
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
    | 'aggregationFunctions'
    | 'isGroupAggregated'
    | 'disableAggregation'
    | 'aggregationFooterLabelField'
    | 'rowGroupingColumnMode'
  >,
) => {
  const updateAggregatedColumns = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const { rulesOnLastColumnHydration, footerLabelColumnOnLastColumnHydration } =
        apiRef.current.unstable_caches.aggregation;

      const aggregationRules = getAggregationRules({
        columnsLookup: columnsState.lookup,
        aggregationModel: gridAggregationModelSelector(apiRef),
        aggregationFunctions: props.aggregationFunctions,
      });

      const footerLabelColumns = getAggregationFooterLabelColumns({
        apiRef,
        columnsLookup: columnsState.lookup,
        aggregationFooterLabelField: props.aggregationFooterLabelField,
      });

      columnsState.all.forEach((field) => {
        const shouldHaveAggregationValue = !props.disableAggregation && !!aggregationRules[field];
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
            columnAggregationRules: aggregationRules[field],
            apiRef,
            isGroupAggregated: props.isGroupAggregated,
          });
        }

        columnsState.lookup[field] = column;
      });

      footerLabelColumnOnLastColumnHydration?.forEach((footerLabelColumn) => {
        columnsState.lookup[footerLabelColumn.field] = unwrapColumnFromAggregation({
          column: columnsState.lookup[footerLabelColumn.field],
        });
      });

      footerLabelColumns.forEach((footerLabelColumn, footerLabelColumnIndex) => {
        columnsState.lookup[footerLabelColumn.field] = wrapColumnWithAggregationLabel({
          column: columnsState.lookup[footerLabelColumn.field],
          apiRef,
          isGroupAggregated: props.isGroupAggregated,
          aggregationRules,
          shouldRenderLabel: (groupNode) => {
            if (!footerLabelColumn.groupingCriteria) {
              return true;
            }

            if (groupNode?.groupingField == null) {
              return footerLabelColumnIndex === 0;
            }

            return footerLabelColumn.groupingCriteria.includes(groupNode.groupingField);
          },
        });
      });

      apiRef.current.unstable_caches.aggregation = {
        ...apiRef.current.unstable_caches.aggregation,
        rulesOnLastColumnHydration: aggregationRules,
        footerLabelColumnOnLastColumnHydration: footerLabelColumns,
      };

      return columnsState;
    },
    [
      apiRef,
      props.aggregationFunctions,
      props.disableAggregation,
      props.isGroupAggregated,
      props.aggregationFooterLabelField,
    ],
  );

  const addGroupFooterRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      let newGroupingParams: GridRowTreeCreationValue;
      let rulesOnLastRowHydration: GridAggregationRules;

      if (props.disableAggregation) {
        newGroupingParams = groupingParams;
        rulesOnLastRowHydration = {};
      } else {
        const aggregationRules = getAggregationRules({
          columnsLookup: gridColumnLookupSelector(apiRef),
          aggregationModel: gridAggregationModelSelector(apiRef),
          aggregationFunctions: props.aggregationFunctions,
        });

        rulesOnLastRowHydration = aggregationRules;

        // If no column have a footer aggregation rule
        // Then don't create the footer rows
        if (
          Object.values(aggregationRules).every(
            (columnAggregationRules) => !columnAggregationRules.footer,
          )
        ) {
          newGroupingParams = groupingParams;
        } else {
          newGroupingParams = addFooterRows({
            groupingParams,
            aggregationRules,
            isGroupAggregated: props.isGroupAggregated,
          });
        }
      }

      apiRef.current.unstable_caches.aggregation = {
        ...apiRef.current.unstable_caches.aggregation,
        rulesOnLastRowHydration,
      };

      return newGroupingParams;
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

      const treeDepth = gridRowTreeDepthSelector(apiRef);
      const items: React.ReactNode[] = [<Divider />];

      if (treeDepth > 1) {
        items.push(
          <ListSubheader disableSticky>
            {apiRef.current.getLocaleText('aggregationMenuItemHeader')}
          </ListSubheader>,
        );
        items.push(
          <GridAggregationColumnMenuItem
            column={column}
            position="inline"
            label={apiRef.current.getLocaleText('aggregationMenuItemInlineLabel')}
          />,
        );
      }

      items.push(
        <GridAggregationColumnMenuItem
          column={column}
          position="footer"
          label={
            treeDepth > 1
              ? apiRef.current.getLocaleText('aggregationMenuItemFooterLabel')
              : apiRef.current.getLocaleText('aggregationMenuItemHeader')
          }
        />,
      );

      return [...initialValue, ...items];
    },
    [apiRef, props.aggregationFunctions, props.disableAggregation],
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
