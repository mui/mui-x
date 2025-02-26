import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesPlotProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';

function RadarSeriesPlot(props: RadarSeriesPlotProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId, points, color }) => (
        <g key={seriesId}>
          {
            <path
              key={seriesId}
              d={getAreaPath(points)}
              fill={color}
              stroke={color}
              fillOpacity={0.4}
            />
          }
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={5} fill={color} stroke={color} />
          ))}
        </g>
      ))}
    </React.Fragment>
  );
}

RadarSeriesPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the series To display.
   * If undefined all series are display.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesPlot };
