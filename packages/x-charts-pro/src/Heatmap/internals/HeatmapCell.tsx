import { styled } from '@mui/material/styles';
import type * as React from 'react';
import type { HeatmapCellOwnerState } from '../heatmapChartClasses';

export { type HeatmapCellOwnerState };

/**
 * @deprecated Use `HeatmapCellOwnerState` from `../heatmapChartClasses` instead.
 */
export type HeatmapItemOwnerState = HeatmapCellOwnerState;

export interface HeatmapCellProps extends React.ComponentPropsWithRef<'rect'> {
  x: number;
  y: number;
  width: number;
  height: number;
  ownerState: HeatmapCellOwnerState;
}

export const HeatmapCell = styled('rect', {
  name: 'MuiHeatmap',
  slot: 'Cell',
  overridesResolver: (_, styles) => styles.cell,
})<{ ownerState: HeatmapCellOwnerState }>(({ ownerState }) => ({
  filter:
    (ownerState.isHighlighted && 'saturate(120%)') ||
    (ownerState.isFaded && 'saturate(80%)') ||
    undefined,
  fill: ownerState.color,
  shapeRendering: 'crispEdges',
}));
