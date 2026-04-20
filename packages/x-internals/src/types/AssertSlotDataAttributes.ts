type HasDataIndexSignature<V> = V extends { [key: `data-${string}`]: any } ? true : false;

type CheckVariant<V> = V extends (...args: any[]) => infer R
  ? HasDataIndexSignature<R>
  : HasDataIndexSignature<V>;

type SlotAcceptsDataAttributes<T> = true extends CheckVariant<NonNullable<T>> ? true : false;

/**
 * Maps each slot of a `*SlotProps` type to either `true` or a failure message
 * identifying the slot that does not accept `data-*` / `aria-*` attributes.
 *
 * The check works by probing for the `` [key: `data-${string}`]: ... `` index
 * signature on each slot's value type (distributing across union variants and
 * unwrapping function variants to their return type). Any variant providing
 * the signature — typically via an intersection with `DataAttributes` — passes.
 */
export type AssertAllSlotsAcceptDataAttributes<T, Name extends string = 'Component'> = {
  [K in keyof T]-?: SlotAcceptsDataAttributes<T[K]> extends true
    ? true
    : `FAIL [${Name}.${Extract<K, string>}]: slot must accept data-* and aria-* attributes. Use SlotComponentPropsFromProps.`;
};

/**
 * Collapses a mapping into `true` iff every value is `true`, or surfaces the
 * first failure string. Used together with `AssertAllSlotsAcceptDataAttributes`.
 */
export type AllTrue<T> = { [K in keyof T]: T[K] extends true ? true : T[K] }[keyof T];

/**
 * Constrains to `true` — the assignment fails if any slot in the mapping
 * surfaced a failure string. Gives a clear TS error pointing at the offending
 * slot.
 */
export type Assert<T extends true> = T;
