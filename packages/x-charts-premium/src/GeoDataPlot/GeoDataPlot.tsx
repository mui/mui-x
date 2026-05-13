'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import {
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEqualEarth,
  geoEquirectangular,
  geoGnomonic,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
  geoStereographic,
  geoTransverseMercator,
  type GeoProjection,
} from '@mui/x-charts-vendor/d3-geo';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { useGeoData } from '../hooks/useGeoData';
import { useProjection } from '../hooks/useProjection';

const PROJECTION_FACTORIES: Record<string, (() => GeoProjection) | undefined> = {
  albers: geoAlbers,
  albersUsa: geoAlbersUsa,
  azimuthalEqualArea: geoAzimuthalEqualArea,
  azimuthalEquidistant: geoAzimuthalEquidistant,
  conicConformal: geoConicConformal,
  conicEqualArea: geoConicEqualArea,
  conicEquidistant: geoConicEquidistant,
  equalEarth: geoEqualEarth,
  equirectangular: geoEquirectangular,
  gnomonic: geoGnomonic,
  mercator: geoMercator,
  naturalEarth1: geoNaturalEarth1,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,
  transverseMercator: geoTransverseMercator,
};

export interface GeoDataPlotProps {
  className?: string;
  /**
   * Fill color applied to every feature path.
   * @default 'currentColor'
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
 * Renders the registered `geoData` as SVG paths, using the registered `projection`
 * fitted to the chart's drawing area.
 */
function GeoDataPlot(props: GeoDataPlotProps) {
  const { className, fill = 'currentColor', stroke = 'none', strokeWidth = 1 } = props;
  const geoData = useGeoData();
  const projectionInput = useProjection();
  const drawingArea = useDrawingArea();

  const projection = React.useMemo<GeoProjection | null>(() => {
    if (!projectionInput) {
      return null;
    }
    if (typeof projectionInput !== 'string') {
      return projectionInput;
    }
    const factory = PROJECTION_FACTORIES[projectionInput];
    if (!factory) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(
          `MUI X Charts: Unknown projection name '${projectionInput}'. ` +
            `Expected one of: ${Object.keys(PROJECTION_FACTORIES).join(', ')}.`,
        );
      }
      return null;
    }
    const next = factory();
    if (geoData) {
      next.fitExtent(
        [
          [drawingArea.left, drawingArea.top],
          [drawingArea.left + drawingArea.width, drawingArea.top + drawingArea.height],
        ],
        geoData,
      );
    }
    return next;
  }, [projectionInput, geoData, drawingArea]);

  if (!geoData || !projection) {
    return null;
  }

  const path = geoPath(projection);

  return (
    <g className={className}>
      {geoData.features.map((feature, index) => {
        const d = path(feature);
        if (!d) {
          return null;
        }
        return (
          <path
            key={feature.id ?? index}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </g>
  );
}

GeoDataPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * Fill color applied to every feature path.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
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

export { GeoDataPlot };
