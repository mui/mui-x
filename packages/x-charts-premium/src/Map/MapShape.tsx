'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { type SeriesId, useInteractionItemProps } from '@mui/x-charts/internals';
import { useItemHighlightState } from '../hooks';

export type MapShapeProps = Omit<React.SVGProps<SVGPathElement>, 'ref'> & {
  seriesId: SeriesId;
  dataIndex: number;
  name: string;
  d: string;
  color: string;
};

const MapShapeRoot = styled('path', {
  name: 'MuiMapShape',
  slot: 'Root',
})({
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: '50ms',
  transitionTimingFunction: 'ease-in',
});

function MapShape(props: MapShapeProps) {
  const { seriesId, dataIndex, name, d, color, onClick, ...other } = props;

  const identifier = React.useMemo(
    () => ({ type: 'mapShape' as const, seriesId, name }),
    [seriesId, name],
  );
  const interactionProps = useInteractionItemProps(identifier);
  const highlightState = useItemHighlightState(identifier);
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  return (
    <MapShapeRoot
      d={d}
      fill={color}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      data-index={dataIndex}
      data-highlighted={isHighlighted || undefined}
      data-faded={isFaded || undefined}
      filter={isHighlighted ? 'brightness(120%)' : undefined}
      opacity={isFaded ? 0.3 : 1}
      {...other}
      {...interactionProps}
    />
  );
}

MapShape.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  dataIndex: PropTypes.number.isRequired,
  seriesId: PropTypes.string.isRequired,
} as any;

export { MapShape };
