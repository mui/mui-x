import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesMarksProps } from './RadarSeriesPlot.types';

function RadarSeriesMarks(props: RadarSeriesMarksProps) {
  const { seriesId, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color }) => (
        <g key={id}>
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={color}
              stroke={color}
              {...other}
            />
          ))}
        </g>
      ))}
    </React.Fragment>
  );
}

RadarSeriesMarks.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesMarks };
