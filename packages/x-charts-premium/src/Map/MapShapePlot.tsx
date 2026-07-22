'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useZAxes } from '@mui/x-charts/hooks';
import { useActivateChartItem } from '@mui/x-charts/internals';
import type { MapShapeItemIdentifier } from '../models/seriesType/mapShape';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapShapeSeries } from '../hooks/useMapShapeSeries';
import { useGeoFeatureIndexesByName } from '../hooks/useGeoFeatureIndexesByName';
import { MapShape } from './MapShape';
import { FocusedMapShape } from './FocusedMapShape';
import { mapShapeSeriesConfig } from './seriesConfig';

export interface MapShapePlotProps {
  /**
   * Callback fired when clicking on a map shape.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {MapShapeItemIdentifier} mapShapeItemIdentifier The identifier of the clicked map shape.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    mapShapeItemIdentifier: MapShapeItemIdentifier,
  ) => void;
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
}

/**
 * Renders series mapShape items.
 */
function MapShapePlot(props: MapShapePlotProps) {
  const { className, fill, stroke = 'none', strokeWidth = 1, onItemClick } = props;
  const geoData = useGeoData();
  const path = useGeoPath();
  const series = useMapShapeSeries();
  const featureIndexesByName = useGeoFeatureIndexesByName();
  const { zAxis, zAxisIds } = useZAxes();
  const activateItem = useActivateChartItem();

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
            {data.map((item) => {
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
                    const color = fill ?? colorGetter(item.name);
                    if (!d || color === null) {
                      return null;
                    }
                    return (
                      <MapShape
                        key={featureIndex}
                        seriesId={id}
                        featureName={item.name}
                        d={d}
                        color={color}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        onClick={(event) => {
                          const identifier: MapShapeItemIdentifier = {
                            type: 'mapShape',
                            seriesId: id,
                            name: item.name,
                          };
                          activateItem(identifier);
                          onItemClick?.(event, identifier);
                        }}
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
   * Callback fired when clicking on a map shape.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {MapShapeItemIdentifier} mapShapeItemIdentifier The identifier of the clicked map shape.
   */
  onItemClick: PropTypes.func,
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
