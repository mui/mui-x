'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import { warnOnce } from '@mui/x-internals/warning';
import { gridRowNodeSelector, useGridSelector } from '@mui/x-data-grid-pro';
import type { GridRowId, GridValidRowModel } from '@mui/x-data-grid-pro';
import { useGridApiMethod, useGridRegisterPipeProcessor } from '@mui/x-data-grid-pro/internals';
import type {
  GridStateInitializer,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
} from '@mui/x-data-grid-pro/internals';
import type { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { gridFormulaLookupSelector } from '../formula/gridFormulaSelectors';
import { gridComputedColumnsRevisionSelector } from '../computedColumns/gridComputedColumnsSelectors';
import type {
  GridConditionalFormattingApi,
  GridConditionalFormattingRule,
} from './gridConditionalFormattingInterfaces';
import { gridConditionalFormattingSelector } from './gridConditionalFormattingSelectors';
import {
  getConditionalFormattingClassName,
  getConditionalFormattingStyles,
  matchesConditionalFormattingValue,
} from './gridConditionalFormattingUtils';

export const conditionalFormattingStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'conditionalFormatting' | 'initialState'>,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  apiRef.current.caches.conditionalFormatting = { classNames: new WeakMap(), inputs: [] };

  return {
    ...state,
    conditionalFormatting: {
      model: props.conditionalFormatting ?? props.initialState?.conditionalFormatting?.model ?? [],
    },
  };
};

export const useGridConditionalFormatting = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    'conditionalFormatting' | 'onConditionalFormattingChange' | 'initialState'
  >,
) => {
  apiRef.current.registerControlState({
    stateId: 'conditionalFormatting',
    propModel: props.conditionalFormatting,
    propOnChange: props.onConditionalFormattingChange,
    stateSelector: gridConditionalFormattingSelector,
    changeEvent: 'conditionalFormattingChange',
  });

  const setConditionalFormatting = React.useCallback<
    GridConditionalFormattingApi['setConditionalFormatting']
  >(
    (model) => {
      if (model === gridConditionalFormattingSelector(apiRef)) {
        return;
      }
      apiRef.current.setState((state) => ({
        ...state,
        conditionalFormatting: { ...state.conditionalFormatting, model },
      }));
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { setConditionalFormatting }, 'public');

  const matchesRule = React.useCallback(
    (rule: GridConditionalFormattingRule, row: GridValidRowModel, id: GridRowId, field: string) => {
      const { condition } = rule;
      if (condition.type === 'formula') {
        return (
          apiRef.current.evaluateConditionalFormattingFormula?.(condition.formula, row, id) ?? false
        );
      }
      return matchesConditionalFormattingValue(condition, apiRef.current.getCellValue(id, field));
    },
    [apiRef],
  );

  const addClassNames = React.useCallback<GridPipeProcessor<'cellClassName'>>(
    (classNames, { id, field }) => {
      const model = gridConditionalFormattingSelector(apiRef);
      if (model.length === 0) {
        return classNames;
      }
      // Group and aggregation rows have no value of their own to format.
      if (gridRowNodeSelector(apiRef, id)?.type !== 'leaf') {
        return classNames;
      }
      const row = apiRef.current.getRow(id);
      if (row == null) {
        return classNames;
      }

      const cache = apiRef.current.caches.conditionalFormatting;
      // Formula and computed cells change value without a new row object.
      const inputs = [
        model,
        gridFormulaLookupSelector(apiRef),
        gridComputedColumnsRevisionSelector(apiRef),
      ];
      if (inputs.some((input, index) => input !== cache.inputs[index])) {
        cache.classNames = new WeakMap();
        cache.inputs = inputs;
      }

      let rowClassNames = cache.classNames.get(row);
      if (rowClassNames === undefined) {
        rowClassNames = new Map();
        cache.classNames.set(row, rowClassNames);
      }
      let cellClassNames = rowClassNames.get(field);
      if (cellClassNames === undefined) {
        cellClassNames = [];
        for (let i = 0; i < model.length; i += 1) {
          if (model[i].fields.includes(field) && matchesRule(model[i], row, id, field)) {
            cellClassNames.push(getConditionalFormattingClassName(apiRef.current.instanceId.id, i));
          }
        }
        rowClassNames.set(field, cellClassNames);
      }
      return cellClassNames.length === 0 ? classNames : [...classNames, ...cellClassNames];
    },
    [apiRef, matchesRule],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const model = gridConditionalFormattingSelector(apiRef);
      const shouldExportModel =
        !context.exportOnlyDirtyModels ||
        props.conditionalFormatting != null ||
        props.initialState?.conditionalFormatting?.model != null ||
        model.length > 0;
      if (!shouldExportModel) {
        return prevState;
      }
      return { ...prevState, conditionalFormatting: { model } };
    },
    [apiRef, props.conditionalFormatting, props.initialState?.conditionalFormatting?.model],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      const model = context.stateToRestore.conditionalFormatting?.model;
      if (model != null) {
        apiRef.current.setConditionalFormatting(model);
      }
      return params;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'cellClassName', addClassNames);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  const model = useGridSelector(apiRef, gridConditionalFormattingSelector);
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      apiRef.current.evaluateConditionalFormattingFormula === undefined &&
      model.some((rule) => rule.condition.type === 'formula')
    ) {
      warnOnce(
        [
          'MUI X Data Grid: Conditional formatting rules with a `formula` condition need the formula feature.',
          'Pass `featureDependencies={{ formula: formulaFeature }}`, with `formulaFeature` imported from `@mui/x-data-grid-premium/formula`.',
        ].join('\n'),
      );
    }
  }, [apiRef, model]);

  React.useEffect(() => {
    if (props.conditionalFormatting !== undefined) {
      apiRef.current.setConditionalFormatting(props.conditionalFormatting);
    }
  }, [apiRef, props.conditionalFormatting]);
};

/**
 * Adds the styles of the rules to the `sx` of the grid root.
 */
export const useGridConditionalFormattingSx = (
  apiRef: RefObject<GridPrivateApiPremium>,
  sx: SxProps<Theme> | undefined,
): SxProps<Theme> | undefined => {
  const model = useGridSelector(apiRef, gridConditionalFormattingSelector);
  return React.useMemo(() => {
    if (model.length === 0) {
      return sx;
    }
    const styles = getConditionalFormattingStyles(model, apiRef.current.instanceId.id);
    return [...(Array.isArray(sx) ? sx : [sx]), styles];
  }, [apiRef, model, sx]);
};
