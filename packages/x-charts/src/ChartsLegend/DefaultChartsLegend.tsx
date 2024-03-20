import * as React from 'react';
import PropTypes from 'prop-types';
import { NoSsr } from '@mui/base/NoSsr';
import { useTheme, styled } from '@mui/material/styles';
import { DrawingArea } from '../context/DrawingProvider';
import { AnchorPosition, Direction } from './utils';
import { FormattedSeries } from '../context/SeriesContextProvider';
import { LegendParams } from '../models/seriesType/config';
import { DefaultizedProps } from '../models/helpers';
import { ChartsText, ChartsTextStyle } from '../ChartsText';
import { CardinalDirections } from '../models/layout';
import { getWordsByLines } from '../internals/getWordsByLines';
import type { ChartsLegendProps } from './ChartsLegend';

export type ChartsLegendRootOwnerState = {
  position: AnchorPosition;
  direction: Direction;
  drawingArea: DrawingArea;
  offsetX?: number;
  offsetY?: number;
  seriesNumber: number;
};

export const ChartsLegendRoot = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

export interface LegendRendererProps
  extends DefaultizedProps<
    Omit<ChartsLegendProps, 'slots' | 'slotProps'>,
    'direction' | 'position'
  > {
  series: FormattedSeries;
  seriesToDisplay: LegendParams[];
  drawingArea: DrawingArea;
  classes: Record<'mark' | 'series' | 'root', string>;
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle?: ChartsTextStyle;
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth?: number;
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight?: number;
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap?: number;
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap?: number;
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding?: number | Partial<CardinalDirections<number>>;
}

/**
 * Transforms number or partial padding object to a defaultized padding object.
 */
const getStandardizedPadding = (padding: LegendRendererProps['padding']) => {
  if (typeof padding === 'number') {
    return {
      left: padding,
      right: padding,
      top: padding,
      bottom: padding,
    };
  }
  return {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...padding,
  };
};

function DefaultChartsLegend(props: LegendRendererProps) {
  const {
    hidden,
    position,
    direction,
    seriesToDisplay,
    drawingArea,
    classes,
    itemMarkWidth = 20,
    itemMarkHeight = 20,
    markGap = 5,
    itemGap = 10,
    padding: paddingProps = 10,
    labelStyle: inLabelStyle,
  } = props;
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  const labelStyle = React.useMemo(
    () =>
      ({
        ...theme.typography.subtitle1,
        color: 'inherit',
        dominantBaseline: 'central',
        textAnchor: 'start',
        fill: (theme.vars || theme).palette.text.primary,
        lineHeight: 1,
        ...inLabelStyle,
      }) as ChartsTextStyle, // To say to TS that the dominantBaseline and textAnchor are correct
    [inLabelStyle, theme],
  );

  const padding = React.useMemo(() => getStandardizedPadding(paddingProps), [paddingProps]);

  const getItemSpace = React.useCallback(
    (label: string, inStyle: ChartsTextStyle = {}) => {
      const { rotate, dominantBaseline, ...style } = inStyle;
      const linesSize = getWordsByLines({ style, needsComputation: true, text: label });
      const innerSize = {
        innerWidth: itemMarkWidth + markGap + Math.max(...linesSize.map((size) => size.width)),
        innerHeight: Math.max(itemMarkHeight, linesSize.length * linesSize[0].height),
      };

      return {
        ...innerSize,
        outerWidth: innerSize.innerWidth + itemGap,
        outerHeight: innerSize.innerHeight + itemGap,
      };
    },
    [itemGap, itemMarkHeight, itemMarkWidth, markGap],
  );

  const totalWidth = drawingArea.left + drawingArea.width + drawingArea.right;
  const totalHeight = drawingArea.top + drawingArea.height + drawingArea.bottom;
  const availableWidth = totalWidth - padding.left - padding.right;
  const availableHeight = totalHeight - padding.top - padding.bottom;

  const [seriesWithPosition, legendWidth, legendHeight] = React.useMemo(() => {
    // Start at 0, 0. Will be modified later by padding and position.
    let x = 0;
    let y = 0;

    // total values used to align legend later.
    let totalWidthUsed = 0;
    let totalHeightUsed = 0;
    let rowIndex = 0;
    const rowMaxHeight = [0];

    const seriesWithRawPosition = seriesToDisplay.map(({ label, ...other }) => {
      const itemSpace = getItemSpace(label, labelStyle);
      const rep = {
        ...other,
        label,
        positionX: x,
        positionY: y,
        innerHeight: itemSpace.innerHeight,
        innerWidth: itemSpace.innerWidth,
        outerHeight: itemSpace.outerHeight,
        outerWidth: itemSpace.outerWidth,
        rowIndex,
      };

      if (direction === 'row') {
        if (x + itemSpace.innerWidth > availableWidth) {
          // This legend item would create overflow along the x-axis, so we start a new row.
          x = 0;
          y += rowMaxHeight[rowIndex];
          rowIndex += 1;
          if (rowMaxHeight.length <= rowIndex) {
            rowMaxHeight.push(0);
          }
          rep.positionX = x;
          rep.positionY = y;
          rep.rowIndex = rowIndex;
        }
        totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
        totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);
        rowMaxHeight[rowIndex] = Math.max(rowMaxHeight[rowIndex], itemSpace.outerHeight);

        x += itemSpace.outerWidth;
      }

      if (direction === 'column') {
        if (y + itemSpace.innerHeight > availableHeight) {
          // This legend item would create overflow along the y-axis, so we start a new column.
          x = totalWidthUsed + itemGap;
          y = 0;
          rowIndex = 0;
          rep.positionX = x;
          rep.positionY = y;
          rep.rowIndex = rowIndex;
        }
        if (rowMaxHeight.length <= rowIndex) {
          rowMaxHeight.push(0);
        }
        totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
        totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);

        rowIndex += 1;
        y += itemSpace.outerHeight;
      }

      return rep;
    });

    return [
      seriesWithRawPosition.map((item) => ({
        ...item,
        positionY:
          item.positionY +
          (direction === 'row'
            ? rowMaxHeight[item.rowIndex] / 2 // Get the center of the entire row
            : item.outerHeight / 2), // Get the center of the item
      })),
      totalWidthUsed,
      totalHeightUsed,
    ];
  }, [
    seriesToDisplay,
    getItemSpace,
    labelStyle,
    direction,
    availableWidth,
    availableHeight,
    itemGap,
  ]);

  const gapX = React.useMemo(() => {
    switch (position.horizontal) {
      case 'left':
        return padding.left;
      case 'right':
        return totalWidth - padding.right - legendWidth;
      default:
        return (totalWidth - legendWidth) / 2;
    }
  }, [position.horizontal, padding.left, padding.right, totalWidth, legendWidth]);

  const gapY = React.useMemo(() => {
    switch (position.vertical) {
      case 'top':
        return padding.top;
      case 'bottom':
        return totalHeight - padding.bottom - legendHeight;
      default:
        return (totalHeight - legendHeight) / 2;
    }
  }, [position.vertical, padding.top, padding.bottom, totalHeight, legendHeight]);

  if (hidden) {
    return null;
  }

  return (
    <NoSsr>
      <ChartsLegendRoot className={classes.root}>
        {seriesWithPosition.map(({ id, label, color, positionX, positionY }) => (
          <g
            key={id}
            className={classes.series}
            transform={`translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`}
          >
            <rect
              className={classes.mark}
              x={isRTL ? -itemMarkWidth : 0}
              y={-itemMarkHeight / 2}
              width={itemMarkWidth}
              height={itemMarkHeight}
              fill={color}
            />
            <ChartsText
              style={labelStyle}
              text={label}
              x={(isRTL ? -1 : 1) * (itemMarkWidth + markGap)}
              y={0}
            />
          </g>
        ))}
      </ChartsLegendRoot>
    </NoSsr>
  );
}

DefaultChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']).isRequired,
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
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
} as any;

export { DefaultChartsLegend };
