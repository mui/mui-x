import * as React from 'react';
import MuiDivider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import { gridColumnLookupSelector, gridRowMaximumTreeDepthSelector } from '@mui/x-data-grid-pro';
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
  getAggregationFooterLabelColumns,
  hasAggregationRulesChanged,
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

const Divider = () => <MuiDivider onClick={(event) => event.stopPropagation()} />;

export const useGridAggregationPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'aggregationFunctions'
    | 'isGroupAggregated'
    | 'disableAggregation'
    | 'aggregationFooterLabel'
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
          aggregationFooterLabel: props.aggregationFooterLabel,
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
      props.aggregationFooterLabel,
      props.aggregationFooterLabelField,
    ],
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

      const hasFooterAggregation = Object.values(aggregationRules).some(
        (columnRules) => !!columnRules.footer,
      );

      // If we did not have any aggregation footer before, and we still don't have any
      // Then we can skip this step
      if (
        Object.keys(apiRef.current.unstable_caches.aggregation.rulesOnLastRowHydration).length ===
          0 &&
        Object.keys(aggregationRules).length === 0
      ) {
        return value;
      }

      apiRef.current.unstable_caches.aggregation = {
        ...apiRef.current.unstable_caches.aggregation,
        rulesOnLastRowHydration: aggregationRules,
      };

      return addFooterRows({
        ...value,
        hasFooterAggregation,
        isGroupAggregated: props.isGroupAggregated,
      });
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

      const treeDepth = gridRowMaximumTreeDepthSelector(apiRef);
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
