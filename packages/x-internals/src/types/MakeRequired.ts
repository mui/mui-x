/**
 * Makes specified keys in a type required.
 *
 * @template T - The original type.
 * @template K - The keys to make required.
 */

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
