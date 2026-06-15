import { FORMULA_RESERVED_NAMES } from './formulaAst';
import { createFormulaError, isFormulaErrorValue } from './formulaErrors';
import type { FormulaErrorValue } from './formulaErrors';
import { isFormulaRangeValue } from './formulaTypes';
import type { FormulaCellRef, FormulaRangeValue, FormulaScalar } from './formulaTypes';
import type { compareFormulaScalars } from './formulaValues';
import {
  isEmptyFormulaValue,
  toFormulaBoolean,
  toFormulaNumber,
  toFormulaText,
} from './formulaValues';

/**
 * Coercion helpers shared with function implementations, so that custom
 * functions follow the same coercion rules as the built-ins.
 */
export interface FormulaFunctionCoercionHelpers {
  toNumber: typeof toFormulaNumber;
  toText: typeof toFormulaText;
  toBoolean: typeof toFormulaBoolean;
  isEmpty: typeof isEmptyFormulaValue;
  compare: typeof compareFormulaScalars;
}

export interface FormulaFunctionContext {
  coerce: FormulaFunctionCoercionHelpers;
  currentCell: FormulaCellRef;
}

export type FormulaFunctionEagerArg = FormulaScalar | FormulaErrorValue | FormulaRangeValue;

/**
 * Eager functions receive resolved values; `lazy` functions receive thunks
 * (so untaken `IF` branches are never evaluated).
 */
export type FormulaFunctionArg = FormulaFunctionEagerArg | (() => FormulaFunctionEagerArg);

export interface FormulaFunctionDefinition {
  /**
   * Canonical uppercase name; lookup is case-insensitive.
   */
  name: string;
  minArgs: number;
  /**
   * `null` means variadic.
   */
  maxArgs: number | null;
  /**
   * Arguments are delivered as thunks; the function controls their evaluation.
   */
  lazy?: boolean;
  /**
   * The function may receive `FormulaRangeValue` arguments.
   */
  acceptsRanges?: boolean;
  /**
   * Error arguments are passed through instead of short-circuiting (IFERROR, ISBLANK).
   */
  acceptsErrors?: boolean;
  /**
   * Reserved: formulas calling a volatile function are re-evaluated on every
   * recompute pass. No built-in is volatile.
   */
  volatile?: boolean;
  /**
   * One-line call signature shown by the formula editor autocomplete, e.g.
   * `SUM(value1, value2, …)`. Optional — a generic signature is derived from
   * `minArgs`/`maxArgs` when omitted.
   */
  signature?: string;
  /**
   * Short description shown by the formula editor autocomplete.
   */
  description?: string;
  /**
   * Category label used to group the function in the formula editor autocomplete.
   */
  category?: string;
  apply: (
    args: FormulaFunctionArg[],
    context: FormulaFunctionContext,
  ) => FormulaScalar | FormulaErrorValue;
}

export interface FormulaFunctionRegistry {
  get: (name: string) => FormulaFunctionDefinition | undefined;
  names: () => string[];
}

const RESERVED_NAME_SET = new Set(FORMULA_RESERVED_NAMES);

function resolveArg(arg: FormulaFunctionArg): FormulaFunctionEagerArg {
  return typeof arg === 'function' ? arg() : arg;
}

/**
 * Flattens scalar and range arguments into a single value list, skipping
 * empty cells. The evaluator short-circuits error arguments before `apply`
 * for non-`acceptsErrors` functions; should one slip through anyway,
 * it propagates instead of being silently dropped.
 */
function flattenArgValues(args: FormulaFunctionArg[]): FormulaScalar[] | FormulaErrorValue {
  const values: FormulaScalar[] = [];
  for (const arg of args) {
    const value = resolveArg(arg);
    if (isFormulaErrorValue(value)) {
      return value;
    }
    if (isFormulaRangeValue(value)) {
      for (const rangeValue of value.values) {
        if (!isEmptyFormulaValue(rangeValue)) {
          values.push(rangeValue);
        }
      }
    } else if (!isEmptyFormulaValue(value)) {
      values.push(value);
    }
  }
  return values;
}

function collectNumericValues(args: FormulaFunctionArg[]): number[] | FormulaErrorValue {
  const values = flattenArgValues(args);
  if (isFormulaErrorValue(values)) {
    return values;
  }
  const numbers: number[] = [];
  for (const value of values) {
    const numeric = toFormulaNumber(value);
    if (isFormulaErrorValue(numeric)) {
      return numeric;
    }
    numbers.push(numeric);
  }
  return numbers;
}

const sumDefinition: FormulaFunctionDefinition = {
  name: 'SUM',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'SUM(value1, value2, …)',
  description: 'Adds numbers, ranges and columns.',
  category: 'Math',
  apply: (args) => {
    const numbers = collectNumericValues(args);
    if (isFormulaErrorValue(numbers)) {
      return numbers;
    }
    return numbers.reduce((total, value) => total + value, 0);
  },
};

const averageDefinition: FormulaFunctionDefinition = {
  name: 'AVERAGE',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'AVERAGE(value1, value2, …)',
  description: 'Returns the arithmetic mean of its numeric values.',
  category: 'Math',
  apply: (args) => {
    const numbers = collectNumericValues(args);
    if (isFormulaErrorValue(numbers)) {
      return numbers;
    }
    if (numbers.length === 0) {
      return createFormulaError('#DIV/0!', 'AVERAGE() of no values.');
    }
    return numbers.reduce((total, value) => total + value, 0) / numbers.length;
  },
};

const minDefinition: FormulaFunctionDefinition = {
  name: 'MIN',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'MIN(value1, value2, …)',
  description: 'Returns the smallest numeric value.',
  category: 'Math',
  apply: (args) => {
    const numbers = collectNumericValues(args);
    if (isFormulaErrorValue(numbers)) {
      return numbers;
    }
    // Excel-compatible: MIN over no values is 0.
    return numbers.length === 0 ? 0 : Math.min(...numbers);
  },
};

const maxDefinition: FormulaFunctionDefinition = {
  name: 'MAX',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'MAX(value1, value2, …)',
  description: 'Returns the largest numeric value.',
  category: 'Math',
  apply: (args) => {
    const numbers = collectNumericValues(args);
    if (isFormulaErrorValue(numbers)) {
      return numbers;
    }
    return numbers.length === 0 ? 0 : Math.max(...numbers);
  },
};

const countDefinition: FormulaFunctionDefinition = {
  name: 'COUNT',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'COUNT(value1, value2, …)',
  description: 'Counts how many values are numbers or dates.',
  category: 'Math',
  apply: (args) => {
    const values = flattenArgValues(args);
    if (isFormulaErrorValue(values)) {
      return values;
    }
    let count = 0;
    for (const value of values) {
      // Excel-compatible: COUNT counts numbers (and dates), not numeric text.
      if ((typeof value === 'number' && !Number.isNaN(value)) || value instanceof Date) {
        count += 1;
      }
    }
    return count;
  },
};

const countaDefinition: FormulaFunctionDefinition = {
  name: 'COUNTA',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'COUNTA(value1, value2, …)',
  description: 'Counts how many values are not empty.',
  category: 'Math',
  apply: (args) => {
    const values = flattenArgValues(args);
    return isFormulaErrorValue(values) ? values : values.length;
  },
};

const roundDefinition: FormulaFunctionDefinition = {
  name: 'ROUND',
  minArgs: 1,
  maxArgs: 2,
  signature: 'ROUND(value, [digits])',
  description: 'Rounds a number to the given number of decimal digits (0 by default).',
  category: 'Math',
  apply: (args) => {
    const value = toFormulaNumber(resolveArg(args[0]));
    if (isFormulaErrorValue(value)) {
      return value;
    }
    let digits = 0;
    if (args.length > 1) {
      const digitsValue = toFormulaNumber(resolveArg(args[1]));
      if (isFormulaErrorValue(digitsValue)) {
        return digitsValue;
      }
      digits = Math.trunc(digitsValue);
    }
    const factor = 10 ** digits;
    // Excel rounds halves away from zero: ROUND(-2.5, 0) is -3.
    // Non-finite results are caught by the evaluator's result check.
    return (Math.sign(value) * Math.round(Math.abs(value) * factor)) / factor;
  },
};

const absDefinition: FormulaFunctionDefinition = {
  name: 'ABS',
  minArgs: 1,
  maxArgs: 1,
  signature: 'ABS(value)',
  description: 'Returns the absolute value of a number.',
  category: 'Math',
  apply: (args) => {
    const value = toFormulaNumber(resolveArg(args[0]));
    return isFormulaErrorValue(value) ? value : Math.abs(value);
  },
};

const modDefinition: FormulaFunctionDefinition = {
  name: 'MOD',
  minArgs: 2,
  maxArgs: 2,
  signature: 'MOD(value, divisor)',
  description: 'Returns the remainder of a division (sign of the divisor).',
  category: 'Math',
  apply: (args) => {
    const value = toFormulaNumber(resolveArg(args[0]));
    if (isFormulaErrorValue(value)) {
      return value;
    }
    const divisor = toFormulaNumber(resolveArg(args[1]));
    if (isFormulaErrorValue(divisor)) {
      return divisor;
    }
    if (divisor === 0) {
      return createFormulaError('#DIV/0!', 'MOD() by zero.');
    }
    // Excel-compatible: the result takes the sign of the divisor (MOD(-3, 2) is 1).
    return value - divisor * Math.floor(value / divisor);
  },
};

const powerDefinition: FormulaFunctionDefinition = {
  name: 'POWER',
  minArgs: 2,
  maxArgs: 2,
  signature: 'POWER(base, exponent)',
  description: 'Raises a number to a power.',
  category: 'Math',
  apply: (args) => {
    const base = toFormulaNumber(resolveArg(args[0]));
    if (isFormulaErrorValue(base)) {
      return base;
    }
    const exponent = toFormulaNumber(resolveArg(args[1]));
    if (isFormulaErrorValue(exponent)) {
      return exponent;
    }
    // Non-finite results are caught by the evaluator's result check.
    return base ** exponent;
  },
};

function resolveBranch(arg: FormulaFunctionArg): FormulaScalar | FormulaErrorValue {
  const value = resolveArg(arg);
  if (isFormulaRangeValue(value)) {
    return createFormulaError('#VALUE!', 'A range cannot be used here.');
  }
  return value;
}

const ifDefinition: FormulaFunctionDefinition = {
  name: 'IF',
  minArgs: 2,
  maxArgs: 3,
  lazy: true,
  signature: 'IF(condition, valueIfTrue, [valueIfFalse])',
  description: 'Returns one value when the condition is true and another when it is false.',
  category: 'Logical',
  apply: (args) => {
    const conditionValue = resolveBranch(args[0]);
    if (isFormulaErrorValue(conditionValue)) {
      return conditionValue;
    }
    const condition = toFormulaBoolean(conditionValue);
    if (isFormulaErrorValue(condition)) {
      return condition;
    }
    if (condition) {
      return resolveBranch(args[1]);
    }
    // Excel-compatible: a missing "else" branch yields FALSE.
    return args.length > 2 ? resolveBranch(args[2]) : false;
  },
};

const andDefinition: FormulaFunctionDefinition = {
  name: 'AND',
  minArgs: 1,
  maxArgs: null,
  lazy: true,
  signature: 'AND(condition1, condition2, …)',
  description: 'Returns TRUE when every condition is true.',
  category: 'Logical',
  apply: (args) => {
    for (const arg of args) {
      const value = resolveBranch(arg);
      if (isFormulaErrorValue(value)) {
        return value;
      }
      const condition = toFormulaBoolean(value);
      if (isFormulaErrorValue(condition)) {
        return condition;
      }
      if (!condition) {
        return false;
      }
    }
    return true;
  },
};

const orDefinition: FormulaFunctionDefinition = {
  name: 'OR',
  minArgs: 1,
  maxArgs: null,
  lazy: true,
  signature: 'OR(condition1, condition2, …)',
  description: 'Returns TRUE when at least one condition is true.',
  category: 'Logical',
  apply: (args) => {
    for (const arg of args) {
      const value = resolveBranch(arg);
      if (isFormulaErrorValue(value)) {
        return value;
      }
      const condition = toFormulaBoolean(value);
      if (isFormulaErrorValue(condition)) {
        return condition;
      }
      if (condition) {
        return true;
      }
    }
    return false;
  },
};

const notDefinition: FormulaFunctionDefinition = {
  name: 'NOT',
  minArgs: 1,
  maxArgs: 1,
  signature: 'NOT(condition)',
  description: 'Reverses a boolean value.',
  category: 'Logical',
  apply: (args) => {
    const condition = toFormulaBoolean(resolveArg(args[0]));
    return isFormulaErrorValue(condition) ? condition : !condition;
  },
};

const ifErrorDefinition: FormulaFunctionDefinition = {
  name: 'IFERROR',
  minArgs: 2,
  maxArgs: 2,
  lazy: true,
  acceptsErrors: true,
  signature: 'IFERROR(value, valueIfError)',
  description: 'Returns a fallback value when the first argument is an error.',
  category: 'Logical',
  apply: (args) => {
    const value = resolveArg(args[0]);
    if (isFormulaErrorValue(value)) {
      return resolveBranch(args[1]);
    }
    if (isFormulaRangeValue(value)) {
      return createFormulaError('#VALUE!', 'A range cannot be used here.');
    }
    return value;
  },
};

const isBlankDefinition: FormulaFunctionDefinition = {
  name: 'ISBLANK',
  minArgs: 1,
  maxArgs: 1,
  acceptsErrors: true,
  signature: 'ISBLANK(value)',
  description: 'Returns TRUE when the value is empty.',
  category: 'Logical',
  apply: (args) => {
    const value = resolveArg(args[0]);
    if (isFormulaErrorValue(value)) {
      return false;
    }
    if (isFormulaRangeValue(value)) {
      return createFormulaError('#VALUE!', 'A range cannot be used here.');
    }
    return isEmptyFormulaValue(value);
  },
};

const concatDefinition: FormulaFunctionDefinition = {
  name: 'CONCAT',
  minArgs: 1,
  maxArgs: null,
  acceptsRanges: true,
  signature: 'CONCAT(text1, text2, …)',
  description: 'Joins values into a single text string.',
  category: 'Text',
  apply: (args) => {
    let result = '';
    for (const arg of args) {
      const value = resolveArg(arg);
      const values = isFormulaRangeValue(value) ? value.values : [value];
      for (const item of values) {
        const text = toFormulaText(item);
        if (isFormulaErrorValue(text)) {
          return text;
        }
        result += text;
      }
    }
    return result;
  },
};

function applyTextFunction(
  arg: FormulaFunctionArg,
  transform: (text: string) => string,
): FormulaScalar | FormulaErrorValue {
  const text = toFormulaText(resolveArg(arg));
  return isFormulaErrorValue(text) ? text : transform(text);
}

const lenDefinition: FormulaFunctionDefinition = {
  name: 'LEN',
  minArgs: 1,
  maxArgs: 1,
  signature: 'LEN(text)',
  description: 'Returns the number of characters in a text string.',
  category: 'Text',
  apply: (args) => {
    const text = toFormulaText(resolveArg(args[0]));
    return isFormulaErrorValue(text) ? text : text.length;
  },
};

const upperDefinition: FormulaFunctionDefinition = {
  name: 'UPPER',
  minArgs: 1,
  maxArgs: 1,
  signature: 'UPPER(text)',
  description: 'Converts text to uppercase.',
  category: 'Text',
  apply: (args) => applyTextFunction(args[0], (text) => text.toUpperCase()),
};

const lowerDefinition: FormulaFunctionDefinition = {
  name: 'LOWER',
  minArgs: 1,
  maxArgs: 1,
  signature: 'LOWER(text)',
  description: 'Converts text to lowercase.',
  category: 'Text',
  apply: (args) => applyTextFunction(args[0], (text) => text.toLowerCase()),
};

const trimDefinition: FormulaFunctionDefinition = {
  name: 'TRIM',
  minArgs: 1,
  maxArgs: 1,
  signature: 'TRIM(text)',
  description: 'Removes leading, trailing and repeated spaces from text.',
  category: 'Text',
  // Excel-compatible: TRIM also collapses internal runs of spaces.
  apply: (args) => applyTextFunction(args[0], (text) => text.trim().replace(/ {2,}/g, ' ')),
};

function sliceTextFunction(
  args: FormulaFunctionArg[],
  slice: (text: string, count: number) => string,
): FormulaScalar | FormulaErrorValue {
  const text = toFormulaText(resolveArg(args[0]));
  if (isFormulaErrorValue(text)) {
    return text;
  }
  let count = 1;
  if (args.length > 1) {
    const countValue = toFormulaNumber(resolveArg(args[1]));
    if (isFormulaErrorValue(countValue)) {
      return countValue;
    }
    count = Math.trunc(countValue);
    if (count < 0) {
      return createFormulaError('#VALUE!', 'The number of characters cannot be negative.');
    }
  }
  return slice(text, count);
}

const leftDefinition: FormulaFunctionDefinition = {
  name: 'LEFT',
  minArgs: 1,
  maxArgs: 2,
  signature: 'LEFT(text, [count])',
  description: 'Returns the first characters of a text string (1 by default).',
  category: 'Text',
  apply: (args) => sliceTextFunction(args, (text, count) => text.slice(0, count)),
};

const rightDefinition: FormulaFunctionDefinition = {
  name: 'RIGHT',
  minArgs: 1,
  maxArgs: 2,
  signature: 'RIGHT(text, [count])',
  description: 'Returns the last characters of a text string (1 by default).',
  category: 'Text',
  apply: (args) =>
    sliceTextFunction(args, (text, count) => (count === 0 ? '' : text.slice(-count))),
};

export const FORMULA_BUILT_IN_FUNCTIONS: readonly FormulaFunctionDefinition[] = [
  sumDefinition,
  averageDefinition,
  minDefinition,
  maxDefinition,
  countDefinition,
  countaDefinition,
  roundDefinition,
  absDefinition,
  modDefinition,
  powerDefinition,
  ifDefinition,
  andDefinition,
  orDefinition,
  notDefinition,
  ifErrorDefinition,
  isBlankDefinition,
  concatDefinition,
  { ...concatDefinition, name: 'CONCATENATE', signature: 'CONCATENATE(text1, text2, …)' },
  lenDefinition,
  upperDefinition,
  lowerDefinition,
  trimDefinition,
  leftDefinition,
  rightDefinition,
];

/**
 * Static arity check shared by the evaluator and the validation layer so
 * their messages stay in sync. Returns `null` when the call is well-formed.
 */
export function getFormulaFunctionArityError(
  definition: FormulaFunctionDefinition,
  argCount: number,
): FormulaErrorValue | null {
  if (argCount < definition.minArgs) {
    return createFormulaError(
      '#VALUE!',
      `${definition.name}() expects at least ${definition.minArgs} argument(s).`,
    );
  }
  if (definition.maxArgs !== null && argCount > definition.maxArgs) {
    return createFormulaError(
      '#VALUE!',
      `${definition.name}() expects at most ${definition.maxArgs} argument(s).`,
    );
  }
  return null;
}

const VALID_FUNCTION_NAME_REGEX = /^[A-Z_][A-Z0-9_]*$/;

/**
 * Builds the registry from the complete function set: passing an argument
 * REPLACES the built-ins (callers wanting built-ins plus extras spread
 * `FORMULA_BUILT_IN_FUNCTIONS` explicitly). This mirrors the
 * `aggregationFunctions` prop semantics the adapter exposes.
 */
export function createFormulaFunctionRegistry(
  functions: readonly FormulaFunctionDefinition[] = FORMULA_BUILT_IN_FUNCTIONS,
): FormulaFunctionRegistry {
  const definitions = new Map<string, FormulaFunctionDefinition>();
  for (const definition of functions) {
    const name = definition.name.toUpperCase();
    if (RESERVED_NAME_SET.has(name)) {
      throw new Error(
        `MUI X Data Grid: The formula function name "${name}" is reserved by the formula syntax. ` +
          'Registering it would make the function unreachable in formulas. ' +
          'Rename the custom function to a non-reserved name.',
      );
    }
    if (!VALID_FUNCTION_NAME_REGEX.test(name)) {
      throw new Error(
        `MUI X Data Grid: "${definition.name}" is not a valid formula function name. ` +
          'The formula parser can never produce a call to it, which would make the function unreachable in formulas. ' +
          'Function names must start with a letter or underscore and contain only letters, digits, and underscores.',
      );
    }
    definitions.set(name, definition);
  }
  return {
    get: (name) => definitions.get(name.toUpperCase()),
    names: () => Array.from(definitions.keys()),
  };
}
