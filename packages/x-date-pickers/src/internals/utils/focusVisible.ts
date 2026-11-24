import type * as React from 'react';
import type { CSSObject, Theme } from '@mui/material/styles';

const TODAY_MARKER_CLEARANCE = 2;
const SELECTED_BAND_WIDTH = 2;
const DEFAULT_RING_SHADOW_VAR = '--_focusVisible-shadow';

type FocusVisibleStyle = CSSObject | React.CSSProperties;

function joinBoxShadows(...boxShadows: unknown[]) {
  return boxShadows
    .filter(
      (boxShadow): boxShadow is string =>
        typeof boxShadow === 'string' &&
        boxShadow.trim() !== 'none' &&
        !boxShadow.includes(DEFAULT_RING_SHADOW_VAR),
    )
    .join(', ');
}

export function getTodayFocusVisible(theme: Theme, markerColor: string): FocusVisibleStyle {
  const marker = `inset 0 0 0 1px ${markerColor}`;
  const insetRing = theme.applyFocusVisible?.('inset');
  if (!insetRing) {
    if (!theme.focusVisible) {
      return {};
    }
    return {
      ...theme.focusVisible,
      boxShadow: joinBoxShadows(marker, theme.focusVisible.boxShadow),
    };
  }
  const { outlineOffset = 0 } = insetRing;
  return {
    ...insetRing,
    outlineOffset:
      typeof outlineOffset === 'number'
        ? outlineOffset - TODAY_MARKER_CLEARANCE
        : `calc(${outlineOffset} - ${TODAY_MARKER_CLEARANCE}px)`,
    boxShadow: joinBoxShadows(marker, insetRing.boxShadow),
  };
}

export function getSelectedFocusVisible(theme: Theme, bandColor: string): FocusVisibleStyle {
  const insetRing = theme.applyFocusVisible?.('inset');
  if (!insetRing) {
    return {};
  }
  const { outlineOffset = 0 } = insetRing;
  const bandSpread =
    typeof outlineOffset === 'number'
      ? `${Math.max(-outlineOffset, 0) + SELECTED_BAND_WIDTH}px`
      : `calc(-1 * (${outlineOffset}) + ${SELECTED_BAND_WIDTH}px)`;
  return {
    boxShadow: joinBoxShadows(`inset 0 0 0 ${bandSpread} ${bandColor}`, insetRing.boxShadow),
  };
}
