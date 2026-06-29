'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useZAxes } from '@mui/x-charts/hooks';
import type { SymbolsTypes } from '@mui/x-charts/internals';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapPointSeries } from '../hooks/useMapPointSeries';
import { isCoordinateHidden } from './isHidden';
import { MapPoint } from './MapPoint';
import { FocusedMapPoint } from './FocusedMapPoint';
import { mapPointSeriesConfig } from './pointSeriesConfig';

export interface MapPointPlotProps {
  className?: string;
  /**
   * The shape of the markers.
   * @default 'circle'
   */
  shape?: SymbolsTypes;
  /**
   * The size of the markers, as the symbol area in square pixels.
   * @default 64
   */
  size?: number;
  /**
   * Fill color applied to every marker. Overrides item and series colors.
   */
  fill?: string;
  /**
   * Stroke color applied to every marker.
   * @default 'none'
   */
  stroke?: string;
  /**
   * Stroke width applied to every marker.
   * @default 1
   */
  strokeWidth?: number;
  /**
   * If `true`, renders the label of each point next to its marker.
   * @default false
   */
  showLabels?: boolean;
}

/**
 * Renders series mapPoint items at their projected coordinates.
 */
function MapPointPlot(props: MapPointPlotProps) {
  const {
    className,
    shape = 'circle',
    size = 64,
    fill,
    stroke = 'none',
    strokeWidth = 1,
    showLabels = false,
  } = props;
  const path = useGeoPath();
  const series = useMapPointSeries();
  const { zAxis, zAxisIds } = useZAxes();

  const projection = (path?.projection() ?? null) as GeoProjection | null;

  if (!path || !projection || series.length === 0) {
    return null;
  }

  const defaultZAxisId = zAxisIds[0];

  return (
    <g className={className}>
      {series.map((seriesItem) => {
        const { data, id, hidden, colorAxisId } = seriesItem;
        if (hidden) {
          return null;
        }
        const colorAxis = zAxis[colorAxisId ?? defaultZAxisId];
        const colorGetter = mapPointSeriesConfig.colorProcessor(
          seriesItem,
          undefined,
          undefined,
          colorAxis,
        );
        return (
          <g key={id} data-series={id}>
            {data.map((item, dataIndex) => {
              if (item.hidden || isCoordinateHidden(projection, item.coordinates)) {
                return null;
              }
              const point = projection(item.coordinates);
              if (!point) {
                return null;
              }
              return (
                <MapPoint
                  key={item.id ?? dataIndex}
                  seriesId={id}
                  dataIndex={dataIndex}
                  x={point[0]}
                  y={point[1]}
                  color={fill ?? colorGetter(dataIndex)}
                  shape={shape}
                  size={size}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  label={showLabels ? item.label : undefined}
                />
              );
            })}
          </g>
        );
      })}
      <FocusedMapPoint shape={shape} size={size} />
    </g>
  );
}

MapPointPlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * Fill color applied to every marker. Overrides item and series colors.
   */
  fill: PropTypes.string,
  /**
   * The shape of the markers.
   * @default 'circle'
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']),
  /**
   * If `true`, renders the label of each point next to its marker.
   * @default false
   */
  showLabels: PropTypes.bool,
  /**
   * The size of the markers, as the symbol area in square pixels.
   * @default 64
   */
  size: PropTypes.number,
  /**
   * Stroke color applied to every marker.
   * @default 'none'
   */
  stroke: PropTypes.string,
  /**
   * Stroke width applied to every marker.
   * @default 1
   */
  strokeWidth: PropTypes.number,
} as any;

export { MapPointPlot };
