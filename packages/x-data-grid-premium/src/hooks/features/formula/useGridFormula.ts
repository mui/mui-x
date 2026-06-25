'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import {
  GridCellEditStartReasons,
  gridColumnLookupSelector,
  gridRowIdSelector,
  gridRowsLookupSelector,
  useGridApiMethod,
  useGridEvent,
} from '@mui/x-data-grid-pro';
import type { GridCellCoordinates, GridEventListener } from '@mui/x-data-grid-pro';
import {
  gridPivotActiveSelector,
  GridStrategyGroup,
  RowGroupingStrategy,
} from '@mui/x-data-grid-pro/internals';
import type { GridStateInitializer } from '@mui/x-data-grid-pro/internals';
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
  GridFormulaApi,
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
  areColumnsSignaturesEqual,
  areFormulaFieldsEqual,
  areFormulaFunctionRecordsEqual,
  computeColumnsSignature,
  createFormulaInternalCache,
  getFormulaFields,
  resetFormulaEvaluationCache,
} from './gridFormulaUtils';

export const formulaStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'formulaFunctions' | 'disableFormulas' | 'dataSource'>,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  const cache = createFormulaInternalCache(props.formulaFunctions);
  apiRef.current.caches.formula = cache;

  const premiumState = state as Partial<GridStatePremium>;
  const columnsLookup = premiumState.columns?.lookup ?? {};
  cache.lastColumnsSignature = computeColumnsSignature(columnsLookup);
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

  return { ...state, formula: { lookup, activeEdit: null } };
};

export const useGridFormula = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'disableFormulas' | 'formulaFunctions' | 'dataSource'>,
) => {
  const computeEffectiveFormulaFields = React.useCallback(() => {
    if (props.disableFormulas || props.dataSource || gridPivotActiveSelector(apiRef)) {
      return [];
    }
    return getFormulaFields(gridColumnLookupSelector(apiRef));
  }, [apiRef, props.disableFormulas, props.dataSource]);

  const runPass = React.useCallback(
    (mode: 'diff' | 'full' | 'rebind'): GridCellCoordinates[] | null => {
      const cache = apiRef.current.caches.formula;
      const formulaFields = computeEffectiveFormulaFields();
      const previousLookup = gridFormulaLookupSelector(apiRef);

      if (formulaFields.length === 0) {
        if (
          process.env.NODE_ENV !== 'production' &&
          !props.disableFormulas &&
          getFormulaFields(gridColumnLookupSelector(apiRef)).length > 0
        ) {
          if (props.dataSource) {
            warnOnce([
              'MUI X Data Grid: Formulas are not supported with the `dataSource` prop.',
              'The `allowFormulas` column option is ignored and `=` cell values render as raw strings.',
            ]);
          } else if (gridPivotActiveSelector(apiRef)) {
            warnOnce([
              'MUI X Data Grid: Formulas are not supported while pivoting is active.',
              'Formula evaluation is paused and resumes when pivoting is deactivated.',
            ]);
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
        apiRef.current.publishEvent('formulaEvaluationEnd', { changedCells });
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
      apiRef.current.publishEvent('formulaEvaluationEnd', { changedCells: result.changedCells });
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
   */
  const triggerDependentFeatures = React.useCallback(
    (
      changedCells: GridCellCoordinates[] | null,
      options: { aggregation: boolean; rowSpanning: boolean },
    ) => {
      if (changedCells === null || changedCells.length === 0) {
        return;
      }
      if (options.aggregation) {
        apiRef.current.applyAggregation();
      }
      if (options.rowSpanning) {
        apiRef.current.resetRowSpanningState();
      }
      const cache = apiRef.current.caches.formula;
      if (cache.suppressRegroupTrigger) {
        return;
      }
      if (
        apiRef.current.getActiveStrategy(GridStrategyGroup.RowTree) !== RowGroupingStrategy.Default
      ) {
        return;
      }
      const groupedFields = gridRowGroupingSanitizedModelSelector(apiRef);
      if (groupedFields.length === 0) {
        return;
      }
      if (!changedCells.some((cell) => groupedFields.includes(cell.field))) {
        return;
      }
      cache.suppressRegroupTrigger = true;
      try {
        apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
      } finally {
        cache.suppressRegroupTrigger = false;
      }
    },
    [apiRef],
  );

  /**
   * API METHODS
   */
  const setCellFormula = React.useCallback<GridFormulaApi['setCellFormula']>(
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

  const getCellFormula = React.useCallback<GridFormulaApi['getCellFormula']>(
    (id, field) => {
      const raw = apiRef.current.getRow(id)?.[field];
      return isFormulaSource(raw) ? raw : null;
    },
    [apiRef],
  );

  const getCellFormulaResult = React.useCallback<GridFormulaApi['getCellFormulaResult']>(
    (id, field) => gridCellFormulaResultSelector(apiRef, { id, field }),
    [apiRef],
  );

  const validateCellFormula = React.useCallback<GridFormulaApi['validateCellFormula']>(
    (formula) =>
      validateFormulaExpression(getFormulaExpression(typeof formula === 'string' ? formula : ''), {
        functions: apiRef.current.caches.formula.registry,
      }),
    [apiRef],
  );

  const applyFormulaEvaluation = React.useCallback<
    GridFormulaPrivateApi['applyFormulaEvaluation']
  >(() => {
    // Aggregation, row spanning and grouping consumed formula values through
    // `getRowValue` — refresh them after passes that are not part of a rows
    // update cascade (registry change, enablement toggle, `reevaluateFormulas`).
    triggerDependentFeatures(runPass('full'), { aggregation: true, rowSpanning: true });
  }, [runPass, triggerDependentFeatures]);

  const reevaluateFormulas = React.useCallback<GridFormulaApi['reevaluateFormulas']>(() => {
    apiRef.current.applyFormulaEvaluation();
  }, [apiRef]);

  const setFormulaActiveEdit = React.useCallback<GridFormulaPrivateApi['setFormulaActiveEdit']>(
    (cell) => {
      const current = gridFormulaActiveEditSelector(apiRef);
      const unchanged =
        cell === null
          ? current === null
          : current !== null && current.id === cell.id && current.field === cell.field;
      // The editor effect re-asserts the same cell on every (re)mount — skip the
      // redundant state write so virtualization remounts do not churn renders.
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

  const formulaApi: GridFormulaApi = {
    setCellFormula,
    getCellFormula,
    getCellFormulaResult,
    validateCellFormula,
    reevaluateFormulas,
  };

  const formulaPrivateApi: GridFormulaPrivateApi = {
    applyFormulaEvaluation,
    setFormulaActiveEdit,
  };

  useGridApiMethod(apiRef, formulaApi, 'public');
  useGridApiMethod(apiRef, formulaPrivateApi, 'private');

  /**
   * EVENTS
   */
  const handleRowsSet = React.useCallback<GridEventListener<'rowsSet'>>(() => {
    // Synchronous on purpose: the filtering and sorting `rowsSet` handlers run
    // after this one in the same cascade and must read fresh formula values.
    // No aggregation/row-spanning refresh: both recompute later in the
    // cascade, on `filteredRowsSet`/`sortedRowsSet`.
    triggerDependentFeatures(runPass('diff'), { aggregation: false, rowSpanning: false });
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

  const handleColumnsChange = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    const cache = apiRef.current.caches.formula;
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
      return;
    }
    cache.lastColumnsSignature = columnsSignature;
    if (fieldsChanged) {
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }
    // Row spanning resets on `columnsChange` after this handler.
    triggerDependentFeatures(runPass('full'), { aggregation: true, rowSpanning: false });
  }, [apiRef, computeEffectiveFormulaFields, runPass, triggerDependentFeatures]);

  const handleCellEditStart = React.useCallback<GridEventListener<'cellEditStart'>>(
    (params, event) => {
      const isPrintableKeyDown = params.reason === GridCellEditStartReasons.printableKeyDown;
      apiRef.current.caches.formula.lastCellEditStart = {
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
    const cache = apiRef.current.caches.formula;
    cache.lastCellEditStart = null;
    // A1 seed is consumed by the commit parser; clear it so it cannot affect a
    // later edit of the same cell.
    cache.lastA1Seed = null;
    // Turn off reference highlighting (the editor set it on mount; this is the
    // only thing that clears it — the editor unmounting from virtualization
    // must not).
    apiRef.current.setFormulaActiveEdit(null);
  }, [apiRef]);

  // Arm the A1 paste origin: the first cell of the batch sets it, the rest
  // offset their relative references from it (Excel fill).
  const handleClipboardPasteStart = React.useCallback(() => {
    apiRef.current.caches.formula.pasteOrigin = null;
  }, [apiRef]);

  useGridEvent(apiRef, 'rowsSet', handleRowsSet);
  useGridEvent(apiRef, 'sortedRowsSet', handleSortedRowsSet);
  useGridEvent(apiRef, 'filteredRowsSet', handleFilteredRowsSet);
  useGridEvent(apiRef, 'columnVisibilityModelChange', handleColumnVisibilityModelChange);
  useGridEvent(apiRef, 'columnsChange', handleColumnsChange);
  useGridEvent(apiRef, 'cellEditStart', handleCellEditStart);
  useGridEvent(apiRef, 'cellEditStop', handleCellEditStop);
  useGridEvent(apiRef, 'clipboardPasteStart', handleClipboardPasteStart);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    const cache = apiRef.current.caches.formula;
    if (cache.registrySource === props.formulaFunctions) {
      return;
    }
    // Inline `formulaFunctions={{ ... }}` props change identity on every
    // parent render — only rebuild when a definition actually changed.
    const sameDefinitions = areFormulaFunctionRecordsEqual(
      cache.registrySource,
      props.formulaFunctions,
    );
    cache.registrySource = props.formulaFunctions;
    if (sameDefinitions) {
      return;
    }
    cache.registry = createFormulaFunctionRegistry(Object.values(props.formulaFunctions));
    apiRef.current.applyFormulaEvaluation();
  }, [apiRef, props.formulaFunctions]);

  const isFirstEnablementEffect = React.useRef(true);
  React.useEffect(() => {
    if (isFirstEnablementEffect.current) {
      isFirstEnablementEffect.current = false;
      return;
    }
    apiRef.current.applyFormulaEvaluation();
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
