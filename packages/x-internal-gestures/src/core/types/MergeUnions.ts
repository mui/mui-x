/**
 * MergeUnions is a utility type that merges all union types into a single type.
 * It ensures that all properties from the union types are included in the resulting type.
 * This is useful for creating a comprehensive type that captures all possible
 * variations of a given type.
 *
 * @template T - The union type to be merged
 *
 * @example
 * ```typescript
 * type UnionType = { a: number } | { b: string };
 * type MergedType = MergeUnions<UnionType>;
 * // Results in:
 * // {
 * //   a: number;
 * //   b: string;
 * // }
 * ```
 */
export type MergeUnions<T> = {
  [K in keyof AddMissingProps<T>]: AddMissingProps<T>[K];
};
type AllKeys<T> = T extends unknown ? keyof T : never;
type AddMissingProps<T, K extends PropertyKey = AllKeys<T>> = T extends unknown
  ? T & Record<Exclude<K, keyof T>, never>
  : never;
