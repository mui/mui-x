export const OPERATOR_LABEL_MAPPING: { [key: string]: string } = {
  '=': 'equals',
  '!=': 'not equals',
  '>': 'is greater than',
  '>=': 'is greater than or equal to',
  '<': 'is less than',
  '<=': 'is less than or equal to',
};

export const OPERATOR_SYMBOL_MAPPING: { [key: string]: string } = {
  contains: '∋',
  equals: '=',
  '=': '=',
  '!=': '≠',
  '>': '>',
  '>=': '≥',
  '<': '<',
  '<=': '≤',
  startsWith: '⊃',
  endsWith: '⊂',
  is: '=',
  not: '≠',
  isNot: '≠',
  isEmpty: '∅',
  isNotEmpty: '∉',
  isIn: '∈',
  isNotIn: '∉',
  isLessThan: '<',
  isLessThanOrEqual: '≤',
  isGreaterThan: '>',
  isGreaterThanOrEqual: '≥',
  isBetween: '∈',
  isNotBetween: '∉',
  isAnyOf: '∈',
  after: '>',
  onOrAfter: '≥',
  before: '<',
  onOrBefore: '≤',
};

/*
 * Operators that don't require an input component to be enabled.
 */
export const NO_INPUT_OPERATORS: { [columnType: string]: string[] } = {
  string: ['isEmpty', 'isNotEmpty'],
  date: ['isEmpty', 'isNotEmpty'],
  number: ['isEmpty', 'isNotEmpty'],
};

/*
 * Column types that don't need to render a filter cell.
 */
export const TYPES_WITH_NO_FILTER_CELL = ['actions', 'checkboxSelection'];
