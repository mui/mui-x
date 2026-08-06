export const ARROW_DEPTH = 8; // px - depth of the chevron point
export const LEFT_ARROW_CLIP = `polygon(${ARROW_DEPTH}px 0, 100% 0, 100% 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;
export const RIGHT_ARROW_CLIP = `polygon(0 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, 0 100%)`;
export const BOTH_ARROWS_CLIP = `polygon(${ARROW_DEPTH}px 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;

/**
 * The clip that draws the chevron also clips the focus outline away, so an event continuing past
 * the day edge takes focus as a plain rounded rectangle.
 */
export const getArrowFocusVisibleStyles = (borderRadius: number | string) => ({
  '&[data-starting-before-edge]:focus-visible, &[data-ending-after-edge]:focus-visible': {
    clipPath: 'none',
    borderRadius,
  },
});
