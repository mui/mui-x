import * as React from 'react';
import { useDrawingArea, useRadiusAxis, useRadiusScale, useRotationScale } from '../hooks';
import { useRadarSeries } from '../hooks/useSeries';
import { useRadialContext } from '../context/RadialProvider';

function RadarAreaPlot() {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = useRadialContext();
  const radarSeries = useRadarSeries();

  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[]; // The metrics only take string for radar.
  const angles = metrics.map((key) => rotationScale(key)!);
  const scales = metrics.map((key) => radiusAxis[key]!.scale);

  return (
    <g>
      {radarSeries?.seriesOrder.map((seriesId) => (
        <path
          key={seriesId}
          stroke={radarSeries.series[seriesId].color}
          fill={radarSeries.series[seriesId].color}
          fillOpacity={0.1}
          d={`M ${radarSeries.series[seriesId].data
            .map((value, dataIndex) => {
              const r = scales[dataIndex](value)!;
              const angle = angles[dataIndex];
              return `${cx - r * Math.sin(angle)} ${cy - r * Math.cos(angle)}`;
            })
            .join('L')} Z`}
        />
      ))}
    </g>
  );
}

export { RadarAreaPlot };
