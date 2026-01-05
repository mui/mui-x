import { styled } from '@mui/material/styles';
import type * as React from 'react';
import type { SeriesId } from '@mui/x-charts/models';
import type { HeatmapClasses } from './heatmapClasses';

export interface HeatmapItemOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<HeatmapClasses>;
}

export interface HeatmapCellProps extends React.ComponentPropsWithRef<'rect'> {
  x: number;
  y: number;
  width: number;
  height: number;
  ownerState: HeatmapItemOwnerState;
}

export const HeatmapCell = styled('rect', {
  name: 'MuiHeatmap',
  slot: 'Cell',
  overridesResolver: (_, styles) => styles.arc, // FIXME: Inconsistent naming with slot
})<{ ownerState: HeatmapItemOwnerState }>(({ ownerState }) => ({
  filter:
    (ownerState.isHighlighted && 'saturate(120%)') ||
    (ownerState.isFaded && 'saturate(80%)') ||
    undefined,
  fill: ownerState.color,
  shapeRendering: 'crispEdges',
}));
