import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesAreaProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';

function RadarSeriesArea(props: RadarSeriesAreaProps) {
  const { seriesId, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(seriesId);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color }) => (
        <path
          key={id}
          d={getAreaPath(points)}
          fill={color}
          stroke={color}
          fillOpacity={0.4}
          {...other}
        />
      ))}
    </React.Fragment>
  );
}

RadarSeriesArea.propTypes = {
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

export { RadarSeriesArea };
