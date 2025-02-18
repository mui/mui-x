import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesId } from '../models/seriesType/common';
import { useScatterSeries } from '../hooks';

export interface ScatterMarkerProps {
  ownerState: ScatterMarkerOwnerState;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

export interface ScatterMarkerOwnerState {
  /**
   * ID of the series this marker belongs to.
   */
  id: SeriesId;
  dataIndex: number;
  x: number;
  y: number;
  color: string;
  isHighlighted: boolean;
  isFaded: boolean;
}

/**
 * TODO: Document
 */
function ScatterMarker({ ownerState, ...other }: ScatterMarkerProps) {
  const series = useScatterSeries(ownerState.id);

  if (!series) {
    return null;
  }

  return (
    <circle
      cx={0}
      cy={0}
      r={(ownerState.isHighlighted ? 1.2 : 1) * series.markerSize}
      transform={`translate(${ownerState.x}, ${ownerState.y})`}
      fill={ownerState.color}
      opacity={ownerState.isFaded ? 0.3 : 1}
      {...other}
    />
  );
}

ScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: PropTypes.func,
  ownerState: PropTypes.shape({
    color: PropTypes.string.isRequired,
    dataIndex: PropTypes.number.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
} as any;

export { ScatterMarker };
