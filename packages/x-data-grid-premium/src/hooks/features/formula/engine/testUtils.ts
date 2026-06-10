import type { FormulaEvaluationContext } from './formulaEvaluator';
import { createFormulaFunctionRegistry, FORMULA_BUILT_IN_FUNCTIONS } from './formulaFunctions';
import type { FormulaFunctionDefinition } from './formulaFunctions';
import type {
  FormulaCellRef,
  FormulaPositionContext,
  FormulaRowId,
  FormulaScalar,
} from './formulaTypes';
import { isFormulaErrorValue } from './formulaErrors';
import type { FormulaErrorValue } from './formulaErrors';

export interface TestRow {
  id: FormulaRowId;
  [field: string]: unknown;
}

export interface CreateTestContextOptions {
  currentCell?: FormulaCellRef;
  customFunctions?: FormulaFunctionDefinition[];
  /**
   * Row order of the position context; defaults to the `rows` array order.
   */
  rowOrder?: FormulaRowId[];
  /**
   * Spy invoked for every resolver read.
   * @param {FormulaCellRef} ref The cell being resolved.
   */
  onGetCellValue?: (ref: FormulaCellRef) => void;
}

export function createTestPositionContext(
  rowIds: FormulaRowId[],
  fields: string[],
  version = 0,
): FormulaPositionContext {
  // Ids are matched under string coercion, like the real grid's row lookup
  // and the engine's cell-key format.
  const rowIdToPosition = new Map<string, number>();
  rowIds.forEach((id, index) => rowIdToPosition.set(String(id), index + 1));
  const fieldToPosition = new Map<string, number>();
  fields.forEach((field, index) => fieldToPosition.set(field, index + 1));
  return {
    version,
    rowCount: rowIds.length,
    columnCount: fields.length,
    getRowIdAtPosition: (index) => rowIds[index - 1],
    getPositionOfRowId: (id) => rowIdToPosition.get(String(id)),
    getFieldAtPosition: (index) => fields[index - 1],
    getPositionOfField: (field) => fieldToPosition.get(field),
  };
}

/**
 * Builds a fake `FormulaEvaluationContext` over plain row objects.
 * Values resolve straight from the row data; formula strings are NOT
 * evaluated recursively (the adapter's topological recompute owns that),
 * which keeps these tests focused on single-formula behavior.
 */
export function createTestContext(
  rows: TestRow[],
  visibleFields?: string[],
  options: CreateTestContextOptions = {},
): FormulaEvaluationContext {
  const fields =
    visibleFields ??
    Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => key !== 'id'))));
  // Ids are matched under string coercion, like the real grid's row lookup
  // (a plain object keyed by row id) and the engine's cell-key format.
  const rowsById = new Map<string, TestRow>(rows.map((row) => [String(row.id), row]));
  if (rowsById.size !== rows.length) {
    throw /* minify-error-disabled */ new Error(
      'createTestContext: two fixture rows share a string-coerced id.',
    );
  }
  const rowOrder = options.rowOrder ?? rows.map((row) => row.id);
  const fieldSet = new Set(fields);

  return {
    currentCell: options.currentCell ?? { id: rows[0]?.id ?? 0, field: fields[0] ?? '' },
    getCellValue: (ref) => {
      options.onGetCellValue?.(ref);
      const value = rowsById.get(String(ref.id))?.[ref.field];
      if (isFormulaErrorValue(value)) {
        return value as FormulaErrorValue;
      }
      return (value ?? null) as FormulaScalar;
    },
    hasRow: (id) => rowsById.has(String(id)),
    hasField: (field) => fieldSet.has(field),
    position: createTestPositionContext(rowOrder, fields),
    // The helper's contract is "built-ins plus extras" (the registry itself
    // has replacement semantics).
    functions: createFormulaFunctionRegistry(
      options.customFunctions
        ? [...FORMULA_BUILT_IN_FUNCTIONS, ...options.customFunctions]
        : undefined,
    ),
  };
}
