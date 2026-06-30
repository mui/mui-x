'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrawingArea, useZAxes } from '@mui/x-charts/hooks';
import type { SymbolsTypes } from '@mui/x-charts/internals';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapPointSeries } from '../hooks/useMapPointSeries';
import { projectVisiblePoint } from './isHidden';
import { clusterMapPoints } from './clusterMapPoints';
import type { ProjectedMapPoint } from './clusterMapPoints';
import { MapPoint } from './MapPoint';
import { MapPointCluster } from './MapPointCluster';
import { FocusedMapPoint } from './FocusedMapPoint';
import { mapPointSeriesConfig } from './pointSeriesConfig';
import getSize from './pointSeriesConfig/getSize';

/**
 * Clustering options, collapsing nearby points into a single marker.
 */
export interface MapPointClusterOptions {
  /**
   * The clustering radius in pixels. Points closer than this distance are merged.
   * @default 40
   */
  radius?: number;
}

const DEFAULT_CLUSTER_RADIUS = 40;

function resolveClusterRadius(cluster: boolean | MapPointClusterOptions): number {
  if (cluster === true) {
    return DEFAULT_CLUSTER_RADIUS;
  }
  if (cluster && typeof cluster === 'object') {
    return cluster.radius ?? DEFAULT_CLUSTER_RADIUS;
  }
  return 0;
}

export interface MapPointPlotProps {
  className?: string;
  /**
   * The shape of the markers.
   * @default 'circle'
   */
  shape?: SymbolsTypes;
  /**
   * The base size of the markers, as the symbol area in square pixels.
   * Used as the fallback when no size axis is set, turning the series into a bubble map.
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
  /**
   * Collapses points that are close to each other on screen into a single marker
   * showing the member count. Pass `true` for the default radius, or an object to
   * tune it. Clustering is zoom-aware: zooming in spreads points apart and splits clusters.
   * @default false
   */
  cluster?: boolean | MapPointClusterOptions;
}

/**
 * Renders series mapPoint items at their projected coordinates.
 *
 * With a size axis it behaves as a bubble map, scaling each marker from its `value`.
 * With `cluster` enabled, nearby points collapse into aggregated markers.
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
    cluster = false,
  } = props;
  const path = useGeoPath();
  const series = useMapPointSeries();
  const drawingArea = useDrawingArea();
  const { zAxis, zAxisIds } = useZAxes();

  const projection = (path?.projection() ?? null) as GeoProjection | null;

  if (!path || !projection || series.length === 0) {
    return null;
  }

  const defaultZAxisId = zAxisIds[0];
  const clusterRadius = resolveClusterRadius(cluster);
  const clusteringEnabled = clusterRadius > 0;

  return (
    <g className={className}>
      {series.map((seriesItem) => {
        const { data, id, hidden, colorAxisId, sizeAxisId } = seriesItem;
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
        const sizeAxis = zAxis[sizeAxisId ?? defaultZAxisId];
        const sizeGetter = getSize(seriesItem, size, sizeAxis);
        const sizeScale = sizeAxis?.sizeScale;

        const projected: ProjectedMapPoint[] = [];
        data.forEach((item, dataIndex) => {
          if (item.hidden) {
            return;
          }
          const point = projectVisiblePoint(projection, item.coordinates, drawingArea);
          if (!point) {
            return;
          }
          projected.push({ x: point[0], y: point[1], dataIndex, value: item.value });
        });

        const renderPoint = (x: number, y: number, dataIndex: number) => (
          <MapPoint
            key={data[dataIndex].id ?? dataIndex}
            seriesId={id}
            dataIndex={dataIndex}
            x={x}
            y={y}
            color={fill ?? colorGetter(dataIndex)}
            shape={shape}
            size={sizeGetter(dataIndex)}
            stroke={stroke}
            strokeWidth={strokeWidth}
            label={showLabels ? data[dataIndex].label : undefined}
          />
        );

        let children: React.ReactNode;
        if (!clusteringEnabled) {
          children = projected.map((point) => renderPoint(point.x, point.y, point.dataIndex));
        } else {
          children = clusterMapPoints(projected, { radius: clusterRadius }).map((group, index) => {
            if (group.dataIndices.length === 1) {
              return renderPoint(group.x, group.y, group.dataIndices[0]);
            }
            const count = group.dataIndices.length;
            let clusterSize: number;
            if (sizeScale) {
              const mapped = sizeScale(group.value);
              clusterSize = mapped != null && !Number.isNaN(mapped) ? mapped : size;
            } else {
              clusterSize = Math.min(size * Math.sqrt(count), size * 4);
            }
            return (
              <MapPointCluster
                key={`cluster-${index}`}
                x={group.x}
                y={group.y}
                color={fill ?? seriesItem.color}
                shape={shape}
                size={clusterSize}
                count={count}
                value={group.value}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          });
        }

        return (
          <g key={id} data-series={id}>
            {children}
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
   * Collapses points that are close to each other on screen into a single marker
   * showing the member count. Pass `true` for the default radius, or an object to
   * tune it. Clustering is zoom-aware: zooming in spreads points apart and splits clusters.
   * @default false
   */
  cluster: PropTypes.oneOfType([
    PropTypes.shape({
      radius: PropTypes.number,
    }),
    PropTypes.bool,
  ]),
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
   * The base size of the markers, as the symbol area in square pixels.
   * Used as the fallback when no size axis is set, turning the series into a bubble map.
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
