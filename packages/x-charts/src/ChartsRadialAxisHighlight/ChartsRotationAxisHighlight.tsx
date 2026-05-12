'use client';
import * as React from 'react';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  selectorChartsInteractionRotationAxisIndex,
  selectorChartsInteractionRotationAxisValue,
} from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';
import { type ChartsRadialAxisHighlightRotationType } from './ChartsRadialAxisHighlight.types';
import { type ChartsRadialAxisHighlightClasses } from './chartsRadialAxisHighlightClasses';
import { ChartsRadialAxisHighlightPath } from './ChartsRadialAxisHighlightPath';

function polarToSvg(cx: number, cy: number, radius: number, angle: number) {
  return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)] as const;
}

/**
 * @ignore - internal component.
 */
export default function ChartsRotationAxisHighlight(props: {
  type: ChartsRadialAxisHighlightRotationType;
  classes: ChartsRadialAxisHighlightClasses;
}) {
  const { type, classes } = props;

  const store = useStore<[UseChartPolarAxisSignature]>();
  const { cx, cy } = store.use(selectorChartPolarCenter);
  const { axis: rotationAxes, axisIds: rotationAxisIds } = store.use(selectorChartRotationAxis);
  const { axis: radiusAxes, axisIds: radiusAxisIds } = store.use(selectorChartRadiusAxis);
  const rotationIndex = store.use(selectorChartsInteractionRotationAxisIndex);
  const rotationValue = store.use(selectorChartsInteractionRotationAxisValue);

  if (rotationIndex === null || rotationIndex === -1) {
    return null;
  }

  const rotationAxisId = rotationAxisIds[0];
  const radiusAxisId = radiusAxisIds[0];

  if (rotationAxisId === undefined || radiusAxisId === undefined) {
    return null;
  }

  const rotationAxis = rotationAxes[rotationAxisId];
  const radiusAxis = radiusAxes[radiusAxisId];
  const rotationScale = rotationAxis.scale;
  const radiusScale = radiusAxis.scale;

  const innerRadius = radiusScale.range()[0];
  const outerRadius = radiusScale.range()[1];

  const angle = rotationScale(rotationValue as never);
  if (angle === undefined) {
    return null;
  }

  if (type === 'band') {
    if (!isOrdinalScale(rotationScale)) {
      return null;
    }

    const step = rotationScale.step();
    const bandwidth = rotationScale.bandwidth();
    // For point scale: bandwidth = 0, the band is centered on the value.
    // For band scale: scale(value) returns the band start, the band size is bandwidth.
    const startAngle = angle - (step - bandwidth) / 2;
    const endAngle = startAngle + step;

    const [x1Outer, y1Outer] = polarToSvg(cx, cy, outerRadius, startAngle);
    const [x2Outer, y2Outer] = polarToSvg(cx, cy, outerRadius, endAngle);
    const [x1Inner, y1Inner] = polarToSvg(cx, cy, innerRadius, startAngle);
    const [x2Inner, y2Inner] = polarToSvg(cx, cy, innerRadius, endAngle);

    const isLargeArc = Math.abs(endAngle - startAngle) >= Math.PI;
    const innerArc =
      innerRadius > 0
        ? `L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${isLargeArc ? 1 : 0} 0 ${x1Inner} ${y1Inner}`
        : `L ${cx} ${cy}`;

    return (
      <ChartsRadialAxisHighlightPath
        d={`M ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${isLargeArc ? 1 : 0} 1 ${x2Outer} ${y2Outer} ${innerArc} Z`}
        className={classes.root}
        ownerState={{ axisHighlight: 'band' }}
      />
    );
  }

  if (type === 'line') {
    const lineAngle = isOrdinalScale(rotationScale) ? angle + rotationScale.bandwidth() / 2 : angle;
    const [x1, y1] = polarToSvg(cx, cy, innerRadius, lineAngle);
    const [x2, y2] = polarToSvg(cx, cy, outerRadius, lineAngle);

    return (
      <ChartsRadialAxisHighlightPath
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        className={classes.root}
        ownerState={{ axisHighlight: 'line' }}
      />
    );
  }

  return null;
}
