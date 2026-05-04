'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useUtilityClasses } from './scatterClasses';
import { useScatterItemPosition } from './useScatterItemPosition';

export function FocusedScatterMark({ className, ...props }: React.SVGAttributes<SVGRectElement>) {
  const theme = useTheme();
  const focusedItem = useFocusedItem();
  const classes = useUtilityClasses();

  const resolved = useScatterItemPosition(focusedItem?.type === 'scatter' ? focusedItem : null);

  if (!resolved) {
    return null;
  }

  const { cx, cy, series } = resolved;
  const size = series.markerSize + 3;

  return (
    <rect
      className={clsx(classes.focusedMark, className)}
      fill="none"
      stroke={(theme.vars ?? theme).palette.text.primary}
      strokeWidth={2}
      x={cx - size}
      y={cy - size}
      width={2 * size}
      height={2 * size}
      rx={3}
      ry={3}
      {...props}
    />
  );
}
