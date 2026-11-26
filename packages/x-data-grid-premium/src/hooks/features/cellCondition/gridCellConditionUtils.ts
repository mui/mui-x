import type { RefObject } from '@mui/x-internals/types';
import type { GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type {
  GridCellCondition,
  GridCellConditionValue,
  GridCellTextCondition,
  GridCellValueCondition,
} from './gridCellConditionInterfaces';

type Comparable =
  | { kind: 'number'; value: number }
  | { kind: 'date'; value: number }
  | { kind: 'string'; value: string };

const toComparable = (value: unknown): Comparable | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? { kind: 'number', value } : null;
  }
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : { kind: 'date', value: time };
  }
  if (typeof value === 'string') {
    return { kind: 'string', value: value.toLowerCase() };
  }
  return null;
};

const compare = (a: number | string, b: number | string) => {
  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
};

const NEGATED_OPERATORS = {
  notEqual: 'equal',
  notBetween: 'between',
  notContains: 'contains',
  isNotEmpty: 'isEmpty',
} as const;

function matchesValueCondition(condition: GridCellValueCondition, cellValue: unknown): boolean {
  const { operator } = condition;
  if (operator === 'notEqual' || operator === 'notBetween') {
    return !matchesValueCondition(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cellValue,
    );
  }
  const conditionValue = toComparable(condition.value);
  const value = toComparable(cellValue);
  if (conditionValue === null || value === null || conditionValue.kind !== value.kind) {
    return false;
  }
  const order = compare(value.value, conditionValue.value);
  switch (operator) {
    case 'equal':
      return order === 0;
    case 'greaterThan':
      return order > 0;
    case 'greaterThanOrEqual':
      return order >= 0;
    case 'lessThan':
      return order < 0;
    case 'lessThanOrEqual':
      return order <= 0;
    case 'between': {
      const upper = toComparable(condition.valueTo);
      return (
        upper !== null && upper.kind === value.kind && order >= 0 && value.value <= upper.value
      );
    }
    default:
      return false;
  }
}

const toText = (value: unknown) => (value == null ? '' : String(value));

function matchesTextCondition(condition: GridCellTextCondition, cellValue: unknown): boolean {
  const { operator } = condition;
  if (operator === 'notContains' || operator === 'isNotEmpty') {
    return !matchesTextCondition(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cellValue,
    );
  }
  const text = toText(cellValue).toLowerCase();
  const search = toText(condition.value).toLowerCase();
  switch (operator) {
    case 'contains':
      return text.includes(search);
    case 'startsWith':
      return text.startsWith(search);
    case 'endsWith':
      return text.endsWith(search);
    case 'isEmpty':
      // Excel's `TRIM` only removes spaces.
      return /^ *$/.test(text);
    default:
      return false;
  }
}

/**
 * Rules restored from untrusted data may hold anything in place of a condition.
 */
export const isGridCellCondition = (condition: unknown): condition is GridCellCondition =>
  typeof condition === 'object' &&
  condition !== null &&
  ['cell', 'text', 'formula'].includes((condition as GridCellCondition).type);

/**
 * @returns {boolean} `true` when the value matches a `cell` or `text` condition. `false` for a `formula` condition.
 */
export function matchesGridCellConditionValue(
  condition: GridCellCondition,
  cellValue: unknown,
): boolean {
  if (condition.type === 'cell') {
    return matchesValueCondition(condition, cellValue);
  }
  if (condition.type === 'text') {
    return matchesTextCondition(condition, cellValue);
  }
  return false;
}

/**
 * Tests a cell. A `formula` condition reads the row, and does not match without the formula feature.
 * @param {GridCellCondition} condition The condition.
 * @param {unknown} cellValue The value `cell` and `text` conditions read.
 * @param {GridValidRowModel} row The row `formula` conditions read.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @returns {boolean} `true` when the cell matches.
 */
export function matchesGridCellCondition(
  condition: GridCellCondition,
  cellValue: unknown,
  row: GridValidRowModel,
  apiRef: RefObject<GridPrivateApiPremium>,
): boolean {
  if (condition.type === 'formula') {
    return apiRef.current.evaluateCellFormulaCondition?.(condition.formula, row) ?? false;
  }
  return matchesGridCellConditionValue(condition, cellValue);
}

const toExcelString = (value: string) => `"${value.replace(/"/g, '""')}"`;

const toExcelLiteral = (value: GridCellConditionValue | undefined): string | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : null;
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }
    // Local components, like the date cells of the export.
    return `(DATE(${value.getFullYear()},${value.getMonth() + 1},${value.getDate()})+TIME(${value.getHours()},${value.getMinutes()},${value.getSeconds()}))`;
  }
  if (typeof value === 'string') {
    return toExcelString(value);
  }
  return null;
};

const EXCEL_OPERATORS = {
  equal: '=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  lessThan: '<',
  lessThanOrEqual: '<=',
} as const;

function getValueConditionExcelFormula(
  condition: GridCellValueCondition,
  cell: string,
): string | null {
  const { operator } = condition;
  if (operator === 'notEqual' || operator === 'notBetween') {
    const formula = getValueConditionExcelFormula(
      { ...condition, operator: NEGATED_OPERATORS[operator] },
      cell,
    );
    return formula === null ? null : `NOT(${formula})`;
  }
  const value = toExcelLiteral(condition.value);
  if (value === null) {
    return null;
  }
  // Excel compares text and numbers across types (text is greater than any
  // number, a blank cell is 0): the guard matches the grid, where they never match.
  const guard = typeof condition.value === 'string' ? `ISTEXT(${cell})` : `ISNUMBER(${cell})`;
  if (operator === 'between') {
    const upper = toExcelLiteral(condition.valueTo);
    const isTextRange = typeof condition.value === 'string';
    if (upper === null || isTextRange !== (typeof condition.valueTo === 'string')) {
      return null;
    }
    return `AND(${guard},${cell}>=${value},${cell}<=${upper})`;
  }
  // The condition can be restored from untrusted data: never read a prototype key.
  if (!Object.prototype.hasOwnProperty.call(EXCEL_OPERATORS, operator)) {
    return null;
  }
  return `AND(${guard},${cell}${EXCEL_OPERATORS[operator as keyof typeof EXCEL_OPERATORS]}${value})`;
}

function getTextConditionExcelFormula(
  condition: GridCellTextCondition,
  cell: string,
): string | null {
  const text = toText(condition.value);
  switch (condition.operator) {
    case 'contains':
    case 'notContains': {
      // `SEARCH` reads `*`, `?` and `~` as wildcards.
      const formula = `ISNUMBER(SEARCH(${toExcelString(text.replace(/[~*?]/g, '~$&'))},${cell}))`;
      return condition.operator === 'contains' ? formula : `NOT(${formula})`;
    }
    case 'startsWith':
      return `LEFT(${cell},${text.length})=${toExcelString(text)}`;
    case 'endsWith':
      return `RIGHT(${cell},${text.length})=${toExcelString(text)}`;
    case 'isEmpty':
      return `LEN(TRIM(${cell}))=0`;
    case 'isNotEmpty':
      return `LEN(TRIM(${cell}))>0`;
    default:
      return null;
  }
}

const isDateColumn = (type: string | undefined) => type === 'date' || type === 'dateTime';

/**
 * The Excel formula of a `cell` or `text` condition, relative to `cell`. `null` for a `formula`
 * condition, and when the condition cannot be exported or never matches the column.
 * @param {GridCellCondition} condition The condition.
 * @param {string} cell The A1 address the formula is written for, like `B2`.
 * @param {string | undefined} columnType The type of the column of the cell.
 * @returns {string | null} The formula, without the leading `=`.
 */
export function getGridCellConditionExcelFormula(
  condition: GridCellCondition,
  cell: string,
  columnType: string | undefined,
): string | null {
  if (condition.type === 'text') {
    return getTextConditionExcelFormula(condition, cell);
  }
  if (condition.type !== 'cell') {
    return null;
  }
  // Excel stores dates as numbers: keep number conditions off date columns and the reverse, as in the grid.
  const isDate = isDateColumn(columnType);
  if (
    (condition.value instanceof Date && !isDate) ||
    (typeof condition.value === 'number' && isDate)
  ) {
    return null;
  }
  return getValueConditionExcelFormula(condition, cell);
}
