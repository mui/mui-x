/**
 * Simplifies a type by removing excess properties.
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
