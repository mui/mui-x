import * as React from 'react';
import PropTypes from 'prop-types';
import { AxisDefaultized } from '../models/axis';
import { useAxis } from './useAxis';
import { ColorLegendSelector, PiecewiseLabelFormatterParams } from './legend.types';
import { LegendPerItem, LegendPerItemProps } from './LegendPerItem';
import { notNull } from '../internals/notNull';

function defaultLabelFormatter(params: PiecewiseLabelFormatterParams) {
  if (params.min === null) {
    return `<${params.formattedMax}`;
  }
  if (params.max === null) {
    return `>${params.formattedMin}`;
  }
  return `${params.formattedMin}-${params.formattedMax}`;
}

export interface PiecewiseColorLegendProps
  extends ColorLegendSelector,
    Omit<LegendPerItemProps, 'itemsToDisplay'> {
  /**
   * Hide the first item of the legend, corresponding to the [-infinity, min] piece.
   * @default false
   */
  hideFirst?: boolean;
  /**
   * Hide the last item of the legend, corresponding to the [max, +infinity] piece.
   * @default false
   */
  hideLast?: boolean;
  /**
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, or `null` to skip the item.
   */
  labelFormatter?: (params: PiecewiseLabelFormatterParams) => string | null;
}

function PiecewiseColorLegend(props: PiecewiseColorLegendProps) {
  const {
    axisDirection,
    axisId,
    hideFirst,
    hideLast,
    labelFormatter = defaultLabelFormatter,
    ...other
  } = props;

  const axisItem = useAxis({ axisDirection, axisId });

  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
    return null;
  }
  const valueFormatter = (v: number | Date) =>
    (axisItem as AxisDefaultized).valueFormatter?.(v, { location: 'legend' }) ?? v.toLocaleString();

  const formattedLabels = colorMap.thresholds.map(valueFormatter);

  const itemsToDisplay = colorMap.colors
    .map((color, index) => {
      const isFirst = index === 0;
      const isLast = index === colorMap.colors.length - 1;

      if ((hideFirst && isFirst) || (hideLast && isLast)) {
        return null;
      }

      const label = labelFormatter({
        ...(index === 0
          ? { min: null, formattedMin: null }
          : { min: colorMap.thresholds[index - 1], formattedMin: formattedLabels[index - 1] }),
        ...(index === colorMap.colors.length - 1
          ? { max: null, formattedMax: null }
          : { max: colorMap.thresholds[index], formattedMax: formattedLabels[index] }),
      });

      if (label === null) {
        return null;
      }

      return { id: label, color, label };
    })
    .filter(notNull);

  return <LegendPerItem {...other} itemsToDisplay={itemsToDisplay} />;
}

PiecewiseColorLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection: PropTypes.oneOf(['x', 'y', 'z']),
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * Hide the first item of the legend, corresponding to the [-infinity, min] piece.
   * @default false
   */
  hideFirst: PropTypes.bool,
  /**
   * Hide the last item of the legend, corresponding to the [max, +infinity] piece.
   * @default false
   */
  hideLast: PropTypes.bool,
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
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, or `null` to skip the item.
   */
  labelFormatter: PropTypes.func,
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
} as any;

export { PiecewiseColorLegend };
