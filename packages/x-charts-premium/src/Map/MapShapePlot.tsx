'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { SeriesId } from '@mui/x-charts/models';
import { useZAxes } from '@mui/x-charts/hooks';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapShapeSeries } from '../hooks/useMapShapeSeries';
import { useGeoFeatureIndexesByName } from '../hooks/useGeoFeatureIndexesByName';
import { MapShape } from './MapShape';
import { FocusedMapShape } from './FocusedMapShape';
import { mapShapeSeriesConfig } from './seriesConfig';

export interface MapShapePlotProps {
  className?: string;
  /**
   * Fill color applied to every feature path. Overrides item and series colors.
   */
  fill?: string;
  /**
   * Stroke color applied to every feature path.
   * @default 'none'
   */
  stroke?: string;
  /**
   * Stroke width applied to every feature path.
   * @default 1
   */
  strokeWidth?: number;
  /**
   * The id, or ids, of the series to render.
   * If not provided, every `mapShape` series is rendered.
   * Use it to render layers with different styles through multiple `MapShapePlot`.
   */
  seriesId?: SeriesId | SeriesId[];
}

/**
 * Renders series mapShape items.
 */
function MapShapePlot(props: MapShapePlotProps) {
  const { className, fill, stroke = 'none', strokeWidth = 1, seriesId } = props;
  const geoData = useGeoData();
  const path = useGeoPath();
  const allSeries = useMapShapeSeries();
  const series = React.useMemo(() => {
    if (seriesId === undefined) {
      return allSeries;
    }
    const ids = Array.isArray(seriesId) ? seriesId : [seriesId];
    return allSeries.filter((seriesItem) => ids.includes(seriesItem.id));
  }, [allSeries, seriesId]);
  const featureIndexesByName = useGeoFeatureIndexesByName();
  const { zAxis, zAxisIds } = useZAxes();

  if (!geoData || !path || series.length === 0) {
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
        const colorGetter = mapShapeSeriesConfig.colorProcessor(
          seriesItem,
          undefined,
          undefined,
          colorAxis,
        );
        return (
          <g key={id} data-series={id}>
            {data.map((item, dataIndex) => {
              if (item.hidden) {
                return null;
              }
              const featureIndexes = featureIndexesByName.get(item.name);
              if (featureIndexes === undefined || featureIndexes.length === 0) {
                return null;
              }
              return (
                <React.Fragment key={item.name}>
                  {featureIndexes.map((featureIndex) => {
                    const feature = geoData.features[featureIndex];
                    const d = path(feature);
                    const color = fill ?? colorGetter(dataIndex);
                    if (!d || color === null) {
                      return null;
                    }
                    return (
                      <MapShape
                        key={featureIndex}
                        seriesId={id}
                        dataIndex={dataIndex}
                        d={d}
                        color={color}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </g>
        );
      })}
      <FocusedMapShape />
    </g>
  );
}

MapShapePlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * Fill color applied to every feature path. Overrides item and series colors.
   */
  fill: PropTypes.string,
  /**
   * The id, or ids, of the series to render.
   * If not provided, every `mapShape` series is rendered.
   * Use it to render layers with different styles through multiple `MapShapePlot`.
   */
  seriesId: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  /**
   * Stroke color applied to every feature path.
   * @default 'none'
   */
  stroke: PropTypes.string,
  /**
   * Stroke width applied to every feature path.
   * @default 1
   */
  strokeWidth: PropTypes.number,
} as any;

export { MapShapePlot };
