'use client';
import * as React from 'react';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  selectorChartsInteractionRadius,
  selectorChartsInteractionRadiusAxisValue,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type { UseChartPolarAxisSignature } from '../internals/plugins/featurePlugins/useChartPolarAxis';
import type { ChartsRadialAxisHighlightRadiusType } from './ChartsRadialAxisHighlight.types';
import type { ChartsRadialAxisHighlightClasses } from './chartsRadialAxisHighlightClasses';
import {
  ChartsRadialAxisHighlightCircle,
  ChartsRadialAxisHighlightPath,
} from './ChartsRadialAxisHighlightPath';
import { getRingPath } from '../internals/getRingPath';
import { isOrdinalScale } from '../internals/scaleGuards';

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
  const pointerRadius = store.use(selectorChartsInteractionRadius);
  const radiusValue = store.use(selectorChartsInteractionRadiusAxisValue);
  const radiusAxisId = radiusAxisIds[0];

  if (type === 'none' || radiusAxisId === undefined || pointerRadius === null) {
    return null;
  }

  const radiusAxis = radiusAxes[radiusAxisId];
  const radiusScale = radiusAxis.scale;
  const innerRadius = radiusScale.range()[0];
  const outerRadius = radiusScale.range()[1];

  if (pointerRadius < innerRadius || pointerRadius > outerRadius) {
    return null;
  }

  const rotationAxisId = rotationAxisIds[0];
  const rotationAxis = rotationAxisId !== undefined ? rotationAxes[rotationAxisId] : undefined;

  const startAngle = rotationAxis?.scale.range()[0] ?? 0;
  const endAngle = rotationAxis?.scale.range()[1] ?? 2 * Math.PI;
  const isFullCircle = rotationAxis?.isFullCircle ?? Math.abs(endAngle - startAngle) >= 2 * Math.PI;

  if (type === 'line') {
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

  if (!isOrdinalScale(radiusAxis.scale)) {
    return null;
  }
  const radius = radiusAxis.scale(radiusValue)!;
  const step = radiusAxis.scale.step();
  const bandwidth = radiusAxis.scale.bandwidth();

  const bandInnerRadius = radius - (step - bandwidth) / 2;
  const bandOuterRadius = bandInnerRadius + step;

  return (
    <ChartsRadialAxisHighlightPath
      d={getRingPath(
        { x: cx, y: cy },
        bandInnerRadius,
        bandOuterRadius,
        isFullCircle ? undefined : { start: startAngle, end: endAngle },
      )}
      className={classes.root}
      ownerState={{ axisHighlight: 'band' }}
    />
  );
}
