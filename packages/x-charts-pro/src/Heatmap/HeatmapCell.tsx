import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
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

const HeatmapCellRoot = styled('rect', {
  name: 'MuiHeatmap',
  slot: 'Cell',
  overridesResolver: (_, styles) => styles.cell,
})<HeatmapCellProps>(({ ownerState }) => ({
  filter:
    (ownerState.isHighlighted && 'saturate(120%)') ||
    (ownerState.isFaded && 'saturate(80%)') ||
    undefined,
  fill: ownerState.color,
  shapeRendering: 'crispEdges',
}));

/**
 * Demos:
 *
 * - [Heatmap](https://mui.com/x/react-charts/heatmap/)
 *
 * API:
 *
 * - [HeatmapCell API](https://mui.com/x/api/charts/heatmap-cell/)
 */
const HeatmapCell = React.forwardRef<SVGRectElement, HeatmapCellProps>(
  function HeatmapCell(props, ref) {
    return <HeatmapCellRoot ref={ref} {...props} />;
  },
);

HeatmapCell.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  height: PropTypes.number.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    seriesId: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { HeatmapCell };
