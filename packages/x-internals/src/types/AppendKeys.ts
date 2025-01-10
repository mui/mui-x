// Uppercase first letter of a string
type CapitalizeFirstLetter<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

/**
 * Append string P to all keys in T.
 * If K is provided, only append P to keys in K.
 *
 * @template T - The type to append keys to.
 * @template P - The string to append.
 * @template K - The keys to append P to.
 */
export type AppendKeys<T, P extends string, K extends string = string> = {
  [key in keyof T as key extends K ? `${key}${CapitalizeFirstLetter<P>}` : key]: T[key];
};
