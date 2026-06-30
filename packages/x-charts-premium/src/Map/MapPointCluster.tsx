'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { getSymbol } from '@mui/x-charts/internals';
import type { SymbolsTypes } from '@mui/x-charts/internals';
import { ChartsText } from '@mui/x-charts/ChartsText';

export interface MapPointClusterProps {
  x: number;
  y: number;
  color: string;
  shape: SymbolsTypes;
  /** The marker area, in square pixels. */
  size: number;
  /** The number of points collapsed into the cluster. */
  count: number;
  /** The aggregated value of the cluster, shown in the native tooltip. */
  value: number;
  stroke?: string;
  strokeWidth?: number;
}

const MapPointClusterRoot = styled('path', {
  name: 'MuiMapPoint',
  slot: 'Cluster',
})({
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: '50ms',
  transitionTimingFunction: 'ease-in',
});

/**
 * Renders a single marker standing in for several points collapsed together,
 * labeled with the number of members.
 */
function MapPointCluster(props: MapPointClusterProps) {
  const { x, y, color, shape, size, count, value, stroke, strokeWidth } = props;

  const d = d3Symbol(d3SymbolsFill[getSymbol(shape)], size)()!;

  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden>
      <MapPointClusterRoot d={d} fill={color} stroke={stroke} strokeWidth={strokeWidth}>
        <title>{`${count} points${Number.isFinite(value) ? ` · ${value}` : ''}`}</title>
      </MapPointClusterRoot>
      <ChartsText
        text={`${count}`}
        style={{
          textAnchor: 'middle',
          dominantBaseline: 'central',
          pointerEvents: 'none',
          fontWeight: 600,
          fill: '#fff',
        }}
      />
    </g>
  );
}

MapPointCluster.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  /**
   * The number of points collapsed into the cluster.
   */
  count: PropTypes.number.isRequired,
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
  /**
   * The marker area, in square pixels.
   */
  size: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  /**
   * The aggregated value of the cluster, shown in the native tooltip.
   */
  value: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { MapPointCluster };
