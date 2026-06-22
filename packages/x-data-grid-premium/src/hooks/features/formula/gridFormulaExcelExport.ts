import type { GridRowId } from '@mui/x-data-grid-pro';
import type { GridStateColDef } from '@mui/x-data-grid/internals';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  columnIndexToLetters,
  getFormulaExpression,
  mapFormulaErrorCodeToExcel,
  serializeFormulaAstToExcel,
  type ExcelFormulaErrorCode,
  type FormulaColumnSelector,
  type FormulaPositionContext,
  type FormulaRowId,
  type FormulaRowSelector,
} from './engine';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';

/**
 * The cached `result` written alongside an exported Excel formula. Structurally
 * compatible with the exceljs fork's formula-cell value (`{ formula, result }`).
 */
export type ExcelFormulaResult =
  | number
  | string
  | boolean
  | Date
  | null
  | { error: ExcelFormulaErrorCode };

/**
 * One exported formula cell: the A1 formula string (without a leading `=` —
 * exceljs writes it verbatim into the `<f>` element) and its cached result,
 * ready to assign to `cell.value`.
 */
export interface ExcelFormulaCell {
  formula: string;
  result: ExcelFormulaResult;
}

/**
 * Maps grid identities to their coordinates in the *exported* sheet. Built once
 * per export: the export's own column/row order and header-row offset differ
 * from the grid's visible order, so the A1 references baked into formulas must be
 * computed against this layout, not the live position context.
 *
 * `null` from `createFormulaExcelExportLayout` means no exported column accepts
 * formulas, so the serializer skips all formula work and the output is identical
 * to a value-only export.
 */
export interface FormulaExcelExportLayout {
  /** Live position context — resolves positional (`$`-absolute) refs to an identity. */
  positionContext: FormulaPositionContext;
  /** field -> Excel column letter, in export order (`A`, `B`, …). */
  fieldToColumnLetter: Map<string, string>;
  /** stringified row id -> 1-based Excel row number (header offset included). */
  rowIdToRowNumber: Map<string, number>;
  firstDataRowNumber: number;
  lastDataRowNumber: number;
}

export function createFormulaExcelExportLayout(
  apiRef: RefObject<GridPrivateApiPremium>,
  columns: GridStateColDef[],
  rowIds: GridRowId[],
  options: { includeHeaders: boolean; includeColumnGroupsHeaders: boolean },
): FormulaExcelExportLayout | null {
  const hasFormulaColumn = columns.some(
    (column) => apiRef.current.getColumn(column.field)?.allowFormulas === true,
  );
  if (!hasFormulaColumn) {
    return null;
  }

  // Group-header rows = the deepest column-group path among exported columns
  // (mirrors `addColumnGroupingHeaders`), plus one row for the column headers.
  let groupHeaderRows = 0;
  if (options.includeColumnGroupsHeaders) {
    for (let i = 0; i < columns.length; i += 1) {
      groupHeaderRows = Math.max(
        groupHeaderRows,
        apiRef.current.getColumnGroupPath(columns[i].field).length,
      );
    }
  }
  const headerOffset = groupHeaderRows + (options.includeHeaders ? 1 : 0);

  const fieldToColumnLetter = new Map<string, string>();
  columns.forEach((column, index) => {
    fieldToColumnLetter.set(column.field, columnIndexToLetters(index + 1));
  });

  const rowIdToRowNumber = new Map<string, number>();
  rowIds.forEach((id, index) => {
    rowIdToRowNumber.set(String(id), headerOffset + 1 + index);
  });

  return {
    positionContext: gridFormulaA1PositionContextSelector(apiRef),
    fieldToColumnLetter,
    rowIdToRowNumber,
    firstDataRowNumber: headerOffset + 1,
    lastDataRowNumber: headerOffset + rowIds.length,
  };
}

/**
 * Computes the Excel formula cell to write for `(id, field)`, or `null` when the
 * cell is not a live formula (the caller then keeps the evaluated value).
 *
 * Returns `null` when:
 * - the cell has no evaluated formula result (`getCellFormulaResult` is the
 *   authoritative gate — covers `allowFormulas`, `disableFormulas`/`dataSource`/
 *   pivot, and a genuine `=` value, and rejects a literal `=text` in a plain
 *   column);
 * - the canonical source is missing or fails to parse (defensive — stored
 *   canonical formulas should always parse).
 *
 * References to cells outside the export bake `#REF!` into the formula and the
 * result becomes `{ error: '#REF!' }` (never silently dropped).
 */
export function getCellExcelFormula(
  apiRef: RefObject<GridPrivateApiPremium>,
  layout: FormulaExcelExportLayout,
  id: GridRowId,
  field: string,
): ExcelFormulaCell | null {
  const result = apiRef.current.getCellFormulaResult(id, field);
  if (result === null) {
    return null;
  }
  const source = apiRef.current.getCellFormula(id, field);
  if (source === null) {
    return null;
  }
  // Reuse the grid's interning parser: every formula's AST was already interned
  // during evaluation, so each export parse is a cache hit — no re-parsing across
  // rows that share a formula.
  const { ast } = apiRef.current.caches.formula.parser.parse(getFormulaExpression(source));
  if (ast === null) {
    return null;
  }
  const ownerRowNumber = layout.rowIdToRowNumber.get(String(id));
  if (ownerRowNumber === undefined) {
    return null;
  }

  const resolveColumn = (selector: FormulaColumnSelector) => {
    let resolvedField: string | undefined;
    let absolute: boolean;
    if (selector.kind === 'field') {
      resolvedField = selector.field;
      absolute = false;
    } else {
      // Positional refs were authored against the visible order: resolve the
      // index to an identity there, then map that identity to the export sheet.
      resolvedField = layout.positionContext.getFieldAtPosition(selector.index);
      absolute = true;
    }
    if (resolvedField === undefined) {
      return null;
    }
    const letter = layout.fieldToColumnLetter.get(resolvedField);
    return letter === undefined ? null : { letter, absolute };
  };

  const resolveRow = (selector: FormulaRowSelector) => {
    let resolvedId: FormulaRowId | undefined;
    let absolute: boolean;
    if (selector.kind === 'id') {
      resolvedId = selector.id;
      absolute = false;
    } else {
      resolvedId = layout.positionContext.getRowIdAtPosition(selector.index);
      absolute = true;
    }
    if (resolvedId === undefined) {
      return null;
    }
    const number = layout.rowIdToRowNumber.get(String(resolvedId));
    return number === undefined ? null : { number, absolute };
  };

  const { formula, hasRefError } = serializeFormulaAstToExcel(ast, {
    resolveColumn,
    resolveRow,
    ownerRowNumber,
    firstDataRowNumber: layout.firstDataRowNumber,
    lastDataRowNumber: layout.lastDataRowNumber,
  });

  let excelResult: ExcelFormulaResult;
  if (hasRefError) {
    excelResult = { error: '#REF!' };
  } else if (result.type === 'error') {
    excelResult = { error: mapFormulaErrorCodeToExcel(result.code) };
  } else if (result.value instanceof Date) {
    // Excel sheets are timezone-naive: rebuild the date from its local components
    // as UTC, matching the plain date/dateTime export path, so a date-valued
    // formula and a plain date column produce the same serial.
    const value = result.value;
    excelResult = new Date(
      Date.UTC(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
      ),
    );
  } else {
    excelResult = result.value;
  }

  // exceljs expects the bare formula (no leading `=`) — it is written verbatim
  // into the `<f>` element.
  return { formula, result: excelResult };
}
