import * as React from 'react';
import PropTypes from 'prop-types';
import { SeriesId } from '../models/seriesType/common';
import { consumeSlots } from '../internals/consumeSlots';
import { ScatterMarkerSlotExtension } from './ScatterMarker.types';

export interface ScatterMarkerProps {
  seriesId: SeriesId;
  dataIndex: number;
  x: number;
  y: number;
  color: string;
  size: number;
  isHighlighted: boolean;
  isFaded: boolean;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

/**
 * TODO: Document
 */
const ScatterMarker = consumeSlots(
  'MuiChartsScatterMarker',
  'marker',
  {
    // Currently required to make the prop types work
    classesResolver: (_: ScatterMarkerProps & ScatterMarkerSlotExtension) => ({}),
  },
  function ScatterMarker(props: ScatterMarkerProps, ref: React.Ref<SVGCircleElement>) {
    const { seriesId, isFaded, isHighlighted, x, y, color, size, dataIndex, ...other } = props;

    return (
      <circle
        cx={0}
        cy={0}
        r={(isHighlighted ? 1.2 : 1) * size}
        transform={`translate(${x}, ${y})`}
        fill={color}
        opacity={isFaded ? 0.3 : 1}
        ref={ref}
        {...other}
      />
    );
  },
);

ScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  dataIndex: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { ScatterMarker };
