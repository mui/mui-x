type LiteralUnion<LiteralType, BaseType> = LiteralType | (BaseType & Record<never, never>);

export type GridNativeColTypes =
  | 'string'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'singleSelect'
  | 'actions';

// Use `LiteralUnion` to get autocompletion for literal types.
export type GridColType = LiteralUnion<GridNativeColTypes, string>;

export type GridNativeColOperator =
  | 'is'
  | 'not'
  | 'after'
  | 'onOrAfter'
  | 'before'
  | 'onOrBefore'
  | 'isEmpty'
  | 'isNotEmpty'
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'isAnyOf'
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith';

export type GridColTypeOperator = GridNativeColOperator | string;
