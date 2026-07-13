// `V extends any` is the "force-distribution" idiom: it keeps `V` naked in the outer
// conditional so the check distributes across union variants. That matters for slot
// types shaped as `T | (T & DataAttributes)` (the `WithDataAttributes` widening) — the
// assertion passes as soon as one branch exposes the marker key, while a non-widened
// branch failing on its own is fine.
//
// `'data-x'` is used as the marker key: it matches the
// ` [k: `data-${string}`]: ... ` template-literal index signature exposed by
// `DataAttributes`, and is present only when the variant has been widened via
// `DataAttributes`. `aria-*` is not checked here — every real slot inner type in
// MUI X inherits `React.AriaAttributes` through its element or component base type,
// so aria coverage is a structural property of the inner type, not something this
// widener needs to re-verify.
type AcceptsDataAttributes<V> = V extends any ? ('data-x' extends keyof V ? true : false) : never;

type CheckVariant<V> = V extends (...args: any[]) => infer R
  ? AcceptsDataAttributes<R>
  : AcceptsDataAttributes<V>;

type SlotAcceptsDataAttributes<T> = true extends CheckVariant<NonNullable<T>> ? true : false;

/**
 * Maps each slot of a `*SlotProps` type to either `true` or a failure message
 * identifying the slot that does not accept `data-*` attributes.
 *
 * The check probes each slot's value type for the
 * `` [key: `data-${string}`]: ... `` index signature (covering arbitrary
 * `data-*` keys). The check distributes across union variants and unwraps
 * function variants to their return type; any variant providing the signature
 * — typically via an intersection with `DataAttributes` — passes.
 */
export type AssertAllSlotsAcceptDataAttributes<T, Name extends string = 'Component'> = {
  [K in keyof T]-?: SlotAcceptsDataAttributes<T[K]> extends true
    ? true
    : `FAIL [${Name}.${Extract<K, string>}]: slot must accept data-* attributes. Use SlotComponentPropsFromProps.`;
};

/**
 * Collapses a mapping into `true` if every value is `true`, or surfaces the
 * first failure string. Used together with `AssertAllSlotsAcceptDataAttributes`.
 */
export type AllTrue<T> = { [K in keyof T]: T[K] extends true ? true : T[K] }[keyof T];

/**
 * Constrains to `true` — the assignment fails if any slot in the mapping
 * surfaced a failure string. Gives a clear TS error pointing at the offending
 * slot.
 */
export type Assert<T extends true> = T;
