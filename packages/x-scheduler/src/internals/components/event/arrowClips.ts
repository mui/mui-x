import type { Theme } from '@mui/material/styles';

export const ARROW_DEPTH = 8; // px - depth of the chevron point
const LEFT_ARROW_CLIP = `polygon(${ARROW_DEPTH}px 0, 100% 0, 100% 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;
const RIGHT_ARROW_CLIP = `polygon(0 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, 0 100%)`;
const BOTH_ARROWS_CLIP = `polygon(${ARROW_DEPTH}px 0, calc(100% - ${ARROW_DEPTH}px) 0, 100% 50%, calc(100% - ${ARROW_DEPTH}px) 100%, ${ARROW_DEPTH}px 100%, 0 50%)`;

/**
 * Cuts a chevron on the edges of an event that continues before or after the visible range.
 * `clip-path` isn't flipped by the stylis RTL plugin, so the chevron side follows the theme direction.
 */
export const getArrowEdgeStyles = (theme: Theme, padding: number) => {
  const isRtl = theme.direction === 'rtl';
  return {
    '&[data-starting-before-edge]': {
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,
      clipPath: isRtl ? RIGHT_ARROW_CLIP : LEFT_ARROW_CLIP,
      paddingInlineStart: padding,
    },
    '&[data-ending-after-edge]': {
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,
      clipPath: isRtl ? LEFT_ARROW_CLIP : RIGHT_ARROW_CLIP,
      paddingInlineEnd: padding,
    },
    '&[data-starting-before-edge][data-ending-after-edge]': {
      clipPath: BOTH_ARROWS_CLIP,
    },
  };
};

/**
 * The chevron clip also clips the focus outline away, so focused events fall back to a plain
 * rounded rectangle.
 */
export const getArrowFocusVisibleStyles = (borderRadius: number | string) => ({
  '&[data-starting-before-edge]:focus-visible, &[data-ending-after-edge]:focus-visible': {
    clipPath: 'none',
    borderRadius,
  },
});
