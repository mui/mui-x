/**
 * Whether the primary pointer is coarse (finger or stylus) rather than a mouse.
 * Call it from an event handler or an effect: it reads `window`, and the result is not reactive.
 */
export function isCoarsePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}
