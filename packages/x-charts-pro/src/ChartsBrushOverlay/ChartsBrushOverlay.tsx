'use client';
import * as React from 'react';
import {
  useStore,
  useSelector,
  selectorChartDrawingArea,
  selectorChartBrushCurrentX,
  selectorChartBrushCurrentY,
  selectorChartBrushStartX,
  selectorChartBrushStartY,
  selectorChartBrushConfig,
  type UseChartBrushSignature,
} from '@mui/x-charts/internals';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import type { UseChartProZoomSignature } from '../plugins';
import { brushOverlayClasses } from './ChartsBrushOverlay.classes';

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
 * Component that renders visual feedback during brush zoom interaction
 */
export function ChartsBrushOverlay(_: ChartsBrushOverlayProps) {
  const store = useStore<[UseChartProZoomSignature, UseChartBrushSignature]>();
  const drawingArea = useSelector(store, selectorChartDrawingArea);

  const theme = useTheme();

  const brushStartX = useSelector(store, selectorChartBrushStartX);
  const brushStartY = useSelector(store, selectorChartBrushStartY);
  const brushCurrentX = useSelector(store, selectorChartBrushCurrentX);
  const brushCurrentY = useSelector(store, selectorChartBrushCurrentY);
  const brushConfig = useSelector(store, selectorChartBrushConfig);
  if (!brushStartX || !brushStartY || !brushCurrentX || !brushCurrentY) {
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
  const rectColor = theme.palette.mode === 'light' ? 'black' : 'white';

  // For scatter charts, show only the rectangle without guide lines
  if (brushConfig === 'xy') {
    const rectWidth = currentX - startX;
    const rectHeight = currentY - startY;

    // Only show rectangle if there's meaningful movement
    const showRect = Math.abs(rectWidth) > 2 || Math.abs(rectHeight) > 2;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.x, brushOverlayClasses.y)}>
        {showRect && (
          <BrushRect
            fill={rectColor}
            x={rectWidth >= 0 ? startX : currentX}
            y={rectHeight >= 0 ? startY : currentY}
            width={Math.abs(rectWidth)}
            height={Math.abs(rectHeight)}
          />
        )}
      </g>
    );
  }

  if (brushConfig === 'y') {
    const minY = Math.min(startY, currentY);
    const maxY = Math.max(startY, currentY);
    const rectHeight = maxY - minY;

    // Only show rectangle if there's meaningful movement
    const showRect = rectHeight > 2;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.y)}>
        {showRect && (
          <BrushRect fill={rectColor} x={left} y={minY} width={width} height={rectHeight} />
        )}
      </g>
    );
  }

  const minX = Math.min(startX, currentX);
  const maxX = Math.max(startX, currentX);
  const rectWidth = maxX - minX;

  // Only show rectangle if there's meaningful movement
  const showRect = rectWidth > 2;

  return (
    <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.x)}>
      {showRect && (
        <BrushRect fill={rectColor} x={minX} y={top} width={rectWidth} height={height} />
      )}
    </g>
  );
}
