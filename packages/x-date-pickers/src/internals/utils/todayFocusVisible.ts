import type { Theme } from '@mui/material/styles';

const TODAY_MARKER_CLEARANCE = 2;

export function getTodayFocusVisible(theme: Theme) {
  const insetRing = theme.applyFocusVisible?.('inset');
  if (!insetRing) {
    return theme.focusVisible;
  }
  const { outlineOffset = 0 } = insetRing;
  return {
    ...insetRing,
    outlineOffset:
      typeof outlineOffset === 'number'
        ? outlineOffset - TODAY_MARKER_CLEARANCE
        : `calc(${outlineOffset} - ${TODAY_MARKER_CLEARANCE}px)`,
  };
}
