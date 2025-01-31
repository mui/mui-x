import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesCommonProps } from './RadarSeries.types';

interface RadarSeriesMarksProps extends RadarSeriesCommonProps {}

function RadarSeriesMarks(props: RadarSeriesMarksProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId, points, color }) => (
        <g key={seriesId}>
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r={5} fill={color} stroke={color} />
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
   * The id of the series To display.
   * If undefined all series are display.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesMarks };
