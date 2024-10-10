import * as React from 'react';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { useRotationScale } from '../hooks/useScale';
import { useRadarSeries } from '../hooks/useSeries';
import { usePolarContext } from '../context/PolarProvider';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useHighlighted } from '../context/HighlightedProvider';

function RadarAreaPlot() {
  const rotationScale = useRotationScale<'point'>();
  const { radiusAxis } = usePolarContext();
  const radarSeries = useRadarSeries();

  const drawingArea = useDrawingArea();
  const getInteractionItemProps = useInteractionItemProps();
  const highlighted = useHighlighted();

  const cx = drawingArea.left + drawingArea.width / 2;
  const cy = drawingArea.top + drawingArea.height / 2;

  const metrics = rotationScale.domain() as string[]; // The metrics only take string for radar.
  const angles = metrics.map((key) => rotationScale(key)!);
  const scales = metrics.map((key) => radiusAxis[key]!.scale);

  return (
    <g>
      {radarSeries?.seriesOrder.map((seriesId) => {
        const isSeriesHighlighted = highlighted.isHighlighted({ seriesId });
        const isSeriesFaded = !isSeriesHighlighted && highlighted.isFaded({ seriesId });
        return (
          <React.Fragment>
            <path
              key={seriesId}
              stroke={radarSeries.series[seriesId].color}
              strokeOpacity={isSeriesFaded ? 0.5 : 1}
              fill={radarSeries.series[seriesId].color}
              fillOpacity={isSeriesHighlighted ? 0.8 : 0.1}
              d={`M ${radarSeries.series[seriesId].data
                .map((value, dataIndex) => {
                  const r = scales[dataIndex](value)!;
                  const angle = angles[dataIndex];
                  return `${cx - r * Math.sin(angle)} ${cy - r * Math.cos(angle)}`;
                })
                .join('L')} Z`}
              {...getInteractionItemProps({ type: 'radar', seriesId })}
            />
            {radarSeries.series[seriesId].showMark &&
              radarSeries.series[seriesId].data.map((value, dataIndex) => {
                const isItemHighlighted = highlighted.isHighlighted({ seriesId, dataIndex });
                const isItemFaded =
                  !isItemHighlighted && highlighted.isFaded({ seriesId, dataIndex });

                const r = scales[dataIndex](value)!;
                const angle = angles[dataIndex];
                return (
                  <circle
                    cx={cx - r * Math.sin(angle)}
                    cy={cy - r * Math.cos(angle)}
                    r={5}
                    fill={radarSeries.series[seriesId].color}
                    fillOpacity={isItemFaded ? 0.5 : 1}
                    {...getInteractionItemProps({ type: 'radar', seriesId, dataIndex })}
                  />
                );
              })}
          </React.Fragment>
        );
      })}
    </g>
  );
}

export { RadarAreaPlot };
