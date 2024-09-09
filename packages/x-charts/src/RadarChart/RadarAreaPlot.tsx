import * as React from 'react';
import { useDrawingArea, useRadiusScale, useRotationScale } from '../hooks';
import { useRadarSeries } from '../hooks/useSeries';

export interface RadarAreaPlotProps {}

export function RadarAreaPlot(props: RadarAreaPlotProps) {
  const rotationScale = useRotationScale<'point'>();
  const radiusScale = useRadiusScale();
  const radarSeries = useRadarSeries();

  const drawingArea = useDrawingArea();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const angles = rotationScale.domain().map((key) => rotationScale(key)!);

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
              const r = radiusScale(value)!;
              const angle = angles[dataIndex];
              return `${cx - r * Math.sin(angle)} ${cy - r * Math.cos(angle)}`;
            })
            .join('L')} Z`}
        />
      ))}
    </g>
  );
}
