import type { SlotComponentProps } from '@mui/utils/types';

/**
 * Merge a Material wrapper's default slot props (`base`, e.g. the resolved
 * `className`/`sx`) with a consumer-supplied slot prop, preserving the
 * `(ownerState) => props` **callback form** of `SlotComponentProps`.
 *
 * The Material chat components pre-compute their default slot props as a plain
 * object before handing them to the headless slot. Spreading the consumer slot
 * prop with `...(slotProps?.x as object)` silently flattens a callback to `{}`,
 * dropping owner-state-driven `className`/`sx`/handlers. This helper keeps the
 * callback: when the consumer prop is a function it returns a function that
 * resolves it and layers `base` underneath (so the consumer's resolved props win,
 * matching the object-spread merge order); otherwise it returns a plain object.
 *
 * @param base Default props the wrapper always applies (e.g. `className`, `sx`).
 * @param consumer The consumer slot prop (object form, callback form, or undefined).
 */
export function mergeSlotProps<OwnerState>(
  base: Record<string, unknown>,
  consumer: SlotComponentProps<any, Record<string, unknown>, OwnerState> | undefined,
): Record<string, unknown> | ((ownerState: OwnerState) => Record<string, unknown>) {
  if (typeof consumer === 'function') {
    return (ownerState: OwnerState) => ({
      ...base,
      ...((consumer as (os: OwnerState) => Record<string, unknown>)(ownerState) ?? {}),
    });
  }
  return { ...base, ...((consumer as Record<string, unknown>) ?? {}) };
}
