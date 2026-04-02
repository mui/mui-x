/**
 * Distribute the `Omit` to an union.
 * `DistributiveOmit<A | B, 'key'>` returns `Omit<A, 'key'> | Omit<B, 'key'>`
 * @see {@link https://tkdodo.eu/blog/omit-for-discriminated-unions-in-type-script this blog post} for more info.
 *
 * @template T - The original union type to distribute the `Omit` over.
 * @template K - The keys to omit.
 */
export type DistributiveOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never;
