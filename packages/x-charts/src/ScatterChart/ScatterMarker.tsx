import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { ScatterMarkerElementProps, ScatterMarkerProps } from './ScatterMarker.types';

function ScatterMarkerElement({
  x,
  y,
  onItemClick,
  dataIndex,
  color,
  isHighlighted,
  isFaded,
  series,
  interactionProps,
  slots,
  slotProps,
}: ScatterMarkerElementProps) {
  const Marker = slots?.marker ?? ScatterMarker;

  const markerProps = useSlotProps({
    elementType: Marker,
    externalSlotProps: slotProps?.marker,
    additionalProps: {
      series,
      x,
      y,
      dataIndex,
      color,
      isHighlighted,
      isFaded,
      onClick: onItemClick,
      cursor: onItemClick ? 'pointer' : 'unset',
      ...interactionProps,
    },
    ownerState: {},
  });

  return <Marker {...markerProps} />;
}

/**
 * TODO: Document
 */
function ScatterMarker({
  series,
  isFaded,
  isHighlighted,
  x,
  y,
  color,
  ...other
}: ScatterMarkerProps) {
  return (
    <circle
      cx={0}
      cy={0}
      r={(isHighlighted ? 1.2 : 1) * series.markerSize}
      transform={`translate(${x}, ${y})`}
      fill={color}
      opacity={isFaded ? 0.3 : 1}
      {...other}
    />
  );
}

ScatterMarkerElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  interactionProps: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.shape({
      onPointerDown: PropTypes.func.isRequired,
      onPointerEnter: PropTypes.func.isRequired,
      onPointerLeave: PropTypes.func.isRequired,
    }),
  ]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { ScatterMarkerElement };
