import * as React from 'react';
import { useRadarCoordinates } from './useRadarCoordiantes';
import { RadarSeriesPlot } from './RadarSeriesPlot';

function RadarPlot() {
  const { seriesCoordinates, cx, cy } = useRadarCoordinates();

  return (
    <g>
      {seriesCoordinates?.map((seriesCoordinate) => (
        <React.Fragment>
          <RadarSeriesPlot {...seriesCoordinate} color="red" cx={cx} cy={cy} />
          {/* {seriesCoordinate.showMark && <RadarDotPlot {...seriesCoordinate} />} */}
        </React.Fragment>
      ))}
      {/* {radarSeries?.seriesOrder.map((seriesId) => {
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
      })} */}
    </g>
  );
}

export { RadarPlot };
