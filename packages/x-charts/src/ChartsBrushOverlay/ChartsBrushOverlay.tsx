'use client';
import * as React from 'react';

import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';

import { brushOverlayClasses } from './ChartsBrushOverlay.classes';
import { selectorChartDrawingArea } from '../internals/plugins/corePlugins/useChartDimensions';
import {
  type UseChartBrushSignature,
  selectorBrushStartX,
  selectorBrushStartY,
  selectorBrushCurrentX,
  selectorBrushCurrentY,
  selectorBrushConfig,
} from '../internals/plugins/featurePlugins/useChartBrush';
import { useStore } from '../internals/store/useStore';

function BrushRect(props: React.SVGProps<SVGRectElement>) {
  return (
    <rect
      className={brushOverlayClasses.rect}
      strokeWidth={1}
      fillOpacity={0.2}
      pointerEvents={'none'}
      {...props}
    />
  );
}

export interface ChartsBrushOverlayProps {}

/**
 * Component that renders visual feedback during brush interaction
 */
export function ChartsBrushOverlay(props: ChartsBrushOverlayProps) {
  const store = useStore<[UseChartBrushSignature]>();
  const drawingArea = store.use(selectorChartDrawingArea);

  const theme = useTheme();

  const brushStartX = store.use(selectorBrushStartX);
  const brushStartY = store.use(selectorBrushStartY);
  const brushCurrentX = store.use(selectorBrushCurrentX);
  const brushCurrentY = store.use(selectorBrushCurrentY);
  const brushConfig = store.use(selectorBrushConfig);

  if (
    brushStartX === null ||
    brushStartY === null ||
    brushCurrentX === null ||
    brushCurrentY === null
  ) {
    return null;
  }

  const { left, top, width, height } = drawingArea;

  // Clamp coordinates to drawing area
  const clampX = (x: number) => Math.max(left, Math.min(left + width, x));
  const clampY = (y: number) => Math.max(top, Math.min(top + height, y));

  const startX = clampX(brushStartX);
  const startY = clampY(brushStartY);
  const currentX = clampX(brushCurrentX);
  const currentY = clampY(brushCurrentY);
  const rectColor =
    theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white;

  // For scatter charts, show only the rectangle without guide lines
  if (brushConfig === 'xy') {
    const rectWidth = currentX - startX;
    const rectHeight = currentY - startY;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.x, brushOverlayClasses.y)}>
        <BrushRect
          fill={rectColor}
          x={rectWidth >= 0 ? startX : currentX}
          y={rectHeight >= 0 ? startY : currentY}
          width={Math.abs(rectWidth)}
          height={Math.abs(rectHeight)}
          {...props}
        />
      </g>
    );
  }

  if (brushConfig === 'y') {
    const minY = Math.min(startY, currentY);
    const maxY = Math.max(startY, currentY);
    const rectHeight = maxY - minY;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.y)}>
        <BrushRect
          fill={rectColor}
          x={left}
          y={minY}
          width={width}
          height={rectHeight}
          {...props}
        />
      </g>
    );
  }

  const minX = Math.min(startX, currentX);
  const maxX = Math.max(startX, currentX);
  const rectWidth = maxX - minX;

  return (
    <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.x)}>
      <BrushRect fill={rectColor} x={minX} y={top} width={rectWidth} height={height} {...props} />
    </g>
  );
}
