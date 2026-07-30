import * as React from 'react';
import PropTypes from 'prop-types';
import type { SeriesId } from '../models/seriesType/common';

export interface ScatterMarkerProps {
  /**
   * The series ID.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point.
   */
  dataIndex: number;
  /**
   * The x coordinate of the data point.
   */
  x: number;
  /**
   * The y coordinate of the data point.
   */
  y: number;
  /**
   * The fill color of the marker.
   */
  color: string;
  /**
   * The size of the marker.
   */
  size: number;
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, the marker is faded.
   */
  isFaded: boolean;
  /**
   * Callback fired when clicking on a scatter item.
   * It is always defined: besides `onItemClick`, it makes the item the one keyboard navigation
   * resumes from. Use `cursor` to tell whether the chart is interactive.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
  /**
   * The cursor to display over the marker.
   * @default 'unset'
   */
  cursor?: React.SVGAttributes<SVGElement>['cursor'];
}

function ScatterMarker(props: ScatterMarkerProps) {
  const { seriesId, isFaded, isHighlighted, x, y, color, size, dataIndex, cursor, ...other } =
    props;

  return (
    <circle
      cx={0}
      cy={0}
      r={(isHighlighted ? 1.2 : 1) * size}
      transform={`translate(${x}, ${y})`}
      fill={color}
      opacity={isFaded ? 0.3 : 1}
      cursor={cursor ?? 'unset'}
      {...other}
    />
  );
}

ScatterMarker.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The fill color of the marker.
   */
  color: PropTypes.string.isRequired,
  /**
   * The cursor to display over the marker.
   * @default 'unset'
   */
  cursor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The index of the data point.
   */
  dataIndex: PropTypes.number.isRequired,
  /**
   * If `true`, the marker is faded.
   */
  isFaded: PropTypes.bool.isRequired,
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: PropTypes.bool.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * It is always defined: besides `onItemClick`, it makes the item the one keyboard navigation
   * resumes from. Use `cursor` to tell whether the chart is interactive.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: PropTypes.func,
  /**
   * The series ID.
   */
  seriesId: PropTypes.string.isRequired,
  /**
   * The size of the marker.
   */
  size: PropTypes.number.isRequired,
  /**
   * The x coordinate of the data point.
   */
  x: PropTypes.number.isRequired,
  /**
   * The y coordinate of the data point.
   */
  y: PropTypes.number.isRequired,
} as any;

export { ScatterMarker };
