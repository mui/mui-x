/**
 * Makes specified keys in a type optional.
 *
 * @template T - The original type.
 * @template K - The keys to make optional.
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
