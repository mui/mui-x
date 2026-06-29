'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrawingArea } from '@mui/x-charts/hooks';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useGeoPath } from '../hooks/useGeoPath';
import { reprojectEquirectangularImage } from './reprojectEquirectangularImage';

const FULL_GLOBE: [[number, number], [number, number]] = [
  [-180, -90],
  [180, 90],
];

export interface MapImagePlotProps extends React.SVGProps<SVGImageElement> {
  /**
   * URL of the image to render as the base map.
   * Must be same-origin (or CORS-enabled) so it can be reprojected on a canvas.
   */
  href?: string;
  /**
   * Geographic extent the source image covers, as `[[west, south], [east, north]]`.
   * The image is assumed to be in the equirectangular (plate carrée) projection.
   * If `west` is greater than `east`, the range wraps across the antimeridian.
   * @default [[-180, -90], [180, 90]]
   */
  imageBounds?: [[number, number], [number, number]];
  /**
   * Called after each reprojection.
   * @param {string | null} dataUrl The reprojected raster as a data URL, or `null` when it could not be produced.
   */
  onReady?: (dataUrl: string | null) => void;
}

/**
 * Renders a raster base map (for example a satellite mosaic) under the series,
 * reprojected to match the chart's `projection` so it follows the geography
 * instead of being a flat rectangle. Pixels outside the projection's visible
 * footprint are left transparent.
 *
 * The source image is loaded only when `href` changes; changing the projection or
 * resizing reuses the decoded image and only re-runs the (synchronous) canvas
 * reprojection.
 *
 * The source image is assumed to be equirectangular; use `imageBounds` when it
 * does not cover the whole globe. Any other SVG image attribute is forwarded to
 * the underlying element.
 */
function MapImagePlot(props: MapImagePlotProps) {
  const { href, imageBounds, onReady, ...other } = props;
  const path = useGeoPath();
  const { left, top, width, height } = useDrawingArea();
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  const projection = path?.projection?.() as GeoProjection | null | undefined;

  const [[west, south], [east, north]] = imageBounds ?? FULL_GLOBE;

  // Keep the latest `onReady` without making it a reprojection dependency.
  const onReadyRef = React.useRef(onReady);
  React.useEffect(() => {
    onReadyRef.current = onReady;
  });

  // Load (decode) the source image only when `href` changes. Clearing the image
  // first hides the now-stale raster until the new one is ready.
  React.useEffect(() => {
    setImage(null);
    if (!href) {
      return undefined;
    }
    let cancelled = false;
    const nextImage = new Image();
    nextImage.crossOrigin = 'anonymous';
    nextImage.onload = () => {
      if (!cancelled) {
        setImage(nextImage);
      }
    };
    nextImage.src = href;
    return () => {
      cancelled = true;
    };
  }, [href]);

  // Reproject whenever the decoded image, projection, drawing area, or bounds
  // change. This is synchronous, so switching projection does not reload `href`.
  React.useEffect(() => {
    if (
      !image ||
      !projection ||
      typeof projection.invert !== 'function' ||
      width <= 0 ||
      height <= 0
    ) {
      setDataUrl(null);
      onReadyRef.current?.(null);
      return;
    }
    const url = reprojectEquirectangularImage({
      image,
      projection,
      area: { left, top, width, height },
      imageBounds: [
        [west, south],
        [east, north],
      ],
    });
    setDataUrl(url);
    onReadyRef.current?.(url);
  }, [image, projection, left, top, width, height, west, south, east, north]);

  if (!dataUrl) {
    return null;
  }

  return <image href={dataUrl} x={left} y={top} width={width} height={height} {...other} />;
}

MapImagePlot.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * URL of the image to render as the base map.
   * Must be same-origin (or CORS-enabled) so it can be reprojected on a canvas.
   */
  href: PropTypes.string,
  /**
   * Geographic extent the source image covers, as `[[west, south], [east, north]]`.
   * The image is assumed to be in the equirectangular (plate carrée) projection.
   * If `west` is greater than `east`, the range wraps across the antimeridian.
   * @default [[-180, -90], [180, 90]]
   */
  imageBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
  /**
   * Called after each reprojection.
   * @param {string | null} dataUrl The reprojected raster as a data URL, or `null` when it could not be produced.
   */
  onReady: PropTypes.func,
} as any;

export { MapImagePlot };
