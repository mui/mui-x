'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useDrawingArea } from '@mui/x-charts/hooks';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { useGeoPath } from '../hooks/useGeoPath';

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
   * @default [[-180, -90], [180, 90]]
   */
  imageBounds?: [[number, number], [number, number]];
}

/**
 * Renders a raster base map (for example a satellite mosaic) under the series,
 * reprojected to match the chart's `projection` so it follows the geography
 * instead of being a flat rectangle.
 *
 * The source image is assumed to be equirectangular; use `imageBounds` when it
 * does not cover the whole globe. Any other SVG image attribute is forwarded to
 * the underlying element.
 */
function MapImagePlot(props: MapImagePlotProps) {
  const { href, imageBounds, ...other } = props;
  const path = useGeoPath();
  const { left, top, width, height } = useDrawingArea();
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  const projection = path?.projection?.() as GeoProjection | null | undefined;
  const invert = projection?.invert;

  const [[west, south], [east, north]] = imageBounds ?? FULL_GLOBE;

  React.useEffect(() => {
    if (!href || !invert || width <= 0 || height <= 0) {
      setDataUrl(null);
      return undefined;
    }

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (cancelled) {
        return;
      }
      const outWidth = Math.max(1, Math.round(width));
      const outHeight = Math.max(1, Math.round(height));

      const source = document.createElement('canvas');
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const sourceCtx = source.getContext('2d');
      const output = document.createElement('canvas');
      output.width = outWidth;
      output.height = outHeight;
      const outputCtx = output.getContext('2d');
      if (!sourceCtx || !outputCtx) {
        return;
      }
      sourceCtx.drawImage(image, 0, 0);

      let sourcePixels: ImageData;
      try {
        sourcePixels = sourceCtx.getImageData(0, 0, source.width, source.height);
      } catch {
        // Cross-origin image without CORS taints the canvas: bail out.
        return;
      }

      const sourceWidth = source.width;
      const sourceHeight = source.height;
      const target = outputCtx.createImageData(outWidth, outHeight);

      for (let py = 0; py < outHeight; py += 1) {
        for (let px = 0; px < outWidth; px += 1) {
          const coordinates = invert([left + px, top + py]);
          if (!coordinates) {
            continue;
          }
          const [lon, lat] = coordinates;
          if (lon < west || lon > east || lat < south || lat > north) {
            continue;
          }
          let sx = Math.floor(((lon - west) / (east - west)) * sourceWidth);
          let sy = Math.floor(((north - lat) / (north - south)) * sourceHeight);
          sx = Math.min(Math.max(sx, 0), sourceWidth - 1);
          sy = Math.min(Math.max(sy, 0), sourceHeight - 1);

          const sourceIndex = (sy * sourceWidth + sx) * 4;
          const targetIndex = (py * outWidth + px) * 4;
          target.data[targetIndex] = sourcePixels.data[sourceIndex];
          target.data[targetIndex + 1] = sourcePixels.data[sourceIndex + 1];
          target.data[targetIndex + 2] = sourcePixels.data[sourceIndex + 2];
          target.data[targetIndex + 3] = sourcePixels.data[sourceIndex + 3];
        }
      }

      outputCtx.putImageData(target, 0, 0);
      setDataUrl(output.toDataURL());
    };
    image.src = href;

    return () => {
      cancelled = true;
    };
  }, [href, invert, left, top, width, height, west, south, east, north]);

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
   * @default [[-180, -90], [180, 90]]
   */
  imageBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
} as any;

export { MapImagePlot };
