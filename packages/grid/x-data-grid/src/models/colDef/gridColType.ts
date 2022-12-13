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

/**
 * Immitate typescript's template literal syntax to document in autocomplete that the string type is open for extension.
 */
// eslint-disable-next-line no-template-curly-in-string
type LiteralAnyStringDocPrompt = '${string}'

export type GridColType = GridNativeColTypes | LiteralAnyStringDocPrompt | LiteralAnyString;
