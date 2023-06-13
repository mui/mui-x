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
