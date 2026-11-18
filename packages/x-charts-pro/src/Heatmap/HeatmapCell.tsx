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
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<HeatmapClasses>;
  value: number;
}

/**
 * @deprecated Use `HeatmapCellOwnerState` instead.
 */
export type HeatmapItemOwnerState = HeatmapCellOwnerState;

export interface HeatmapCellProps extends React.ComponentPropsWithRef<'rect'> {
  /**
   * The position of the element in the x-axis.
   */
  x: number;
  /**
   * The position of the element in the y-axis.
   */
  y: number;
  /**
   * The width of the element.
   */
  width: number;
  /**
   * The height of the element.
   */
  height: number;
  /**
   * @ignore
   */
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

HeatmapCell.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The height of the element.
   */
  height: PropTypes.number.isRequired,
  /**
   * @ignore
   */
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    seriesId: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * The width of the element.
   */
  width: PropTypes.number.isRequired,
  /**
   * The position of the element in the x-axis.
   */
  x: PropTypes.number.isRequired,
  /**
   * The position of the element in the y-axis.
   */
  y: PropTypes.number.isRequired,
} as any;

export { HeatmapCell };
