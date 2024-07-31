import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import { useTheme, styled } from '@mui/material/styles';
import { DrawingArea } from '../context/DrawingProvider';
import { DefaultizedProps } from '../models/helpers';
import { ChartsText, ChartsTextStyle } from '../ChartsText';
import { CardinalDirections } from '../models/layout';
import { getWordsByLines } from '../internals/getWordsByLines';
import type { ChartsLegendProps } from './ChartsLegend';
import { GetItemSpaceType, LegendItemParams } from './chartsLegend.types';
import { legendItemPlacements } from './legendItemsPlacement';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { AnchorPosition, Direction } from './legend.types';

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

export interface LegendPerItemProps
  extends DefaultizedProps<
    Omit<ChartsLegendProps, 'slots' | 'slotProps'>,
    'direction' | 'position'
  > {
  /**
   * The ordered array of item to display in the legend.
   */
  itemsToDisplay: LegendItemParams[];
  classes?: Record<'mark' | 'series' | 'root', string>;
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
const getStandardizedPadding = (padding: LegendPerItemProps['padding']) => {
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

/**
 * Internal component to display an array of items as a legend.
 * Used for series legend, and threshold color legend.
 * @ignore - Do not document
 */
export function LegendPerItem(props: LegendPerItemProps) {
  const {
    hidden,
    position,
    direction,
    itemsToDisplay,
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
  const drawingArea = useDrawingArea();

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

  const getItemSpace: GetItemSpaceType = React.useCallback(
    (label, inStyle = {}) => {
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

  const [itemsWithPosition, legendWidth, legendHeight] = React.useMemo(
    () =>
      legendItemPlacements(
        itemsToDisplay,
        getItemSpace,
        labelStyle,
        direction,
        availableWidth,
        availableHeight,
        itemGap,
      ),
    [itemsToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap],
  );

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
      <ChartsLegendRoot className={classes?.root}>
        {itemsWithPosition.map(({ id, label, color, positionX, positionY }) => (
          <g
            key={id}
            className={classes?.series}
            transform={`translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`}
          >
            <rect
              className={classes?.mark}
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
