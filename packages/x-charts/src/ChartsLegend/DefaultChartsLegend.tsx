'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedSeries } from '../context/SeriesProvider';
import { LegendPerItem, LegendPerItemProps } from './LegendPerItem';
import { DrawingArea } from '../context/DrawingProvider';
import { LegendItemParams, SeriesLegendItemContext } from './chartsLegend.types';

const seriesContextBuilder = (context: LegendItemParams): SeriesLegendItemContext =>
  ({
    type: 'series',
    color: context.color,
    label: context.label,
    seriesId: context.seriesId!,
    itemId: context.itemId,
  }) as const;

export interface LegendRendererProps
  extends Omit<LegendPerItemProps, 'itemsToDisplay' | 'onItemClick'> {
  series: FormattedSeries;
  seriesToDisplay: LegendPerItemProps['itemsToDisplay'];
  /**
   * @deprecated Use the `useDrawingArea` hook instead.
   */
  drawingArea: Omit<DrawingArea, 'isPointInside'>;
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    legendItem: SeriesLegendItemContext,
    index: number,
  ) => void;
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden?: boolean;
}

function DefaultChartsLegend(props: LegendRendererProps) {
  const { drawingArea, seriesToDisplay, hidden, onItemClick, ...other } = props;

  if (hidden) {
    return null;
  }

  return (
    <LegendPerItem
      {...other}
      itemsToDisplay={seriesToDisplay}
      onItemClick={
        onItemClick
          ? (e, i) => onItemClick(e, seriesContextBuilder(seriesToDisplay[i]), i)
          : undefined
      }
    />
  );
}

DefaultChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']).isRequired,
  /**
   * @deprecated Use the `useDrawingArea` hook instead.
   */
  drawingArea: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: PropTypes.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: PropTypes.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: PropTypes.number,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: PropTypes.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: PropTypes.number,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }).isRequired,
  series: PropTypes.object.isRequired,
  seriesToDisplay: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string.isRequired,
      maxValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      minValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ).isRequired,
} as any;

export { DefaultChartsLegend };
