import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRadarSeriesData } from './useRadarSeriesData';
import { RadarSeriesAreaProps } from './RadarSeriesPlot.types';
import { getAreaPath } from './getAreaPath';
import { RadarSeriesPlotClasses, useUtilityClasses } from './radarSeriesPlotClasses';
import { useItemHighlightedGetter } from '../../hooks/useItemHighlightedGetter';
import { useInteractionAllItemProps } from '../../hooks/useInteractionItemProps';
import { SeriesId } from '../../models/seriesType/common';
import { HighlightItemData } from '../../internals/plugins/featurePlugins/useChartHighlight';

interface GetPathPropsParams {
  seriesId: SeriesId;
  classes: RadarSeriesPlotClasses;
  isFaded: (item: HighlightItemData | null) => boolean;
  isHighlighted: (item: HighlightItemData | null) => boolean;
  points: { x: number; y: number }[];
  fillArea?: boolean;
  color: string;
}

export function getPathProps(params: GetPathPropsParams): React.SVGProps<SVGPathElement> {
  const { isHighlighted, isFaded, seriesId, classes, points, fillArea, color } = params;
  const isItemHighlighted = isHighlighted({ seriesId });
  const isItemFaded = !isItemHighlighted && isFaded({ seriesId });

  return {
    d: getAreaPath(points),
    fill: fillArea ? color : 'transparent',
    stroke: color,
    className: clsx(
      classes.area,
      (isItemHighlighted && classes.highlighted) || (isItemFaded && classes.faded),
    ),
    strokeOpacity: isItemFaded ? 0.5 : 1,
    fillOpacity: (isItemHighlighted && 0.4) || (isItemFaded && 0.1) || 0.2,
    strokeWidth: !fillArea && isItemHighlighted ? 2 : 1,
  };
}

function RadarSeriesArea(props: RadarSeriesAreaProps) {
  const { seriesId, ...other } = props;
  const seriesCoordinates = useRadarSeriesData(seriesId);

  const interactionProps = useInteractionAllItemProps(seriesCoordinates);
  const { isFaded, isHighlighted } = useItemHighlightedGetter();

  const classes = useUtilityClasses(props.classes);
  return (
    <React.Fragment>
      {seriesCoordinates?.map(({ seriesId: id, points, color, fillArea }, seriesIndex) => {
        return (
          <path
            key={id}
            {...getPathProps({
              seriesId: id,
              points,
              color,
              fillArea,
              isFaded,
              isHighlighted,
              classes,
            })}
            {...interactionProps[seriesIndex]}
            {...other}
          />
        );
      })}
    </React.Fragment>
  );
}

RadarSeriesArea.propTypes = {
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

export { RadarSeriesArea };
