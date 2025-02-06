import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesCommonProps } from './RadarSeries.types';

interface RadarSeriesAreaProps extends RadarSeriesCommonProps {}

function RadarSeriesArea(props: RadarSeriesAreaProps) {
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId, points, color }) => (
        <path
          key={seriesId}
          d={`M ${points.map((p) => `${p.x} ${p.y}`).join('L')} Z`}
          fill={color}
          stroke={color}
          fillOpacity={0.4}
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
   * The id of the series To display.
   * If undefined all series are display.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesArea };
