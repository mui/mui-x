// Uppercase first letter of a string
type CapitalizeFirstLetter<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

/**
 * Prepend string P to all keys in T.
 * If K is provided, only prepend P to keys in K.
 *
 * @template T - The type to prepend keys to.
 * @template P - The string to prepend.
 * @template K - The keys to prepend P to.
 */
export type PrependKeys<T, P extends string, K extends string = string> = {
  [key in keyof T as key extends K ? `${P}${CapitalizeFirstLetter<key>}` : key]: T[key];
};
