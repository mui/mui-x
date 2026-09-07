'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { DEFAULT_TICK_LABEL_FONT_SIZE } from '../constants';
import type { ChartsTextStyle } from './getWordsByLines';

/**
 * The font the axes render their tick labels with.
 * Axis auto-sizing measures outside React, so it cannot read the theme itself and needs this handed
 * to it. Keep in sync with the style `useAxisTicksProps` renders the ticks with.
 */
export function useDefaultTickLabelStyle(): ChartsTextStyle {
  const theme = useTheme();
  const { fontFamily, fontStyle, fontWeight, letterSpacing, textTransform } =
    theme.typography.caption;

  return React.useMemo(
    () => ({
      fontFamily,
      fontStyle,
      fontWeight,
      letterSpacing,
      textTransform,
      fontSize: DEFAULT_TICK_LABEL_FONT_SIZE,
    }),
    [fontFamily, fontStyle, fontWeight, letterSpacing, textTransform],
  );
}
