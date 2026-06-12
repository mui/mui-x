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
import { gridPivotActiveSelector, type GridStateInitializer } from '@mui/x-data-grid-pro/internals';
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
  computeRowsDiffFormulaPass,
  type FormulaPassContext,
} from './createFormulaEvaluation';
import type {
  GridFormulaApi,
  GridFormulaLookup,
  GridFormulaPrivateApi,
} from './gridFormulaInterfaces';
import { gridCellFormulaResultSelector, gridFormulaLookupSelector } from './gridFormulaSelectors';
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
    }).lookup;
  }

  return { ...state, formula: { lookup } };
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
    (mode: 'diff' | 'full'): boolean => {
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
          return false;
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
        return true;
      }

      const ctx: FormulaPassContext = {
        apiRef,
        cache,
        rowsLookup: gridRowsLookupSelector(apiRef),
        columnsLookup: gridColumnLookupSelector(apiRef),
        formulaFields,
        previousLookup,
      };
      const result =
        mode === 'full' ? computeFullFormulaPass(ctx) : computeRowsDiffFormulaPass(ctx);
      if (result === null || result.changedCells.length === 0) {
        return false;
      }
      apiRef.current.setState((state) => ({
        ...state,
        formula: { ...state.formula, lookup: result.lookup },
      }));
      apiRef.current.publishEvent('formulaEvaluationEnd', { changedCells: result.changedCells });
      return true;
    },
    [apiRef, computeEffectiveFormulaFields, props.disableFormulas, props.dataSource],
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
    if (runPass('full')) {
      // Aggregation reads formula values through `getRowValue` — refresh it
      // after passes that are not part of a rows update cascade.
      apiRef.current.applyAggregation();
    }
  }, [apiRef, runPass]);

  const reevaluateFormulas = React.useCallback<GridFormulaApi['reevaluateFormulas']>(() => {
    apiRef.current.applyFormulaEvaluation();
  }, [apiRef]);

  const formulaApi: GridFormulaApi = {
    setCellFormula,
    getCellFormula,
    getCellFormulaResult,
    validateCellFormula,
    reevaluateFormulas,
  };

  const formulaPrivateApi: GridFormulaPrivateApi = {
    applyFormulaEvaluation,
  };

  useGridApiMethod(apiRef, formulaApi, 'public');
  useGridApiMethod(apiRef, formulaPrivateApi, 'private');

  /**
   * EVENTS
   */
  const handleRowsSet = React.useCallback<GridEventListener<'rowsSet'>>(() => {
    // Synchronous on purpose: the filtering and sorting `rowsSet` handlers run
    // after this one in the same cascade and must read fresh formula values.
    runPass('diff');
  }, [runPass]);

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
      return;
    }
    cache.lastColumnsSignature = columnsSignature;
    if (fieldsChanged) {
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
    }
    if (runPass('full')) {
      apiRef.current.applyAggregation();
    }
  }, [apiRef, computeEffectiveFormulaFields, runPass]);

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
    apiRef.current.caches.formula.lastCellEditStart = null;
  }, [apiRef]);

  useGridEvent(apiRef, 'rowsSet', handleRowsSet);
  useGridEvent(apiRef, 'columnsChange', handleColumnsChange);
  useGridEvent(apiRef, 'cellEditStart', handleCellEditStart);
  useGridEvent(apiRef, 'cellEditStop', handleCellEditStop);

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
};
