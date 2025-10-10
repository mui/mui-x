'use client';
import * as React from 'react';
import { useStore, useSelector, selectorChartDrawingArea } from '@mui/x-charts/internals';
import clsx from 'clsx';
import {
  selectorChartBrushConfig,
  selectorChartBrushCurrentX,
  selectorChartBrushCurrentY,
  selectorChartBrushStartX,
  selectorChartBrushStartY,
} from '../internals/plugins/useChartProZoom/useChartProZoom.selectors';
import type { UseChartProZoomSignature } from '../plugins';
import { brushOverlayClasses } from './ChartsBrushOverlay.classes';

// TODO: Styles
function BrushLine(props: React.SVGProps<SVGLineElement>) {
  return (
    <line
      className={brushOverlayClasses.line}
      strokeWidth={2}
      strokeDasharray={'4 2'}
      pointerEvents={'none'}
      {...props}
    />
  );
}

function BrushRect(props: React.SVGProps<SVGRectElement>) {
  return (
    <rect className={brushOverlayClasses.rect} strokeWidth={1} pointerEvents={'none'} {...props} />
  );
}

export interface ChartsBrushOverlayProps {}

/**
 * Component that renders visual feedback during brush zoom interaction
 */
export function ChartsBrushOverlay(_: ChartsBrushOverlayProps) {
  const store = useStore<[UseChartProZoomSignature]>();
  const drawingArea = useSelector(store, selectorChartDrawingArea);

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

  // For scatter charts, show only the rectangle without guide lines
  if (brushConfig === 'orthogonal') {
    const rectWidth = currentX - startX;
    const rectHeight = currentY - startY;

    // Only show rectangle if there's meaningful movement
    const showRect = Math.abs(rectWidth) > 2 || Math.abs(rectHeight) > 2;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.orthogonal)}>
        {showRect && (
          <BrushRect
            x={rectWidth >= 0 ? startX : currentX}
            y={rectHeight >= 0 ? startY : currentY}
            width={Math.abs(rectWidth)}
            height={Math.abs(rectHeight)}
          />
        )}
      </g>
    );
  }

  if (brushConfig === 'horizontal') {
    const minY = Math.min(startY, currentY);
    const maxY = Math.max(startY, currentY);
    const rectHeight = maxY - minY;

    // Only show rectangle if there's meaningful movement
    const showRect = rectHeight > 2;

    return (
      <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.horizontal)}>
        <BrushLine x1={left} y1={startY} x2={left + width} y2={startY} />
        {showRect && (
          <React.Fragment>
            <BrushLine x1={left} y1={currentY} x2={left + width} y2={currentY} />
            <BrushRect x={left} y={minY} width={width} height={rectHeight} />
          </React.Fragment>
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
    <g className={clsx(brushOverlayClasses.root, brushOverlayClasses.vertical)}>
      <BrushLine x1={startX} y1={top} x2={startX} y2={top + height} />
      {showRect && (
        <React.Fragment>
          <BrushLine x1={currentX} y1={top} x2={currentX} y2={top + height} />
          <BrushRect x={minX} y={top} width={rectWidth} height={height} />
        </React.Fragment>
      )}
    </g>
  );
}
