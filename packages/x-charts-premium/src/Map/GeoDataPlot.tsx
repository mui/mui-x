'use client';
import PropTypes from 'prop-types';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';

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
 */
function GeoDataPlot(props: GeoDataPlotProps) {
  const { className, fill = 'currentColor', stroke = 'none', strokeWidth = 1 } = props;
  const geoData = useGeoData();
  const path = useGeoPath();

  if (!geoData || !path) {
    return null;
  }

  return (
    <g className={className}>
      {geoData.features.map((feature, index) => {
        const d = path(feature);
        if (!d) {
          return null;
        }
        return <path key={index} d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
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
