import { createFormulaError } from './formulaErrors';
import type { FormulaErrorValue } from './formulaErrors';
import type { FormulaBinaryOperator } from './formulaAst';

/**
 * Strict numeric string: optional sign, decimal point with `.` only, optional exponent.
 * Deliberately rejects `0x10`, `Infinity`, thousands separators and empty strings.
 */
const NUMERIC_STRING_REGEX = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

/**
 * Coercion to the numeric context (`+ - * / ^`, math functions).
 * number -> itself; string -> trimmed strict parse; boolean -> 1/0;
 * empty -> 0; Date -> epoch milliseconds (documented deviation from Excel serial dates).
 */
export function toFormulaNumber(value: unknown): number | FormulaErrorValue {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return createFormulaError('#VALUE!', 'The value is not a finite number.');
    }
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (NUMERIC_STRING_REGEX.test(trimmed)) {
      return parseFloat(trimmed);
    }
    return createFormulaError('#VALUE!', `Cannot convert "${value}" to a number.`);
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (value === null || value === undefined) {
    return 0;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return createFormulaError('#VALUE!', 'Cannot convert the value to a number.');
}

/**
 * Coercion to the text context (`&`, text functions).
 * Numbers serialize with `.` decimal separator, locale-independent.
 */
export function toFormulaText(value: unknown): string | FormulaErrorValue {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return createFormulaError('#VALUE!', 'Cannot convert the value to text.');
}

/**
 * Coercion to the boolean context (IF condition, AND/OR/NOT).
 */
export function toFormulaBoolean(value: unknown): boolean | FormulaErrorValue {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return createFormulaError('#VALUE!', 'The value is not a valid number.');
    }
    return value !== 0;
  }
  if (typeof value === 'string') {
    const upper = value.trim().toUpperCase();
    if (upper === 'TRUE') {
      return true;
    }
    if (upper === 'FALSE') {
      return false;
    }
    return createFormulaError('#VALUE!', `Cannot convert "${value}" to a boolean.`);
  }
  if (value === null || value === undefined) {
    return false;
  }
  return createFormulaError('#VALUE!', 'Cannot convert the value to a boolean.');
}

/**
 * Empty-cell test: `null`/`undefined` are empty; `0`, `''` and `false` are not.
 */
export function isEmptyFormulaValue(value: unknown): boolean {
  return value === null || value === undefined;
}

function areFormulaScalarsEqual(left: unknown, right: unknown): boolean {
  const l = left === undefined ? null : left;
  const r = right === undefined ? null : right;
  if (l === null && r === null) {
    return true;
  }
  if (l === null || r === null) {
    // Deviation from Excel, documented: empty only equals empty
    // (never 0, '' or FALSE) to avoid three-way ambiguity.
    return false;
  }
  if (typeof l === 'string' && typeof r === 'string') {
    // Excel behavior: string comparison is case-insensitive ("a" = "A" is TRUE).
    return l.toLowerCase() === r.toLowerCase();
  }
  if (typeof l === 'number' && typeof r === 'number') {
    return l === r;
  }
  if (typeof l === 'boolean' && typeof r === 'boolean') {
    return l === r;
  }
  if (l instanceof Date && r instanceof Date) {
    // Invalid Dates (NaN time) are never equal to anything, including
    // themselves — mirrors NaN number equality. Ordered comparison of
    // Invalid Dates is #VALUE! (see compareFormulaScalars), mirroring
    // the NaN number guard there.
    return l.getTime() === r.getTime();
  }
  // Cross-type equality is FALSE, never an error.
  return false;
}

/**
 * Neutral substitute for an empty operand in an ordered comparison, derived
 * from the other operand's type: number -> 0, string -> '', boolean -> FALSE,
 * Date -> epoch (consistent with the `Date coerces via getTime` rule).
 */
function neutralForOrderedComparison(other: unknown): unknown {
  if (typeof other === 'number') {
    return 0;
  }
  if (typeof other === 'string') {
    return '';
  }
  if (typeof other === 'boolean') {
    return false;
  }
  if (other instanceof Date) {
    return new Date(0);
  }
  return null;
}

type ComparisonOperator = Extract<FormulaBinaryOperator, '=' | '<>' | '<' | '<=' | '>' | '>='>;

function compareOrdered<T extends number | string>(left: T, right: T): number {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

/**
 * Comparison semantics shared by the evaluator and function implementations.
 * Equality across different types is FALSE; ordered comparison across
 * different types is `#VALUE!` (deliberate deviation from Excel's total order).
 * All string comparisons are case-insensitive (Excel behavior); the decision
 * is isolated here so it stays one-line reversible.
 */
export function compareFormulaScalars(
  operator: ComparisonOperator,
  left: unknown,
  right: unknown,
): boolean | FormulaErrorValue {
  if (operator === '=') {
    return areFormulaScalarsEqual(left, right);
  }
  if (operator === '<>') {
    return !areFormulaScalarsEqual(left, right);
  }

  let l: unknown = left === undefined ? null : left;
  let r: unknown = right === undefined ? null : right;
  if (l === null && r === null) {
    return operator === '<=' || operator === '>=';
  }
  if (l === null) {
    l = neutralForOrderedComparison(r);
  } else if (r === null) {
    r = neutralForOrderedComparison(l);
  }

  let comparison: number;
  if (typeof l === 'number' && typeof r === 'number') {
    if (Number.isNaN(l) || Number.isNaN(r)) {
      return createFormulaError('#VALUE!', 'Cannot compare invalid numbers.');
    }
    comparison = compareOrdered(l, r);
  } else if (typeof l === 'string' && typeof r === 'string') {
    comparison = compareOrdered(l.toLowerCase(), r.toLowerCase());
  } else if (typeof l === 'boolean' && typeof r === 'boolean') {
    comparison = Number(l) - Number(r);
  } else if (l instanceof Date && r instanceof Date) {
    const leftTime = l.getTime();
    const rightTime = r.getTime();
    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return createFormulaError('#VALUE!', 'Cannot compare invalid dates.');
    }
    comparison = leftTime - rightTime;
  } else {
    return createFormulaError('#VALUE!', 'Cannot compare values of different types.');
  }

  switch (operator) {
    case '<':
      return comparison < 0;
    case '<=':
      return comparison <= 0;
    case '>':
      return comparison > 0;
    default:
      return comparison >= 0;
  }
}
