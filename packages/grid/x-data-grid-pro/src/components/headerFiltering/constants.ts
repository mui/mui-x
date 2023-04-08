export const OPERATOR_LABEL_MAPPING: { [key: string]: string } = {
  contains: 'Contains',
  equals: 'Equals',
  '=': 'Equals',
  '!=': 'Not equals',
  '>': 'Is greater than',
  '>=': 'Is greater than or equal to',
  '<': 'Is less than',
  '<=': 'Is less than or equal to',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  is: 'Is',
  isNot: 'Is not',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
  isIn: 'Is in',
  isNotIn: 'Is not in',
  isLessThan: 'Is less than',
  isLessThanOrEqual: 'Is less than or equal to',
  isGreaterThan: 'Is greater than',
  isGreaterThanOrEqual: 'Is greater than or equal to',
  isBetween: 'Is between',
  isNotBetween: 'Is not between',
  isAnyOf: 'Is any of',
  // date type
  not: 'Is not',
  after: 'Is after',
  onOrAfter: 'Is on or after',
  before: 'Is before',
  onOrBefore: 'Is on or before',
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
};

/*
 * Column types that don't need to render a filter cell.
 */
export const TYPES_WITH_NO_FILTER_CELL = ['actions', 'checkboxSelection'];