import type { ProcessedBarData, ProcessedBarSeriesData } from '../types';
import { appendAtKey } from '../../internals/appendAtKey';

const MAX_POINTS_PER_PATH = 1000;

function generateBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  topLeftBorderRadius: number,
  topRightBorderRadius: number,
  bottomRightBorderRadius: number,
  bottomLeftBorderRadius: number,
) {
  const tLBR = Math.min(topLeftBorderRadius, width / 2, height / 2);
  const tRBR = Math.min(topRightBorderRadius, width / 2, height / 2);
  const bRBR = Math.min(bottomRightBorderRadius, width / 2, height / 2);
  const bLBR = Math.min(bottomLeftBorderRadius, width / 2, height / 2);

  return `M${x + tLBR},${y}
   h${width - tLBR - tRBR}
   a${tRBR},${tRBR} 0 0 1 ${tRBR},${tRBR}
   v${height - tRBR - bRBR}
   a${bRBR},${bRBR} 0 0 1 -${bRBR},${bRBR}
   h-${width - bRBR - bLBR}
   a${bLBR},${bLBR} 0 0 1 -${bLBR},-${bLBR}
   v-${height - bLBR - tLBR}
   a${tLBR},${tLBR} 0 0 1 ${tLBR},-${tLBR}
   Z`;
}

export function createPath(barData: ProcessedBarData, borderRadius: number) {
  return generateBarPath(
    barData.x,
    barData.y,
    barData.width,
    barData.height,
    barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'top' ? borderRadius : 0,
    barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'top' ? borderRadius : 0,
    barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'bottom'
      ? borderRadius
      : 0,
    barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'bottom' ? borderRadius : 0,
  );
}

/**
 * Hook that creates bar paths for a given series data. Used by the batch bar renderer.
 * @param seriesData
 * @param borderRadius
 */
export function useCreateBarPaths(seriesData: ProcessedBarSeriesData, borderRadius: number) {
  const paths = new Map<string, string[]>();
  const temporaryPaths = new Map<string, string[]>();

  for (let j = 0; j < seriesData.data.length; j += 1) {
    const barData = seriesData.data[j];

    const pathString = createPath(barData, borderRadius);

    const tempPath = appendAtKey(temporaryPaths, barData.color, pathString);

    if (tempPath.length >= MAX_POINTS_PER_PATH) {
      appendAtKey(paths, barData.color, tempPath.join(''));
      temporaryPaths.delete(barData.color);
    }
  }

  for (const [fill, tempPath] of temporaryPaths.entries()) {
    if (tempPath.length > 0) {
      appendAtKey(paths, fill, tempPath.join(''));
    }
  }

  return paths;
}
