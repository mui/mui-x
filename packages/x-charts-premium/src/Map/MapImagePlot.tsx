'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';

export interface MapImagePlotProps extends React.SVGProps<SVGImageElement> {
  /**
   * URL of the image to render as the base map.
   */
  href?: string;
  /**
   * How the image is stretched to fill the map's bounding box.
   * @default 'none'
   */
  preserveAspectRatio?: string;
}

/**
 * Renders an `<image>` stretched to the bounding box of the displayed `geoData`,
 * to draw a base map raster (for example a satellite mosaic) under the series.
 *
 * The computed `x`, `y`, `width`, and `height` can be overridden through props.
 * Any other SVG image attribute is forwarded to the underlying element.
 */
function MapImagePlot(props: MapImagePlotProps) {
  const { preserveAspectRatio = 'none', ...other } = props;
  const geoData = useGeoData();
  const path = useGeoPath();

  if (!geoData || !path) {
    return null;
  }

  const [[x0, y0], [x1, y1]] = path.bounds(geoData);

  return (
    <image
      x={x0}
      y={y0}
      width={x1 - x0}
      height={y1 - y0}
      preserveAspectRatio={preserveAspectRatio}
      {...other}
    />
  );
}

MapImagePlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * URL of the image to render as the base map.
   */
  href: PropTypes.string,
  /**
   * How the image is stretched to fill the map's bounding box.
   * @default 'none'
   */
  preserveAspectRatio: PropTypes.string,
} as any;

export { MapImagePlot };
