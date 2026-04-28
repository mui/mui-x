'use client';
import * as React from 'react';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import { type ChartsRadialAxisHighlightRadiusType } from './ChartsRadialAxisHighlight.types';
import { type ChartsRadialAxisHighlightClasses } from './chartsRadialAxisHighlightClasses';
import { ChartsRadialAxisHighlightCircle, ChartsRadialAxisHighlightPath } from './ChartsRadialAxisHighlightPath';

function polarToSvg(cx: number, cy: number, radius: number, angle: number) {
  return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)] as const;
}

/**
 * @ignore - internal component.
 */
export default function ChartsRadiusAxisHighlight(props: {
  type: ChartsRadialAxisHighlightRadiusType;
  classes: ChartsRadialAxisHighlightClasses;
}) {
  const { type, classes } = props;

  const store = useStore<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);
  const { axis: radiusAxes, axisIds: radiusAxisIds } = store.use(selectorChartRadiusAxis);
  const { axis: rotationAxes, axisIds: rotationAxisIds } = store.use(selectorChartRotationAxis);
  const pointerX = store.use(selectorChartsInteractionPointerX);
  const pointerY = store.use(selectorChartsInteractionPointerY);

  if (pointerX === null || pointerY === null) {
    return null;
  }

  const radiusAxisId = radiusAxisIds[0];
  if (radiusAxisId === undefined) {
    return null;
  }

  const radiusAxis = radiusAxes[radiusAxisId];
  const radiusScale = radiusAxis.scale;
  const innerRadius = radiusScale.range()[0];
  const outerRadius = radiusScale.range()[1];

  const pointerRadius = Math.sqrt((pointerX - cx) ** 2 + (pointerY - cy) ** 2);

  if (pointerRadius < innerRadius || pointerRadius > outerRadius) {
    return null;
  }

  if (type === 'line') {
    const rotationAxisId = rotationAxisIds[0];
    const rotationAxis = rotationAxisId !== undefined ? rotationAxes[rotationAxisId] : undefined;

    const startAngle = rotationAxis?.scale.range()[0] ?? 0;
    const endAngle = rotationAxis?.scale.range()[1] ?? 2 * Math.PI;
    const isFullCircle =
      rotationAxis?.isFullCircle ?? Math.abs(endAngle - startAngle) >= 2 * Math.PI;

    if (isFullCircle) {
      return (
        <ChartsRadialAxisHighlightCircle
          cx={cx}
          cy={cy}
          r={pointerRadius}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      );
    }

    const [startX, startY] = polarToSvg(cx, cy, pointerRadius, startAngle);
    const [endX, endY] = polarToSvg(cx, cy, pointerRadius, endAngle);
    const isLargeArc = Math.abs(endAngle - startAngle) >= Math.PI;
    const isDirectArc = endAngle > startAngle;

    return (
      <ChartsRadialAxisHighlightPath
        d={`M ${startX} ${startY} A ${pointerRadius} ${pointerRadius} 0 ${isLargeArc ? 1 : 0} ${isDirectArc ? 1 : 0} ${endX} ${endY}`}
        className={classes.root}
        ownerState={{ axisHighlight: 'line' }}
      />
    );
  }

  return null;
}
