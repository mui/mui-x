'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { useInteractionItemProps, getSymbol } from '@mui/x-charts/internals';
import type { SeriesId, SymbolsTypes } from '@mui/x-charts/internals';
import { ChartsText } from '@mui/x-charts/ChartsText';
import { useItemHighlightState } from '../hooks';

export type MapPointProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color'> & {
  seriesId: SeriesId;
  dataIndex: number;
  x: number;
  y: number;
  color: string;
  shape: SymbolsTypes;
  size: number;
  label?: string;
};

const MapPointRoot = styled('path', {
  name: 'MuiMapPoint',
  slot: 'Root',
})({
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: '50ms',
  transitionTimingFunction: 'ease-in',
});

function MapPoint(props: MapPointProps) {
  const { seriesId, dataIndex, x, y, color, shape, size, label, onClick, ...other } = props;

  const identifier = React.useMemo(
    () => ({ type: 'mapPoint' as const, seriesId, dataIndex }),
    [seriesId, dataIndex],
  );
  const interactionProps = useInteractionItemProps(identifier);
  const highlightState = useItemHighlightState(identifier);
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  const d = d3Symbol(d3SymbolsFill[getSymbol(shape)], (isHighlighted ? 1.4 : 1) * size)()!;
  const labelOffset = Math.sqrt(size) / 2 + 4;

  return (
    <React.Fragment>
      <MapPointRoot
        d={d}
        transform={`translate(${x}, ${y})`}
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
      {label !== undefined && (
        <ChartsText
          aria-hidden
          x={x + labelOffset}
          y={y}
          text={label}
          opacity={isFaded ? 0.3 : 1}
          style={{ textAnchor: 'start', dominantBaseline: 'central', pointerEvents: 'none' }}
        />
      )}
    </React.Fragment>
  );
}

MapPoint.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  dataIndex: PropTypes.number.isRequired,
  label: PropTypes.string,
  seriesId: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
  size: PropTypes.number.isRequired,
} as any;

export { MapPoint };
