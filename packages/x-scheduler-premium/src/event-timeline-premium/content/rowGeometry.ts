import type { Theme } from '@mui/material/styles';

// `EventsCell` is the tallest in-flow child of the body row and therefore drives
// its rendered height. These helpers mirror the CSS so the virtualizer's
// `getRowHeight` returns the same value the browser will lay out.
//
// CSS for EventsCell:
//   padding: theme.spacing(2, 0);
//   grid-template-rows: repeat(var(--lane-count, 1),
//                              minmax(calc(${body2.lineHeight}em + ${theme.spacing(1.125)}), auto));
//   row-gap: theme.spacing(0.5);
//   border-bottom: 1px solid divider;
//
// `em` in the grid track resolves against the EventsCell's font-size, which
// inherits `theme.typography.body2.fontSize` from the `EventTimelinePremium` root.
export function getEventsCellLaneMinHeight(theme: Theme): number {
  const fontSizeRem = parseFloat(String(theme.typography.body2.fontSize));
  const fontSize =
    Number.isFinite(fontSizeRem) && fontSizeRem > 0
      ? fontSizeRem * (theme.typography.htmlFontSize ?? 16)
      : 14;
  const lineHeight = Number(theme.typography.body2.lineHeight) || 1.43;
  const extra = parseFloat(theme.spacing(1.125)) || 9;
  return lineHeight * fontSize + extra;
}

export function getRowHeightForLaneCount(theme: Theme, laneCount: number): number {
  const { topPadding, laneMinHeight, laneGap } = getEventsCellLaneMetrics(theme);
  const lanes = Math.max(1, laneCount);
  // 2 paddings + N lanes + (N-1) row-gaps + bottom border.
  return 2 * topPadding + lanes * laneMinHeight + (lanes - 1) * laneGap + 1;
}

export interface EventsCellLaneMetrics {
  /**
   * The `EventsCell` vertical padding, above the first lane.
   */
  topPadding: number;
  /**
   * The minimum height of one lane (one grid track).
   */
  laneMinHeight: number;
  /**
   * The gap between two consecutive lanes.
   */
  laneGap: number;
}

/**
 * The vertical metrics of the lanes inside an `EventsCell`, mirroring its CSS.
 */
export function getEventsCellLaneMetrics(theme: Theme): EventsCellLaneMetrics {
  return {
    topPadding: parseFloat(theme.spacing(2)) || 16,
    laneMinHeight: getEventsCellLaneMinHeight(theme),
    laneGap: parseFloat(theme.spacing(0.5)) || 4,
  };
}
