import * as React from 'react';
import { useRadiusAxes } from '../../hooks/useAxis';
import { useRadarSeries } from '../../hooks/useRadarSeries';
import { useRotationScale } from '../../hooks/useScale';
import { useSelector } from '../../internals/store/useSelector';
import { useStore } from '../../internals/store/useStore';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import {
  selectorChartPolarCenter,
  UseChartPolarAxisSignature,
} from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { selectorChartsInteractionXAxis } from '../../internals/plugins/featurePlugins/useChartInteraction';

export function RadarAxisHighlight() {
  const radarSeries = useRadarSeries();

  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  const { instance } = useChartContext<[UseChartPolarAxisSignature]>();

  const store = useStore();
  const xAxisIdentifier = useSelector(store, selectorChartsInteractionXAxis);
  const center = useSelector(store, selectorChartPolarCenter);

  const highlightedIndex = xAxisIdentifier?.index;

  if (highlightedIndex === undefined) {
    return null;
  }

  if (radarSeries === undefined || radarSeries.length === 0) {
    return null;
  }

  const metric = radiusAxisIds[highlightedIndex];
  const radiusScale = radiusAxis[metric].scale;
  const radius = radiusScale.range()[1];
  const angle = rotationScale(xAxisIdentifier?.value as string)!;

  const [x, y] = instance.polar2svg(radius, angle);
  return (
    <g pointerEvents="none">
      <path
        d={`M ${center.cx} ${center.cy} L ${x} ${y}`}
        stroke="black"
        strokeDasharray="5 5"
        strokeWidth={5}
      />

      {radarSeries.map((series) => {
        const value = series.data[highlightedIndex];
        if (value == null) {
          return null;
        }
        const [cx, cy] = instance.polar2svg(radiusScale(value) ?? 0, angle);
        return <circle key={series.id} fill={series.color} cx={cx} cy={cy} r={10} />;
      })}
    </g>
  );
}
