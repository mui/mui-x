'use client';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { useDrawingArea, useZAxes } from '@mui/x-charts/hooks';
import { getSymbol } from '@mui/x-charts/internals';
import type { SymbolsTypes } from '@mui/x-charts/internals';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useFocusedItem } from '../hooks';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapPointSeries } from '../hooks/useMapPointSeries';
import { projectVisiblePoint } from './isHidden';
import getSize from './pointSeriesConfig/getSize';

export interface FocusedMapPointProps {
  shape: SymbolsTypes;
  size: number;
}

const FocusedMapPointRoot = styled('path', {
  name: 'MuiMapPoint',
  slot: 'Focused',
})(({ theme }) => ({
  fill: 'none',
  stroke: (theme.vars ?? theme).palette.text.primary,
  strokeWidth: 2,
  pointerEvents: 'none',
}));

/**
 * Renders an outline around the map point currently focused through keyboard navigation.
 */
function FocusedMapPoint({ shape, size }: FocusedMapPointProps) {
  const focusedItem = useFocusedItem();
  const path = useGeoPath();
  const series = useMapPointSeries();
  const drawingArea = useDrawingArea();
  const { zAxis, zAxisIds } = useZAxes();

  if (focusedItem?.type !== 'mapPoint' || !path) {
    return null;
  }

  const seriesItem = series.find((item) => item.id === focusedItem.seriesId);
  if (!seriesItem || seriesItem.hidden) {
    return null;
  }

  const dataItem = seriesItem.data[focusedItem.dataIndex];
  if (!dataItem || dataItem.hidden) {
    return null;
  }

  const projection = path.projection() as GeoProjection | null;
  if (!projection) {
    return null;
  }

  const point = projectVisiblePoint(projection, dataItem.coordinates, drawingArea);
  if (!point) {
    return null;
  }

  // Match the focus ring to the marker size, including data-driven bubble sizes.
  const sizeAxis = zAxis[seriesItem.sizeAxisId ?? zAxisIds[0]];
  const markerSize = getSize(seriesItem, size, sizeAxis)(focusedItem.dataIndex);
  const d = d3Symbol(d3SymbolsFill[getSymbol(shape)], markerSize * 1.8)()!;

  return (
    <g aria-hidden>
      <FocusedMapPointRoot d={d} transform={`translate(${point[0]}, ${point[1]})`} />
    </g>
  );
}

FocusedMapPoint.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
  size: PropTypes.number.isRequired,
} as any;

export { FocusedMapPoint };
