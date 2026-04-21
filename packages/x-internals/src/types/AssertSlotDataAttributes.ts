// `V extends any` is the "force-distribution" idiom: it keeps `V` naked in the outer
// conditional so the check distributes across union variants. That matters for slot
// types shaped as `T | (T & DataAttributes)` (the `WithDataAttributes` widening) — the
// assertion passes as soon as one branch exposes both keys, while a non-widened branch
// failing on its own is fine.
//
// `'data-x'` and `'aria-label'` are used as marker keys. `'data-x'` matches the
// ` [k: `data-${string}`]: ... ` template-literal index signature exposed by
// `DataAttributes`, and `'aria-label'` stands in for the `React.AriaAttributes` shape
// (whose keys are otherwise all optional, which would make a direct structural check
// trivially satisfied). Both markers are present iff the variant has been widened via
// `DataAttributes`.
type AcceptsDataAndAria<V> = V extends any
  ? 'data-x' extends keyof V
    ? 'aria-label' extends keyof V
      ? true
      : false
    : false
  : never;

type CheckVariant<V> = V extends (...args: any[]) => infer R
  ? AcceptsDataAndAria<R>
  : AcceptsDataAndAria<V>;

type SlotAcceptsDataAttributes<T> = true extends CheckVariant<NonNullable<T>> ? true : false;

/**
 * Maps each slot of a `*SlotProps` type to either `true` or a failure message
 * identifying the slot that does not accept `data-*` / `aria-*` attributes.
 *
 * The check probes each slot's value type for both the
 * `` [key: `data-${string}`]: ... `` index signature (covering arbitrary
 * `data-*` keys) and `'aria-label'` as the marker aria attribute (standing in
 * for the full `React.AriaAttributes` surface). The check distributes across
 * union variants and unwraps function variants to their return type; any
 * variant providing both signatures — typically via an intersection with
 * `DataAttributes` — passes.
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
