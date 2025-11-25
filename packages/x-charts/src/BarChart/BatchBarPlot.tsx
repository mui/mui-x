import * as React from 'react';
import { BarPlotSlotProps, BarPlotSlots } from './BarPlot';
import { BarItemIdentifier } from '../models';
import { MaskData, ProcessedBarSeriesData } from './types';

interface BatchBarPlotProps {
  completedData: ProcessedBarSeriesData[];
  maskData: MaskData[];
  borderRadius?: number;
  skipAnimation?: boolean;
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
  slotProps?: BarPlotSlotProps;
  slots?: BarPlotSlots;
}

const MAX_POINTS_PER_PATH = 1000;

function appendAtKey(map: Map<string, string[]>, key: string, value: string) {
  let bucket = map.get(key);
  if (!bucket) {
    bucket = [value];
    map.set(key, bucket);
  } else {
    bucket.push(value);
  }
  return bucket;
}

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

function useCreatePaths(
  completedData: ProcessedBarSeriesData[],
  masksData: MaskData[],
  borderRadius: number,
) {
  const paths = new Map<string, string[]>();
  const temporaryPaths = new Map<string, string[]>();

  for (let i = 0; i < completedData.length; i += 1) {
    const seriesData = completedData[i];
    for (let j = 0; j < seriesData.data.length; j += 1) {
      const barData = seriesData.data[j];

      // Here you would create the path string for the bar considering borderRadius
      // const pathString = `M${barData.x},${barData.y} v${barData.height} h${barData.width} v${-barData.height} h${-barData.width}Z`;
      const pathString = generateBarPath(
        barData.x,
        barData.y,
        barData.width,
        barData.height,
        barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'top'
          ? borderRadius
          : 0,
        barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'top'
          ? borderRadius
          : 0,
        barData.borderRadiusSide === 'right' || barData.borderRadiusSide === 'bottom'
          ? borderRadius
          : 0,
        barData.borderRadiusSide === 'left' || barData.borderRadiusSide === 'bottom'
          ? borderRadius
          : 0,
      );

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
  }

  return paths;
}

export function BatchBarPlot({
  completedData,
  maskData,
  borderRadius = 0,
  skipAnimation,
}: BatchBarPlotProps) {
  const paths = useCreatePaths(completedData, maskData, borderRadius);
  const children: React.ReactNode[] = [];

  let i = 0;
  for (const [fill, dArray] of paths.entries()) {
    for (const d of dArray) {
      children.push(<path key={i} fill={fill} d={d} />);
      i += 1;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
}
