'use client';
import * as React from 'react';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';

/**
 * Renders an `<image>` stretched to the bounding box of the displayed `geoData`.
 * Useful to draw a base map raster (e.g. a satellite mosaic) under the series.
 * Pass `href` and any other SVG image attribute; computed `x`/`y`/`width`/
 * `height` can be overridden through props.
 */
export function MapImagePlot(props: React.SVGProps<SVGImageElement>) {
  const geoData = useGeoData();
  const path = useGeoPath();

  if (!geoData || !path) {
    return null;
  }

  const [[x0, y0], [x1, y1]] = path.bounds(geoData);

  return (
    <image x={x0} y={y0} width={x1 - x0} height={y1 - y0} preserveAspectRatio="none" {...props} />
  );
}
