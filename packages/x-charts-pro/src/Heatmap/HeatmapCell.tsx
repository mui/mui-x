import { styled } from '@mui/material/styles';
import type * as React from 'react';
import type { SeriesId } from '../models';
import type { HeatmapClasses } from './heatmapClasses';

export interface HeatmapCellOwnerState {
  seriesId: SeriesId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<HeatmapClasses>;
  value: number;
}

/**
 * @deprecated Use `HeatmapCellOwnerState` instead.
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
