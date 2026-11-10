'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useInteractionItemProps } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/internals';
import { useItemHighlightState } from '../hooks';

export type MapShapeProps = Omit<React.SVGProps<SVGPathElement>, 'ref'> & {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The name of the geographic feature.
   */
  featureName: string;
  /**
   * The SVG path of the shape.
   */
  d: string;
  /**
   * The color of the shape.
   */
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
  const { seriesId, featureName, d, color, onClick, ...other } = props;

  const identifier = React.useMemo(
    () => ({ type: 'mapShape' as const, seriesId, name: featureName }),
    [seriesId, featureName],
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
      data-name={featureName}
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
  /**
   * The name of the geographic feature.
   */
  featureName: PropTypes.string.isRequired,
  /**
   * The id of the series the element belongs to.
   */
  seriesId: PropTypes.string.isRequired,
} as any;

export { MapShape };
