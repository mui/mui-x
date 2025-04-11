import * as React from 'react';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesMarksProps } from './RadarSeriesPlot.types';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { RadarSeriesPlotClasses, useUtilityClasses } from './radarSeriesPlotClasses';
import { SeriesId } from '../../models/seriesType/common';
import { HighlightItemData } from '../../internals/plugins/featurePlugins/useChartHighlight';

interface GetCirclePropsParams {
  seriesId: SeriesId;
  classes: RadarSeriesPlotClasses;
  isFaded: (item: HighlightItemData | null) => boolean;
  isHighlighted: (item: HighlightItemData | null) => boolean;
  point: { x: number; y: number };
  fillArea?: boolean;
  color: string;
}

export function getCircleProps(params: GetCirclePropsParams): React.SVGProps<SVGCircleElement> {
  const { isHighlighted, isFaded, seriesId, classes, point, fillArea, color } = params;
  const isItemHighlighted = isHighlighted({ seriesId });
  const isItemFaded = !isItemHighlighted && isFaded({ seriesId });

  return {
    cx: point.x,
    cy: point.y,
    r: 3,
    fill: color,
    stroke: color,
    opacity: fillArea && isItemFaded ? 0.5 : 1,
    pointerEvents: 'none',
    className: clsx(
      classes.mark,
      (isItemHighlighted && classes.highlighted) || (isItemFaded && classes.faded),
    ),
  };
}

function RadarSeriesMarks(props: RadarSeriesMarksProps) {
  const { seriesId, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(props.seriesId);

  const classes = useUtilityClasses(props.classes);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color, hideMark, fillArea }) => {
        if (hideMark) {
          return null;
        }

        return (
          <g key={id}>
            {points.map((point, index) => (
              <circle
                key={index}
                {...getCircleProps({
                  seriesId: id,
                  point,
                  color,
                  fillArea,
                  isFaded,
                  isHighlighted,
                  classes,
                })}
                {...other}
              />
            ))}
          </g>
        );
      })}
    </React.Fragment>
  );
}

RadarSeriesMarks.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The id of the series to display.
   * If undefined all series are displayed.
   */
  seriesId: PropTypes.string,
} as any;

export { RadarSeriesMarks };
