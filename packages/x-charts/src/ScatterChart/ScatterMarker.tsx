import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { SeriesId } from '../models/seriesType/common';
import { ScatterMarkerSlotExtension } from './ScatterMarker.types';

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
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

function DefaultScatterMarker(props: ScatterMarkerProps) {
  const { seriesId, isFaded, isHighlighted, x, y, color, size, dataIndex, ...other } = props;

  return (
    <circle
      cx={0}
      cy={0}
      r={(isHighlighted ? 1.2 : 1) * size}
      transform={`translate(${x}, ${y})`}
      fill={color}
      opacity={isFaded ? 0.3 : 1}
      cursor={other.onClick ? 'pointer' : 'unset'}
      {...other}
    />
  );
}
DefaultScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The fill color of the marker.
   */
  color: PropTypes.string.isRequired,
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
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: PropTypes.func,
  /**
   * The series ID.
   */
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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

/**
 * The marker that is rendered for each data point in the scatter chart.
 * By default, it is a circle.
 */
const ScatterMarker = React.forwardRef<{}, ScatterMarkerProps & ScatterMarkerSlotExtension>(
  function ScatterMarkerSlotWrapper(props, ref) {
    const themedProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name: 'MuiScatterMarker',
    });
    const slotPropName = 'marker';

    const { slots, slotProps, ...other } = themedProps as {
      slots?: Record<string, any>;
      slotProps?: Record<string, any>;
    };

    // Can be a function component or a forward ref component.
    const Component = slots?.[slotPropName] ?? DefaultScatterMarker;

    const { ownerState, ...outProps } = useSlotProps({
      elementType: Component,
      externalSlotProps: slotProps?.[slotPropName],
      additionalProps: other,
      ownerState: {},
    });

    return <Component {...outProps} ref={ref} />;
  },
);

ScatterMarker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The fill color of the marker.
   */
  color: PropTypes.string.isRequired,
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
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick: PropTypes.func,
  /**
   * The series ID.
   */
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The size of the marker.
   */
  size: PropTypes.number.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
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
