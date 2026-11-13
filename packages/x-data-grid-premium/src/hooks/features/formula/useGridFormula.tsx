'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import {
  GridCellEditStartReasons,
  GridCellModes,
  gridClasses,
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
  gridFilterModelSelector,
  gridResizingColumnFieldSelector,
  gridRowIdSelector,
  gridRowsLookupSelector,
  gridSortModelSelector,
  useGridApiMethod,
  useGridEvent,
  useGridEventPriority,
} from '@mui/x-data-grid-pro';
import type {
  GridCellCoordinates,
  GridEventListener,
  GridGroupingColDefOverride,
  GridRowId,
} from '@mui/x-data-grid-pro';
import {
  createColumnsState,
  gridPivotActiveSelector,
  GridStrategyGroup,
  RowGroupingStrategy,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import type { GridPipeProcessor, GridStateInitializer } from '@mui/x-data-grid-pro/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import {
  createFormulaFunctionRegistry,
  getFormulaExpression,
  isFormulaSource,
  validateFormulaExpression,
} from './engine';
import {
  computeFullFormulaPass,
  computePositionRebindFormulaPass,
  computeRowsDiffFormulaPass,
} from './createFormulaEvaluation';
import type { FormulaPassContext } from './createFormulaEvaluation';
import {
  buildFormulaPositionSnapshot,
  buildFormulaPositionSnapshotFromState,
} from './gridFormulaPositionContext';
import type {
  GridFormulaActiveEdit,
  GridFormulaLookup,
  GridFormulaPrivateApi,
} from './gridFormulaInterfaces';
import {
  gridCellFormulaResultSelector,
  gridFormulaActiveEditSelector,
  gridFormulaLookupSelector,
} from './gridFormulaSelectors';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import {
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  getColDefOverrides,
  getRowGroupingFieldFromGroupingCriteria,
  isGroupingColumn,
} from '../rowGrouping/gridRowGroupingUtils';
import { GRID_FORMULA_EDITOR_SURFACE_CLASS } from '../../../components/GridFormulaEditor';
import { GridComputedColumnsPanel } from '../../../components/computedColumnsPanel';
import { GridSidebarValue } from '../sidebar/gridSidebarInterfaces';
import { isFormulaFocusSafeTarget } from './gridFormulaBarElements';
import {
  areColumnsSignaturesEqual,
  areFormulaFieldsEqual,
  areFormulaFunctionRecordsEqual,
  computeColumnsSignature,
  haveComputedInputsChanged,
  ensureFormulaInternalCache,
  getEffectiveFormulaFunctions,
  getFormulaFields,
  resetFormulaEvaluationCache,
} from './gridFormulaUtils';
import { getFilledFormulaSource } from './gridFormulaFill';
import { createFormulaExcelExportLayout, getCellExcelFormula } from './gridFormulaExcelExport';
import {
  bumpComputedColumnsRevision,
  evictComputedResultsForRows,
  haveComputedColDefOverridesChanged,
  resetComputedResults,
} from './gridComputedColumnsRuntime';
import {
  createComputedColumnValidationScope,
  validateComputedColumnDefinition,
} from './gridComputedColumnsValidation';
import type { GridComputedColumnsPrivateApi } from '../computedColumns/gridComputedColumnsInterfaces';

export const formulaStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'formulaFunctions' | 'disableFormulas' | 'dataSource'>,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  // Already created when the computed columns were injected during the columns state initialization.
  const cache = ensureFormulaInternalCache(apiRef, props);

  const premiumState = state as Partial<GridStatePremium>;
  const columnsLookup = premiumState.columns?.lookup ?? {};
  cache.lastColumnsSignature = computeColumnsSignature(columnsLookup);
  // The pass that registers the pipe processors after the mount builds the grouping
  // columns from these records: the first `columnsChange` must not hydrate a third time.
  for (const [field, record] of cache.computedColumns.records) {
    cache.computedColumns.hydratedColDefs.set(field, record.colDef);
  }
  const pivotActive = premiumState.pivoting?.active ?? false;
  const enabled = !props.disableFormulas && !props.dataSource && !pivotActive;
  const formulaFields = enabled ? getFormulaFields(columnsLookup) : [];

  let lookup: GridFormulaLookup = {};
  if (formulaFields.length > 0) {
    lookup = computeFullFormulaPass({
      apiRef,
      cache,
      rowsLookup: premiumState.rows?.dataRowIdToModelLookup ?? {},
      columnsLookup,
      formulaFields,
      previousLookup: {},
      // Sorting and filtering initialize after the formula state — the
      // mount-time `sortedRowsSet`/`filteredRowsSet` cascade rebinds
      // position-dependent formulas against the real view order.
      getPositionSnapshot: () => buildFormulaPositionSnapshotFromState(premiumState),
    }).lookup;
  }

  // The initial row tree build may have read computed cells before the pass above:
  // cell-formula dependencies were raw `=` sources back then.
  resetComputedResults(cache);

  return { ...state, formula: { lookup, activeEdit: null } };
};

/**
 * Whether the pass changed the values of a grouped field. The row tree is built before
 * the formula pass of the same cascade, so it was grouped by the previous values.
 */
function isRowGroupingAffected(
  apiRef: RefObject<GridPrivateApiPremium>,
  changedCells: GridCellCoordinates[] | null,
  computedColumnsChanged: boolean,
) {
  if (apiRef.current.getActiveStrategy(GridStrategyGroup.RowTree) !== RowGroupingStrategy.Default) {
    return false;
  }
  const groupedFields = gridRowGroupingSanitizedModelSelector(apiRef);
  if (groupedFields.length === 0) {
    return false;
  }
  // A grouped computed column changes with the cells its formula reads.
  const { dependencyClosure, records } = apiRef.current.caches.formula!.computedColumns;
  const isGroupedFieldAffected = (field: string) =>
    groupedFields.some(
      (groupedField) =>
        groupedField === field || dependencyClosure.get(groupedField)?.has(field) === true,
    );
  return (
    (computedColumnsChanged && groupedFields.some((field) => records.has(field))) ||
    (changedCells !== null && changedCells.some((cell) => isGroupedFieldAffected(cell.field)))
  );
}

const NO_VIEW_REFRESH = { refilter: false, resort: false };
const FULL_VIEW_REFRESH = { refilter: true, resort: true };

type ViewStep = 'filtering' | 'sorting' | 'row grouping';

/**
 * Runs a step of the view and returns what it threw, or `null`. The regroup keeps the error: the
 * filtering and the sorting applied after it usually fail again and report it more precisely.
 */
function catchViewFailure(apply: () => void): { error: unknown } | null {
  try {
    apply();
    return null;
  } catch (error) {
    return { error };
  }
}

const VIEW_STEP_CONSEQUENCES: Record<ViewStep, string> = {
  filtering:
    'The rows keep their previous filtering, and the next filtering throws the same error until its cause is fixed.',
  sorting:
    'The rows keep their previous order, and the next sorting throws the same error until its cause is fixed.',
  'row grouping':
    'The rows can stay in their previous groups, and the features that run after the row grouping can be out of date.',
};

const VIEW_STEP_CAUSES: Record<ViewStep, string> = {
  filtering:
    'Check the filter model and the filter operators of the columns (`computedColDef` for the computed ones) against the new values.',
  sorting:
    'Check the sort model and the comparators of the columns (`computedColDef` for the computed ones) against the new values.',
  'row grouping':
    'Check the `groupingValueGetter` of the grouped columns and the listeners of the `rowsSet` event against the new values.',
};

function warnViewNotApplied(step: ViewStep, error: unknown) {
  if (process.env.NODE_ENV !== 'production') {
    warnOnce(
      [
        `MUI X Data Grid: The ${step} could not be applied again after the formula values changed.`,
        VIEW_STEP_CONSEQUENCES[step],
        `${VIEW_STEP_CAUSES[step]} Caught error: ${error instanceof Error ? error.message : String(error)}`,
      ].join('\n'),
    );
  }
}

/**
 * Applies the filtering or the sorting again, and returns whether it was applied. It runs inside
 * the hydration of the columns when a hydration published `columnsChange`, where a throw would
 * skip the other listeners of the event and reach the caller. The filter items of a computed
 * column whose type changed, and of the grouping columns that read it, are fitted to the new type
 * first, once these grouping columns are built from the rebuilt records
 * (`handleTypeChangedColumns`), but the core can still fail with a column or a model made for one
 * type: a `computedColDef` comparator or operator written for one type, or an item that was
 * already broken. The core throws before it sets the state, so nothing changes: the view keeps its
 * rows and order, and the error comes at the next filtering or sorting, like after the type change
 * of a regular column. A step that fails logs a warning in development.
 * A regroup (`catchViewFailure`) fails when the filtering or the sorting of the rebuilt tree does,
 * or the tree creation, or another listener of its `rowsSet`: both are then applied again. Until
 * the next filtering that succeeds, the group rows can show stale or missing counts, and until the
 * next sorting that succeeds, they keep the previous order (new group rows missing or misplaced).
 */
function tryToApplyView(step: ViewStep, apply: () => void) {
  const failure = catchViewFailure(apply);
  if (failure) {
    warnViewNotApplied(step, failure.error);
  }
  return failure === null;
}

/**
 * Fits the filter items of the given fields to the filter operators of their current column,
 * like the filter panel does when an item moves to a column of another type: the operator is
 * kept when the column still has it, else the first operator of the column is used, and the
 * value is cleared. The end user can change the type of a computed column, so the grid makes
 * the filter model fit it, on the column and on the row grouping columns that read it: an
 * operator that is gone (`>` on a `string` column) or a value of the previous type (`isAnyOf`
 * with numbers) would make every later filtering throw. An item already reset is left alone.
 * The caller resets the computed columns and the grouping columns that read them in one call:
 * one filtering, and one model for a controlled parent. `setFilterModel` sets the model before
 * it filters, so when the filtering fails, the reset items stay and only the rows keep their
 * previous filtering.
 * A controlled model only changes when the parent passes it back, after the event: until then,
 * the state keeps the items that don't fit (`pending`). The filtering that `setFilterModel` runs
 * with them fails without a warning, since the parent's model is filtered when it arrives. A
 * reset that runs before that, in a later event (a second type change), starts from the model
 * the pending reset sent, so that the last model the parent gets holds every reset. Without
 * `onFilterModelChange`, the parent can't pass the model back: the grid warns in development.
 * Returns whether the reset is pending.
 */
function resetFilterItemsOfFields(
  apiRef: RefObject<GridPrivateApiPremium>,
  fields: Set<string>,
  hasFilterModelChangeHandler: boolean,
): boolean {
  const cache = apiRef.current.caches.formula!;
  const stateModel = gridFilterModelSelector(apiRef);
  // `handleFilterModelChange` drops the pending reset when the state changes: this guards a
  // state changed without the event.
  if (cache.pendingFilterItemsReset?.stateModel !== stateModel) {
    cache.pendingFilterItemsReset = null;
  }
  const filterModel = cache.pendingFilterItemsReset?.filterModel ?? stateModel;
  const lookup = gridColumnLookupSelector(apiRef);
  const resetFields = new Set<string>();
  const items = filterModel.items.map((item) => {
    const operators = fields.has(item.field) ? lookup[item.field]?.filterOperators : undefined;
    if (!operators || operators.length === 0) {
      return item;
    }
    const operator = (
      operators.find((filterOperator) => filterOperator.value === item.operator) ?? operators[0]
    ).value;
    if (operator === item.operator && item.value === undefined) {
      return item;
    }
    resetFields.add(item.field);
    return { ...item, operator, value: undefined };
  });
  if (resetFields.size === 0) {
    return false;
  }
  const resetModel = { ...filterModel, items };
  // `setFilterModel` applies the filtering itself: an unrelated item that fails must not
  // throw out of the hydration.
  const failure = catchViewFailure(() => apiRef.current.setFilterModel(resetModel));
  if (gridFilterModelSelector(apiRef) === stateModel) {
    cache.pendingFilterItemsReset = { stateModel, filterModel: resetModel };
    if (process.env.NODE_ENV !== 'production' && !hasFilterModelChangeHandler) {
      warnOnce(
        [
          `MUI X Data Grid: The filter items of the fields ${Array.from(resetFields, (field) => `"${field}"`).join(', ')} could not be reset to the new type of a computed column.`,
          'The `filterModel` prop is controlled without `onFilterModelChange`, so the reset items never reach the grid, and the next filtering throws on the items that do not fit the new type.',
          'Pass `onFilterModelChange` and give the model back to `filterModel`, or update `filterModel` when the type of a computed column changes.',
        ].join('\n'),
      );
    }
    return true;
  }
  cache.pendingFilterItemsReset = null;
  if (failure) {
    warnViewNotApplied('filtering', failure.error);
  }
  return false;
}

/**
 * Which of the filtering and the sorting read the computed values that changed outside a rows
 * update (a definition, the function registry): the values of every computed column, and the
 * cell formulas the pass re-evaluated. A grouping column filters and sorts by a criterion or a
 * leaf field, which can be computed. The quick filter reads every column.
 */
function getViewRefresh(
  apiRef: RefObject<GridPrivateApiPremium>,
  changedCells: GridCellCoordinates[] | null,
  filterMode: DataGridPremiumProcessedProps['filterMode'],
  sortingMode: DataGridPremiumProcessedProps['sortingMode'],
) {
  const { records } = apiRef.current.caches.formula!.computedColumns;
  const changedFields = new Set<string>();
  if (changedCells !== null) {
    for (const cell of changedCells) {
      changedFields.add(cell.field);
    }
  }
  // A model set after the mount can hold an item without a field: the core prunes it after
  // this handler.
  const isAffected = (field: string) =>
    !!field && (records.has(field) || changedFields.has(field) || isGroupingColumn(field));
  const filterModel = gridFilterModelSelector(apiRef);
  return {
    refilter:
      filterMode === 'client' &&
      ((filterModel.quickFilterValues?.length ?? 0) > 0 ||
        filterModel.items.some((item) => isAffected(item.field))),
    resort:
      sortingMode === 'client' &&
      gridSortModelSelector(apiRef).some((item) => isAffected(item.field)),
  };
}

/**
 * The leaf fields of the row grouping columns, resolved from `groupingColDef` like the
 * grouping columns resolve them: one column for all the criteria in the `single` mode,
 * one column per criterion in the `multiple` mode.
 */
function getGroupingLeafFields(
  groupingColDef: DataGridPremiumProcessedProps['groupingColDef'],
  rowGroupingColumnMode: DataGridPremiumProcessedProps['rowGroupingColumnMode'],
  groupedFields: string[],
): string[] {
  let overrides: Array<GridGroupingColDefOverride | null | undefined> = [];
  if (rowGroupingColumnMode === 'single') {
    overrides = [getColDefOverrides(groupingColDef, groupedFields, RowGroupingStrategy.Default)];
  } else if (rowGroupingColumnMode === 'multiple') {
    overrides = groupedFields.map((criterion) => getColDefOverrides(groupingColDef, [criterion]));
  }
  return overrides.flatMap((override) => (override?.leafField ? [override.leafField] : []));
}

/**
 * The field of the column that gives its filter operators to each row grouping column, resolved
 * like `createGroupingColDef` resolves it: the `mainGroupingCriteria` when the column groups by
 * it, else the `leafField` when it is a column, else the criterion of the column (the first one
 * in the `single` mode).
 */
function getGroupingColumnSources(
  groupingColDef: DataGridPremiumProcessedProps['groupingColDef'],
  rowGroupingColumnMode: DataGridPremiumProcessedProps['rowGroupingColumnMode'],
  groupedFields: string[],
  lookup: ReturnType<typeof gridColumnLookupSelector>,
): Map<string, string> {
  const sources = new Map<string, string>();
  const resolve = (
    override: GridGroupingColDefOverride | null | undefined,
    criteria: string[],
  ): string => {
    if (override?.mainGroupingCriteria && criteria.includes(override.mainGroupingCriteria)) {
      return override.mainGroupingCriteria;
    }
    if (override?.leafField && lookup[override.leafField]) {
      return override.leafField;
    }
    return criteria[0];
  };
  if (rowGroupingColumnMode === 'single') {
    const override = getColDefOverrides(groupingColDef, groupedFields, RowGroupingStrategy.Default);
    sources.set(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD, resolve(override, groupedFields));
  } else if (rowGroupingColumnMode === 'multiple') {
    for (const criterion of groupedFields) {
      sources.set(
        getRowGroupingFieldFromGroupingCriteria(criterion),
        resolve(getColDefOverrides(groupingColDef, [criterion]), [criterion]),
      );
    }
  }
  return sources;
}

export const useGridFormula = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'disableFormulas'
    | 'formulaFunctions'
    | 'dataSource'
    | 'formulaA1Notation'
    | 'disableComputedColumns'
    | 'computedColDef'
    | 'filterMode'
    | 'sortingMode'
    | 'disableRowGrouping'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'onFilterModelChange'
  >,
) => {
  const a1NotationActive = !!props.formulaA1Notation && !props.disableFormulas && !props.dataSource;
  const computedColumnsEnabled =
    !props.disableFormulas && !props.disableComputedColumns && !props.dataSource;

  const computeEffectiveFormulaFields = React.useCallback(() => {
    if (props.disableFormulas || props.dataSource || gridPivotActiveSelector(apiRef)) {
      return [];
    }
    return getFormulaFields(gridColumnLookupSelector(apiRef));
  }, [apiRef, props.disableFormulas, props.dataSource]);

  const runPass = React.useCallback(
    (mode: 'diff' | 'full' | 'rebind'): GridCellCoordinates[] | null => {
      const cache = apiRef.current.caches.formula!;
      const formulaFields = computeEffectiveFormulaFields();
      const previousLookup = gridFormulaLookupSelector(apiRef);

      if (formulaFields.length === 0) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !props.disableFormulas &&
          getFormulaFields(gridColumnLookupSelector(apiRef)).length > 0
        ) {
          if (props.dataSource) {
            warnOnce(
              [
                'MUI X Data Grid: Formulas are not supported with the `dataSource` prop.',
                'The `allowFormulas` column option is ignored and `=` cell values render as raw strings.',
              ].join('\n'),
            );
          } else if (gridPivotActiveSelector(apiRef)) {
            warnOnce(
              [
                'MUI X Data Grid: Formulas are not supported while pivoting is active.',
                'Formula evaluation is paused and resumes when pivoting is deactivated.',
              ].join('\n'),
            );
          }
        }

        resetFormulaEvaluationCache(cache);
        cache.formulaFields = [];
        const clearedRowKeys = Object.keys(previousLookup);
        if (clearedRowKeys.length === 0) {
          return null;
        }
        const rowsLookup = gridRowsLookupSelector(apiRef);
        const changedCells: GridCellCoordinates[] = [];
        for (const rowKey of clearedRowKeys) {
          const row = rowsLookup[rowKey];
          const id = row === undefined ? rowKey : gridRowIdSelector(apiRef, row);
          for (const field of Object.keys(previousLookup[rowKey])) {
            changedCells.push({ id, field });
          }
        }
        apiRef.current.setState((state) => ({
          ...state,
          formula: { ...state.formula, lookup: {} },
        }));
        apiRef.current.publishEvent('formulaEvaluated', { changedCells });
        return changedCells;
      }

      const ctx: FormulaPassContext = {
        apiRef,
        cache,
        rowsLookup: gridRowsLookupSelector(apiRef),
        columnsLookup: gridColumnLookupSelector(apiRef),
        formulaFields,
        previousLookup,
        getPositionSnapshot: () => buildFormulaPositionSnapshot(apiRef),
      };
      let result;
      if (mode === 'full') {
        result = computeFullFormulaPass(ctx);
      } else if (mode === 'diff') {
        result = computeRowsDiffFormulaPass(ctx);
      } else {
        result = computePositionRebindFormulaPass(ctx);
      }
      if (result === null || result.changedCells.length === 0) {
        return null;
      }
      apiRef.current.setState((state) => ({
        ...state,
        formula: { ...state.formula, lookup: result.lookup },
      }));
      apiRef.current.publishEvent('formulaEvaluated', { changedCells: result.changedCells });
      return result.changedCells;
    },
    [apiRef, computeEffectiveFormulaFields, props.disableFormulas, props.dataSource],
  );

  /**
   * Refreshes the features that consumed formula values before a pass
   * changed them. Aggregation and row spanning recompute on their own after
   * rows-driven cascades — callers opt in only where no such cascade runs.
   * Row grouping builds its tree before the formula pass in the same
   * cascade, so a pass that changed cells of a grouped field re-triggers the
   * tree build; the rebuild's own cascade is suppressed from re-triggering.
   * Filtering and sorting re-run in the rows cascades only: after a change of
   * the computed values (`computedColumnsChanged`), they are re-applied when
   * their model reads a changed value. Once: the events they publish refresh
   * the position-dependent formulas without reporting a computed change. The
   * filtering is skipped when a controlled parent has not passed back the
   * filter items reset after a type change (`filterItemsResetPending`): the
   * state still holds the items that don't fit the new type, and the model of
   * the parent is filtered when it arrives. A
   * filtering or a sorting the core can't apply leaves the view as it was,
   * and a failed regroup is finished with both (`tryToApplyView`), except the
   * regroup of the `rowsSet` pass, which throws to the caller of the rows update.
   */
  const triggerDependentFeatures = React.useCallback(
    (
      changedCells: GridCellCoordinates[] | null,
      options: {
        aggregation: boolean;
        rowSpanning: boolean;
        computedColumnsChanged?: boolean;
        insideRowsSet?: boolean;
        filterItemsResetPending?: boolean;
      },
    ) => {
      // The values of the computed columns changed as a whole (formula, referenced
      // `valueGetter`, function registry), whether or not a formula cell followed.
      const computedColumnsChanged = options.computedColumnsChanged === true;
      if ((changedCells === null || changedCells.length === 0) && !computedColumnsChanged) {
        return;
      }
      const cache = apiRef.current.caches.formula!;
      let regroupFailure: { error: unknown } | null = null;
      if (
        !cache.suppressRegroupTrigger &&
        isRowGroupingAffected(apiRef, changedCells, computedColumnsChanged)
      ) {
        if (options.aggregation) {
          apiRef.current.applyAggregation();
        }
        if (options.rowSpanning) {
          apiRef.current.resetRowSpanningState();
        }
        // The rebuilt tree publishes `rowsSet`: filtering and sorting re-run in its cascade.
        cache.suppressRegroupTrigger = true;
        regroupFailure = catchViewFailure(() =>
          apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation'),
        );
        cache.suppressRegroupTrigger = false;
        if (!regroupFailure) {
          return;
        }
        if (options.insideRowsSet) {
          // The core filters, sorts and runs the other `rowsSet` listeners again after this
          // handler, but doesn't create the tree again: the caller of the rows update gets the
          // error, as for a regular column.
          throw regroupFailure.error;
        }
      }
      const regroupFailed = regroupFailure !== null;
      let viewRefresh = NO_VIEW_REFRESH;
      if (regroupFailed) {
        // The cascade of the rebuilt tree stopped at a throw: its filtering, its sorting and the
        // aggregation can still belong to the previous tree.
        viewRefresh = FULL_VIEW_REFRESH;
      } else if (computedColumnsChanged) {
        viewRefresh = getViewRefresh(apiRef, changedCells, props.filterMode, props.sortingMode);
      }
      // A regroup that failed while the reset is pending is not reported: it most likely failed
      // at the filtering of the rebuilt tree, on the items that don't fit.
      if (options.filterItemsResetPending) {
        viewRefresh = { ...viewRefresh, refilter: false };
      }
      const { refilter, resort } = viewRefresh;
      // `filteredRowsSet` applies the aggregation, and both events reset the row spanning.
      const refiltered =
        refilter && tryToApplyView('filtering', () => apiRef.current.unstable_applyFilters());
      if ((options.aggregation || regroupFailed) && !refiltered) {
        apiRef.current.applyAggregation();
      }
      const resorted = resort && tryToApplyView('sorting', () => apiRef.current.applySorting());
      // A failed step above reports the error of the regroup too. When both apply, the regroup
      // failed elsewhere: in the tree creation, or in another listener of its `rowsSet`.
      if (regroupFailure && refiltered && resorted) {
        warnViewNotApplied('row grouping', regroupFailure.error);
      }
      if (options.rowSpanning && !refiltered && !resorted) {
        apiRef.current.resetRowSpanningState();
      }
    },
    [apiRef, props.filterMode, props.sortingMode],
  );

  /**
   * API METHODS
   */
  const setCellFormula = React.useCallback<GridFormulaPrivateApi['setCellFormula']>(
    (id, field, formula) => {
      const colDef = apiRef.current.getColumn(field);
      if (!colDef || !colDef.allowFormulas) {
        throw new Error(
          `MUI X Data Grid: The column "${field}" does not allow formulas. ` +
            'Writing a formula to it would store a string rendered as-is instead of an evaluated value. ' +
            'Set `allowFormulas: true` on the column definition. ' +
            'See https://mui.com/x/react-data-grid/formulas/.',
        );
      }
      if (typeof formula !== 'string' || !isFormulaSource(formula)) {
        throw new Error(
          'MUI X Data Grid: `setCellFormula()` expects a formula source starting with `=`, for example `=price * quantity`. ' +
            'Other values would not be recognized as formulas. ' +
            'To store a plain value, use `updateRows()` instead.',
        );
      }
      const row = apiRef.current.getRow(id);
      if (!row) {
        throw new Error(`MUI X: No row with id #${id} found.`);
      }
      apiRef.current.updateRows([{ ...row, [field]: formula }]);
    },
    [apiRef],
  );

  const getCellFormula = React.useCallback<GridFormulaPrivateApi['getCellFormula']>(
    (id, field) => {
      const raw = apiRef.current.getRow(id)?.[field];
      return isFormulaSource(raw) ? raw : null;
    },
    [apiRef],
  );

  const getCellFormulaResult = React.useCallback<GridFormulaPrivateApi['getCellFormulaResult']>(
    (id, field) => gridCellFormulaResultSelector(apiRef, { id, field }),
    [apiRef],
  );

  const validateCellFormula = React.useCallback<GridFormulaPrivateApi['validateCellFormula']>(
    (formula) =>
      validateFormulaExpression(getFormulaExpression(typeof formula === 'string' ? formula : ''), {
        functions: apiRef.current.caches.formula!.registry,
      }),
    [apiRef],
  );

  const reevaluateFormulas = React.useCallback<GridFormulaPrivateApi['reevaluateFormulas']>(() => {
    // Aggregation, row spanning and grouping consumed formula values through
    // `getRowValue` — refresh them after passes that are not part of a rows
    // update cascade (registry change, enablement toggle, in-place mutations).
    triggerDependentFeatures(runPass('full'), { aggregation: true, rowSpanning: true });
  }, [runPass, triggerDependentFeatures]);

  const setFormulaActiveEdit = React.useCallback<GridFormulaPrivateApi['setFormulaActiveEdit']>(
    (cell) => {
      const current = gridFormulaActiveEditSelector(apiRef);
      const unchanged =
        cell === null
          ? current === null
          : current !== null &&
            current.id === cell.id &&
            current.field === cell.field &&
            current.draft === cell.draft;
      // The editor effect re-asserts the same cell on every (re)mount — skip the
      // redundant state write so virtualization remounts do not churn renders.
      // The formula bar updates `draft` per keystroke, so a draft change is
      // never "unchanged".
      if (unchanged) {
        return;
      }
      apiRef.current.setState((state) => ({
        ...state,
        formula: { ...state.formula, activeEdit: cell as GridFormulaActiveEdit | null },
      }));
    },
    [apiRef],
  );

  // Seams consumed by bundled grid code (cell selection fill, Excel export)
  // through optional calls — they exist exactly when the feature is injected.
  const getFilledFormulaSourceMethod = React.useCallback<
    GridFormulaPrivateApi['getFilledFormulaSource']
  >((sourceCell, targetCell) => getFilledFormulaSource(apiRef, sourceCell, targetCell), [apiRef]);

  const createFormulaExcelExportLayoutMethod = React.useCallback<
    GridFormulaPrivateApi['createFormulaExcelExportLayout']
  >(
    (columns, rowIds, options) => createFormulaExcelExportLayout(apiRef, columns, rowIds, options),
    [apiRef],
  );

  const getCellExcelFormulaMethod = React.useCallback<GridFormulaPrivateApi['getCellExcelFormula']>(
    (layout, id, field) => getCellExcelFormula(apiRef, layout, id, field),
    [apiRef],
  );

  // The formula API stays private until a userland use case justifies exposing it.
  const formulaPrivateApi: GridFormulaPrivateApi = {
    setCellFormula,
    getCellFormula,
    getCellFormulaResult,
    validateCellFormula,
    reevaluateFormulas,
    setFormulaActiveEdit,
    getFilledFormulaSource: getFilledFormulaSourceMethod,
    createFormulaExcelExportLayout: createFormulaExcelExportLayoutMethod,
    getCellExcelFormula: getCellExcelFormulaMethod,
  };

  useGridApiMethod(apiRef, formulaPrivateApi, 'private');

  const validateComputedColumnDefinitionMethod = React.useCallback<
    GridComputedColumnsPrivateApi['validateComputedColumnDefinition']
  >(
    (definition, options) =>
      validateComputedColumnDefinition(
        definition,
        createComputedColumnValidationScope(
          apiRef,
          apiRef.current.caches.formula!,
          gridColumnLookupSelector(apiRef),
          a1NotationActive,
          // The editor validates every keystroke: a draft is not interned.
          { intern: false },
        ),
        options,
      ),
    [apiRef, a1NotationActive],
  );

  const getComputedColumnIssues = React.useCallback<
    GridComputedColumnsPrivateApi['getComputedColumnIssues']
  >(
    (field) => apiRef.current.caches.formula!.computedColumns.records.get(field)?.issues ?? [],
    [apiRef],
  );

  const computedColumnsPrivateApi: GridComputedColumnsPrivateApi = {
    validateComputedColumnDefinition: validateComputedColumnDefinitionMethod,
    getComputedColumnIssues,
  };

  useGridApiMethod(apiRef, computedColumnsPrivateApi, 'private');

  /**
   * EVENTS
   */
  const handleRowsSet = React.useCallback<GridEventListener<'rowsSet'>>(() => {
    // Synchronous on purpose: the filtering and sorting `rowsSet` handlers run
    // after this one in the same cascade and must read fresh formula values.
    // No aggregation/row-spanning refresh: both recompute later in the
    // cascade, on `filteredRowsSet`/`sortedRowsSet`.
    triggerDependentFeatures(runPass('diff'), {
      aggregation: false,
      rowSpanning: false,
      insideRowsSet: true,
    });
  }, [runPass, triggerDependentFeatures]);

  const handleSortedRowsSet = React.useCallback<GridEventListener<'sortedRowsSet'>>(() => {
    // One-shot rebind (D4): position-dependent formulas re-evaluate against
    // the new view order exactly once; the grid never re-sorts in response.
    // Aggregation already consumed values during this cascade — refresh it
    // when the rebind changed something. Row spanning resets on this event
    // after this handler, so it picks fresh values up by itself.
    triggerDependentFeatures(runPass('rebind'), { aggregation: true, rowSpanning: false });
  }, [runPass, triggerDependentFeatures]);

  const handleFilteredRowsSet = React.useCallback<GridEventListener<'filteredRowsSet'>>(() => {
    triggerDependentFeatures(runPass('rebind'), { aggregation: true, rowSpanning: false });
  }, [runPass, triggerDependentFeatures]);

  const handleColumnVisibilityModelChange = React.useCallback<
    GridEventListener<'columnVisibilityModelChange'>
  >(() => {
    // Visibility changes do not publish `columnsChange` — they replace the
    // columns state directly. Row spanning does not reset on this event
    // either, so it is refreshed here when the rebind changed values.
    triggerDependentFeatures(runPass('rebind'), { aggregation: true, rowSpanning: true });
  }, [runPass, triggerDependentFeatures]);

  /**
   * The row grouping columns are built from the columns state of the previous pass,
   * before the computed columns are injected into the current one. A record rebuilt
   * by the injection (name, format, type), or removed, leaves the grouping columns that
   * copy from it with its previous header, formatter, operators and comparators: the column
   * of a grouped computed field, and the one whose `leafField` is a computed column.
   * Hydrate once more so they are built from the current record. The second pass finds
   * the identities recorded here, so it never requests a third one. Synchronous on
   * purpose: `requestPipeProcessorsApplication` is a no-op while the hydration that
   * published this event is still running.
   * After a type change, `handleTypeChangedColumns` syncs before the regular `columnsChange`
   * listeners and doesn't publish (`syncGroupingColumns(false)`): they all run after it and read
   * the synced state. A nested `columnsChange` would filter with the grouping columns' items made
   * for the previous type (core's prune of the removed columns) before they are reset.
   */
  const syncGroupingColumns = React.useCallback(
    (publish: boolean = true) => {
      const { records, hydratedColDefs } = apiRef.current.caches.formula!.computedColumns;
      const changedFields: string[] = [];
      for (const [field, record] of records) {
        if (hydratedColDefs.get(field) !== record.colDef) {
          hydratedColDefs.set(field, record.colDef);
          changedFields.push(field);
        }
      }
      for (const field of Array.from(hydratedColDefs.keys())) {
        if (!records.has(field)) {
          hydratedColDefs.delete(field);
          // A grouping column still copies from the removed column.
          changedFields.push(field);
        }
      }
      if (changedFields.length === 0) {
        return;
      }
      const groupedFields = gridRowGroupingSanitizedModelSelector(apiRef);
      if (groupedFields.length === 0) {
        return;
      }
      // The leaf fields are only resolved when no grouped field was rebuilt: a
      // `groupingColDef` function runs only when a computed column was.
      const groupingColumnsStale =
        changedFields.some((field) => groupedFields.includes(field)) ||
        (!props.disableRowGrouping &&
          getGroupingLeafFields(
            props.groupingColDef,
            props.rowGroupingColumnMode,
            groupedFields,
          ).some((field) => changedFields.includes(field)));
      if (!groupingColumnsStale) {
        return;
      }
      const columnsState = createColumnsState({
        apiRef,
        columnsToUpsert: [],
        initialState: undefined,
        keepOnlyColumnsToUpsert: false,
      });
      apiRef.current.setState((state) => ({ ...state, columns: columnsState }));
      if (publish) {
        apiRef.current.publishEvent('columnsChange', columnsState.orderedFields);
      }
    },
    [apiRef, props.disableRowGrouping, props.groupingColDef, props.rowGroupingColumnMode],
  );

  /**
   * Adds to `fields` the row grouping columns that read one of them: a grouping column copies
   * the filter operators of its source column (see `getGroupingColumnSources`). Called once the
   * grouping columns are built from the rebuilt records, so their items are fitted to the
   * operators they filter with now.
   */
  const addGroupingColumnsOfSources = React.useCallback(
    (fields: Set<string>) => {
      const groupedFields = gridRowGroupingSanitizedModelSelector(apiRef);
      if (props.disableRowGrouping || groupedFields.length === 0) {
        return fields;
      }
      const lookup = gridColumnLookupSelector(apiRef);
      const sources = getGroupingColumnSources(
        props.groupingColDef,
        props.rowGroupingColumnMode,
        groupedFields,
        lookup,
      );
      const result = new Set(fields);
      for (const [groupingField, source] of sources) {
        if (lookup[groupingField] && fields.has(source)) {
          result.add(groupingField);
        }
      }
      return result;
    },
    [apiRef, props.disableRowGrouping, props.groupingColDef, props.rowGroupingColumnMode],
  );

  /**
   * Runs before the other `columnsChange` listeners: the regroup of the row grouping, the first
   * of them, filters the rebuilt tree, and a filter item made for the previous type of a grouped
   * computed column, or of a grouping column that reads it, would make it throw out of the
   * hydration. So the grouping columns are built from the rebuilt records first, without a
   * nested `columnsChange` (`syncGroupingColumns`), and the filter items of the computed columns
   * and of the grouping columns that read them are reset in one model: the filtering it applies
   * already uses the rebuilt grouping columns, and a controlled parent gets one model. The
   * fields are moved out of the cache, so a later `columnsChange` can't reset a filter the user
   * set since, even when a listener after this one threw.
   */
  const handleTypeChangedColumns = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    const cache = apiRef.current.caches.formula!;
    const fields = cache.computedColumns.typeChangedFields;
    if (fields.size === 0) {
      return;
    }
    cache.computedColumns.typeChangedFields = new Set();
    // A computed definition whose field is a regular column is not injected: the column keeps
    // its type.
    const lookup = gridColumnLookupSelector(apiRef);
    const computedFields = new Set(Array.from(fields).filter((field) => lookup[field]?.computed));
    if (computedFields.size === 0) {
      return;
    }
    syncGroupingColumns(false);
    cache.typeChangeReset = {
      // After the sync, which builds a new columns state.
      orderedFields: gridColumnFieldsSelector(apiRef),
      pending: resetFilterItemsOfFields(
        apiRef,
        addGroupingColumnsOfSources(computedFields),
        props.onFilterModelChange !== undefined,
      ),
    };
  }, [addGroupingColumnsOfSources, apiRef, props.onFilterModelChange, syncGroupingColumns]);

  /**
   * The filter state changed: a pending reset of the filter items reached the state, or the
   * parent passed another model. The next reset starts from the state, even when the parent
   * passes back the model the pending reset was sent for. A controlled write the parent hasn't
   * passed back doesn't publish the event, so the pending reset stays.
   */
  const handleFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(() => {
    apiRef.current.caches.formula!.pendingFilterItemsReset = null;
  }, [apiRef]);

  const handleColumnsChange = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    const cache = apiRef.current.caches.formula!;
    // The same array when the reset ran in this event, and nothing rebuilt the columns since.
    const typeChangeReset =
      cache.typeChangeReset?.orderedFields === gridColumnFieldsSelector(apiRef)
        ? cache.typeChangeReset
        : null;
    cache.typeChangeReset = null;
    const fieldsChanged = !areFormulaFieldsEqual(
      computeEffectiveFormulaFields(),
      cache.formulaFields,
    );
    // Evaluation also depends on the full column set (`#REF!` for unknown
    // fields) and on the referenced columns' `valueGetter`s — re-evaluate
    // when those change even if the `allowFormulas` set is stable.
    const columnsSignature = computeColumnsSignature(gridColumnLookupSelector(apiRef));
    const signatureChanged = !areColumnsSignaturesEqual(
      columnsSignature,
      cache.lastColumnsSignature,
    );
    if (!fieldsChanged && !signatureChanged) {
      // The column set is stable, but columns may have moved: visibility
      // toggles and reorders (programmatic `setColumnIndex` included) all
      // funnel through this event. The rebind pass compares the visible
      // field order itself and exits cheaply when nothing moved.
      triggerDependentFeatures(runPass('rebind'), { aggregation: true, rowSpanning: false });
      // A record rebuilt with the same getters (a new name or format) leaves the grouping
      // columns that copy from it stale. The nested `columnsChange` of the extra hydration finds
      // the identities recorded. A type change rebuilds the getters, so it takes the other
      // branch: there is no filter item to reset here.
      syncGroupingColumns();
    } else {
      const previousSignature = cache.lastColumnsSignature;
      cache.lastColumnsSignature = columnsSignature;
      // The computed columns read the referenced columns through their `valueGetter`,
      // and their own getters change with their formula: only a change of those
      // inputs drops the memoized results (an unrelated column re-created with an
      // inline getter on every parent render does not).
      const computedColumnsChanged =
        signatureChanged &&
        cache.computedColumns.records.size > 0 &&
        haveComputedInputsChanged(columnsSignature, previousSignature, cache.computedColumns);
      if (computedColumnsChanged) {
        resetComputedResults(cache);
      }
      if (signatureChanged) {
        // Not only the computed cells read the revision: the preview of a draft
        // (the first computed column included) reads the same getters.
        bumpComputedColumnsRevision(apiRef);
      }
      if (fieldsChanged) {
        apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
      }
      const changedCells = runPass('full');
      // Before the dependent features: the grouping columns sort and filter with the comparator
      // and the operators they copy from the rebuilt records. The nested `columnsChange` of the
      // extra hydration finds the signature bookkeeping above done, so it takes the cheap branch.
      // After a type change, `handleTypeChangedColumns` already synced them: nothing to do.
      syncGroupingColumns();
      // Row spanning resets on `columnsChange` after this handler.
      triggerDependentFeatures(changedCells, {
        aggregation: true,
        rowSpanning: false,
        computedColumnsChanged,
        filterItemsResetPending: typeChangeReset?.pending === true,
      });
    }
  }, [
    apiRef,
    computeEffectiveFormulaFields,
    runPass,
    syncGroupingColumns,
    triggerDependentFeatures,
  ]);

  const handleFormulaEvaluated = React.useCallback<GridEventListener<'formulaEvaluated'>>(
    ({ changedCells }) => {
      // The row object of a re-evaluated formula cell did not change, so the
      // computed results memoized for that row are stale.
      const { referencedFields } = apiRef.current.caches.formula!.computedColumns;
      if (referencedFields.size === 0) {
        return;
      }
      const rowIds = new Set<GridRowId>();
      for (const cell of changedCells) {
        if (referencedFields.has(cell.field)) {
          rowIds.add(cell.id);
        }
      }
      if (rowIds.size === 0) {
        return;
      }
      evictComputedResultsForRows(apiRef, rowIds);
      bumpComputedColumnsRevision(apiRef);
    },
    [apiRef],
  );

  // A computed cell is read-only: the editing gestures open the column editor
  // with the row of the cell as preview row instead.
  const handleComputedCellDoubleClick = React.useCallback<GridEventListener<'cellDoubleClick'>>(
    (params) => {
      if (!params.colDef.computed) {
        return;
      }
      apiRef.current.showComputedColumnEditor(params.field, { sampleRowId: params.id });
    },
    [apiRef],
  );

  const handleComputedCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (
        !params.colDef.computed ||
        params.cellMode !== GridCellModes.View ||
        event.key !== 'Enter' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.which === 229
      ) {
        return;
      }
      // The editor focuses its formula editable right away — without this the
      // keypress that follows would land in it as a newline.
      event.preventDefault();
      apiRef.current.showComputedColumnEditor(params.field, { sampleRowId: params.id });
    },
    [apiRef],
  );

  const handleCellEditStart = React.useCallback<GridEventListener<'cellEditStart'>>(
    (params, event) => {
      const isPrintableKeyDown = params.reason === GridCellEditStartReasons.printableKeyDown;
      apiRef.current.caches.formula!.lastCellEditStart = {
        id: params.id,
        field: params.field,
        replaceValue:
          isPrintableKeyDown ||
          params.reason === GridCellEditStartReasons.deleteKeyDown ||
          params.reason === GridCellEditStartReasons.pasteKeyDown,
        startedWithEquals: isPrintableKeyDown && (event as React.KeyboardEvent).key === '=',
      };
    },
    [apiRef],
  );

  const handleCellEditStop = React.useCallback<GridEventListener<'cellEditStop'>>(() => {
    const cache = apiRef.current.caches.formula!;
    cache.lastCellEditStart = null;
    // `lastA1Seed` is deliberately NOT cleared here: the editing hook's stop
    // flow re-runs the value setter after this event fires (the commit
    // continues past `cellEditStop`), and clearing the seed under it made the
    // unchanged-commit guard re-freeze the formula. The seed is invalidated at
    // the next editor mount instead (`GridFormulaEditCell`), and its
    // id + field + exact-display-text match keeps a lingering one inert.
    // The editor-session mirror must not resume into a later edit, and the
    // plain-edit draft must not leak its text into one. This is the immediate
    // clear for the common cell-mode path; `pruneEditorSession` below covers
    // every path that never publishes `cellEditStop`.
    cache.editorSession = null;
    cache.plainEditDraft = null;
    // Turn off reference highlighting (the editor set it on mount; this is the
    // only thing that clears it — the editor unmounting from virtualization
    // must not).
    apiRef.current.setFormulaActiveEdit!(null);
  }, [apiRef]);

  // Drop the editor-session mirror once its cell is no longer being edited.
  // `cellEditStop` alone cannot be trusted with this: row edit mode and
  // programmatic/controlled stops never publish it, and with an async
  // `processRowUpdate` the commit key's `keyup` re-writes the mirror after the
  // `cellEditStop` clear (the editor stays mounted and focused until the
  // promise settles). Every one of those paths does update a modes model when
  // the cell finally leaves edit mode, so this is the authoritative clear.
  const pruneEditorSession = React.useCallback(() => {
    const cache = apiRef.current.caches.formula!;
    const session = cache.editorSession;
    if (
      session !== null &&
      apiRef.current.getCellMode(session.id, session.field) !== GridCellModes.Edit
    ) {
      cache.editorSession = null;
    }
    const draft = cache.plainEditDraft;
    if (
      draft !== null &&
      apiRef.current.getCellMode(draft.id, draft.field) !== GridCellModes.Edit
    ) {
      cache.plainEditDraft = null;
    }
  }, [apiRef]);

  // Arm the A1 paste origin: the first cell of the batch sets it, the rest
  // offset their relative references from it (Excel fill).
  const handleClipboardPasteStart = React.useCallback<GridEventListener<'clipboardPasteStart'>>(
    (params) => {
      apiRef.current.caches.formula!.pasteOrigin = null;
      apiRef.current.caches.formula!.pasteStartCell = params.startCell ?? null;
    },
    [apiRef],
  );

  // The formula editor floats in a surface portaled into the ROW, so the grid's
  // DOM-containment checks (`handleDocumentClick` compares the mouseup target
  // against the editing CELL element) do not recognize it as part of the editing
  // cell. Without this guard, a document mouseup landing inside the surface whose
  // mousedown did not record a cell (e.g. a drag-selection that started outside
  // the grid and was released over the editor) clears the cell focus, which stops
  // the edit mid-typing.
  const canUpdateFocus = React.useCallback<GridPipeProcessor<'canUpdateFocus'>>(
    (initialValue, { event }) => {
      const target = event.target as Element | null;
      if (target === null || typeof target.closest !== 'function') {
        return initialValue;
      }
      const surface = target.closest(`.${GRID_FORMULA_EDITOR_SURFACE_CLASS}`);
      // Scoped to THIS grid's own surface: with multiple grids on the page, a
      // click inside another grid's formula editor is an ordinary outside click
      // for this grid and must still clear/move its focus.
      if (surface !== null && apiRef.current.rootElementRef?.current?.contains(surface) === true) {
        return false;
      }
      // The formula bar holds DOM focus while the grid keeps the focused cell
      // "active" (Excel semantics), and a click released over the suggestion
      // popup (body-portaled) must not end the edit it belongs to: interactions
      // inside a registered focus-safe element must not clear the cell focus —
      // which would also stop an in-progress cell edit. Scoped per instance
      // through the registry (both can live outside the grid root, so root
      // containment cannot be the scope). Whenever the bar wants the focus to
      // move — Enter-commit to the cell below, Escape back to the cell — it
      // moves DOM focus itself.
      if (isFormulaFocusSafeTarget(apiRef, target)) {
        return false;
      }
      // A column drag-resize (or a stray separator click) must not end an active
      // formula edit: the resize-ending mouseup lands outside any cell, which
      // would clear the cell focus and commit a possibly half-typed formula. The
      // separator's own mousedown `preventDefault()`s, so the editor never loses
      // DOM focus; vetoing the focus clear is all it takes for the edit to
      // continue seamlessly (Sheets/Excel behavior). The gate checks the edited
      // cell's actual mode, not just `formula.activeEdit` — that flag is cleared
      // by `cellEditStop`, which row edit mode and programmatic stops never
      // publish, so alone it can go stale and arm the veto with no live edit.
      // Plain (non-formula) edits keep the stock grid semantics.
      const activeEdit = gridFormulaActiveEditSelector(apiRef);
      if (
        activeEdit !== null &&
        apiRef.current.getCellMode(activeEdit.id, activeEdit.field) === GridCellModes.Edit
      ) {
        // A drag-resize of this grid is in flight or just ended (the field is set
        // at `columnResizeStart` and cleared only in the post-mouseup
        // `columnResizeStop` timeout). This covers every release point — the drag
        // has no pointer capture, so the mouseup often lands off the ~10px
        // separator strip (vertical drift below the header, overshoot past the
        // min/max-width clamp, release outside the grid).
        if (gridResizingColumnFieldSelector(apiRef)) {
          return false;
        }
        // A separator click that never started a resize session. Scoped to this
        // grid's own separators: the NEAREST grid root must be ours, so a nested
        // grid's separator (e.g. in a detail panel) stays an ordinary outside
        // click for this grid.
        const separator = target.closest(`.${gridClasses.columnSeparator}`);
        if (
          separator !== null &&
          separator.closest(`.${gridClasses.root}`) === apiRef.current.rootElementRef?.current
        ) {
          return false;
        }
      }
      return initialValue;
    },
    [apiRef],
  );
  useGridRegisterPipeProcessor(apiRef, 'canUpdateFocus', canUpdateFocus);

  const addComputedColumnsPanel = React.useCallback<GridPipeProcessor<'sidebar'>>(
    (initialValue, value) => {
      if (computedColumnsEnabled && value === GridSidebarValue.ComputedColumns) {
        return <GridComputedColumnsPanel />;
      }
      return initialValue;
    },
    [computedColumnsEnabled],
  );
  useGridRegisterPipeProcessor(apiRef, 'sidebar', addComputedColumnsPanel);

  useGridEvent(apiRef, 'rowsSet', handleRowsSet);
  useGridEvent(apiRef, 'sortedRowsSet', handleSortedRowsSet);
  useGridEvent(apiRef, 'filteredRowsSet', handleFilteredRowsSet);
  useGridEvent(apiRef, 'columnVisibilityModelChange', handleColumnVisibilityModelChange);
  useGridEventPriority(apiRef, 'columnsChange', handleTypeChangedColumns);
  useGridEvent(apiRef, 'columnsChange', handleColumnsChange);
  useGridEvent(apiRef, 'filterModelChange', handleFilterModelChange);
  useGridEvent(apiRef, 'formulaEvaluated', handleFormulaEvaluated);
  useGridEvent(apiRef, 'cellDoubleClick', handleComputedCellDoubleClick);
  useGridEvent(apiRef, 'cellKeyDown', handleComputedCellKeyDown);
  useGridEvent(apiRef, 'cellEditStart', handleCellEditStart);
  useGridEvent(apiRef, 'cellEditStop', handleCellEditStop);
  useGridEvent(apiRef, 'cellModesModelChange', pruneEditorSession);
  useGridEvent(apiRef, 'rowModesModelChange', pruneEditorSession);
  useGridEvent(apiRef, 'clipboardPasteStart', handleClipboardPasteStart);

  /**
   * EFFECTS
   */
  const effectiveFormulaFunctions = getEffectiveFormulaFunctions(props);
  React.useEffect(() => {
    const cache = apiRef.current.caches.formula!;
    if (cache.registrySource === effectiveFormulaFunctions) {
      return;
    }
    // Inline `formulaFunctions={{ ... }}` props change identity on every
    // parent render — only rebuild when a definition actually changed.
    const sameDefinitions = areFormulaFunctionRecordsEqual(
      cache.registrySource,
      effectiveFormulaFunctions,
    );
    cache.registrySource = effectiveFormulaFunctions;
    if (sameDefinitions) {
      return;
    }
    cache.registry = createFormulaFunctionRegistry(Object.values(effectiveFormulaFunctions));
    const computedColumnsChanged = cache.computedColumns.records.size > 0;
    if (computedColumnsChanged) {
      // The validity of the computed columns depends on the registry (unknown functions),
      // and the definitions are validated when the columns are hydrated.
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
      resetComputedResults(cache);
    }
    // The revision also stands for the registry: the computed column editor reads it
    // for its preview and its function list, with or without a stored computed column.
    bumpComputedColumnsRevision(apiRef);
    triggerDependentFeatures(runPass('full'), {
      aggregation: true,
      rowSpanning: true,
      computedColumnsChanged,
    });
  }, [apiRef, effectiveFormulaFunctions, runPass, triggerDependentFeatures]);

  // After the effects that hydrate the columns for another prop (the model, `formulaFunctions`):
  // their pass already applies the current `computedColDef`, read lazily by the processor.
  React.useEffect(() => {
    const cache = apiRef.current.caches.formula!;
    // While the computed columns are off, the hydration that removes them is pending, and the
    // records are created from the current prop when they come back.
    if (
      !computedColumnsEnabled ||
      gridPivotActiveSelector(apiRef) ||
      cache.computedColumns.computedColDef === props.computedColDef
    ) {
      return;
    }
    if (haveComputedColDefOverridesChanged(cache, props.computedColDef)) {
      // The overrides don't change the values: the results are kept.
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    } else {
      // Same overrides for every record: the next hydration doesn't need to resolve them again.
      cache.computedColumns.computedColDef = props.computedColDef;
    }
  }, [apiRef, computedColumnsEnabled, props.computedColDef]);

  const isFirstEnablementEffect = React.useRef(true);
  React.useEffect(() => {
    if (isFirstEnablementEffect.current) {
      isFirstEnablementEffect.current = false;
      return;
    }
    apiRef.current.reevaluateFormulas!();
  }, [apiRef, props.disableFormulas, props.dataSource]);

  const hasKickedInitialRegroup = React.useRef(false);
  React.useEffect(() => {
    if (hasKickedInitialRegroup.current) {
      return;
    }
    hasKickedInitialRegroup.current = true;
    // The initial row tree is built during rows state initialization, before
    // the initial formula evaluation — when a grouped column holds formula
    // results, rebuild the tree once so group keys use evaluated values.
    const lookup = gridFormulaLookupSelector(apiRef);
    const initialCells: GridCellCoordinates[] = [];
    for (const rowKey of Object.keys(lookup)) {
      for (const field of Object.keys(lookup[rowKey])) {
        initialCells.push({ id: rowKey, field });
      }
    }
    triggerDependentFeatures(initialCells, { aggregation: false, rowSpanning: false });
  }, [apiRef, triggerDependentFeatures]);
};
