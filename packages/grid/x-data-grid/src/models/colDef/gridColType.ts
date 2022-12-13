export type GridNativeColTypes =
  | 'string'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'singleSelect'
  | 'actions';

/**
 * Workaround for Typescript losing type information when a string literal is opened up to any string
 * 
 * Can be removed if this issue is ever resolved:
 * https://github.com/Microsoft/TypeScript/issues/29729
 */
type LiteralAnyString = string & Record<never, never>

// eslint-disable-next-line no-template-curly-in-string
type LiteralAnyStringPrompt = '${string}'

export type GridColType = GridNativeColTypes | LiteralAnyStringPrompt | LiteralAnyString;
