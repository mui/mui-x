import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { NoSsr } from '@mui/base/NoSsr';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme, styled } from '@mui/material/styles';
import { DrawingArea, DrawingContext } from '../context/DrawingProvider';
import { AnchorPosition, SizingParams, getSeriesToDisplay } from './utils';
import { FormattedSeries, SeriesContext } from '../context/SeriesContextProvider';
import {
  ChartsLegendClasses,
  getChartsLegendUtilityClass,
  legendClasses,
} from './chartsLegendClasses';
import { DefaultizedProps } from '../models/helpers';
import { LegendParams } from '../models/seriesType/config';
import { Text, getWordsByLines } from '../internals/components/Text';
import { CardinalDirections } from '../models/layout';

export interface ChartsLegendSlotsComponent {
  legend?: React.JSXElementConstructor<LegendRendererProps>;
}

export interface ChartsLegendSlotComponentProps {
  legend?: Partial<LegendRendererProps>;
}

export type ChartsLegendProps = {
  position?: AnchorPosition;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLegendClasses>;
  /**
   * Set to true to hide the legend.
   */
  hidden?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLegendSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLegendSlotComponentProps;
} & SizingParams;

type DefaultizedChartsLegendProps = DefaultizedProps<ChartsLegendProps, 'direction' | 'position'>;

const useUtilityClasses = (ownerState: DefaultizedChartsLegendProps & { theme: Theme }) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getChartsLegendUtilityClass, classes);
};

export type ChartsLegendRootOwnerState = {
  position: AnchorPosition;
  direction: 'row' | 'column';
  drawingArea: DrawingArea;
  offsetX?: number;
  offsetY?: number;
  seriesNumber: number;
};

export const ChartsLegendRoot = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => {
  return {
    [`& .${legendClasses.label}`]: {
      ...theme.typography.body1,
      color: 'inherit',
      fill: (theme.vars || theme).palette.text.primary,
    },
    [`& .${legendClasses.mark}`]: {
      x: 0,
      y: 0,
    },
  };
});

const defaultProps = {
  position: { horizontal: 'middle', vertical: 'top' },
  direction: 'row',
} as const;

export interface LegendRendererProps
  extends Omit<DefaultizedChartsLegendProps, 'slots' | 'slotProps'> {
  series: FormattedSeries;
  seriesToDisplay: LegendParams[];
  drawingArea: DrawingArea;
  classes: Record<'mark' | 'series' | 'root', string>;
  /**
   * Style applied to legend labels
   * @default theme.
   */
  labelStyle?: React.CSSProperties;
  /**
   * Width of the item mark (in px)
   * @default 20
   */
  itemMarkWidth?: number;
  /**
   * Height of the item mark (in px)
   * @default 20
   */
  itemMarkHeight?: number;
  /**
   * Space between the mark and the label (in px)
   * @default 5
   */
  markGap?: number;
  /**
   * Space between two legend items (in px)
   * @default 10
   */
  itemGap?: number;
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 0
   */
  padding?: number | Partial<CardinalDirections<number>>;
}

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

  const labelStyle = React.useMemo(
    () => ({ ...theme.typography.caption, lineHeight: 1, ...inLabelStyle }),
    [inLabelStyle, theme.typography.caption],
  );

  const padding = React.useMemo(() => getStandardizedPadding(paddingProps), [paddingProps]);

  const getItemSpace = React.useCallback(
    (label: string, style?: React.CSSProperties) => {
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

  const seriesWithPosition = React.useMemo(() => {
    // Start at 0, 0. Will be modified latter by padding and position.
    let x = 0;
    let y = 0;

    // total values used to align legend latter.
    let totalWidthUsed = 0;
    let totalHeightUsed = 0;
    let rowIndex = 0;
    const rowMaxHeight = [0];

    const seriesWithRawPosition = seriesToDisplay
      .map(({ label, ...other }) => {
        const itemSpace = getItemSpace(label, labelStyle);
        const rep = {
          ...other,
          label,
          positionX: x,
          positionY: y,
          innerHeight: itemSpace.innerHeight,
          innerWidth: itemSpace.innerWidth,
          rowIndex,
        };

        if (direction === 'row') {
          if (x + itemSpace.innerWidth > availableWidth) {
            x = 0;
            y += itemSpace.outerHeight;
            rowIndex += 1;
            if (rowMaxHeight.length <= rowIndex) {
              rowMaxHeight.push(0);
            }
            rep.positionX = x;
            rep.positionY = y;
            rep.rowIndex = rowIndex;
          }
          totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.innerWidth);
          totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.innerHeight);
          rowMaxHeight[rowIndex] = Math.max(rowMaxHeight[rowIndex], itemSpace.innerHeight);

          x += itemSpace.outerWidth;
        }

        if (direction === 'column') {
          if (y + itemSpace.innerHeight > availableHeight) {
            x = totalWidthUsed + itemGap;
            y = 0;
            rowIndex = 0;
            rep.positionX = x;
            rep.positionY = y;
            rep.rowIndex = rowIndex;
          }
          rowIndex += 1;
          if (rowMaxHeight.length <= rowIndex) {
            rowMaxHeight.push(0);
          }
          totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.innerWidth);
          totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.innerHeight);
          y += itemSpace.outerHeight;
        }

        return rep;
      })
      .map((item) => ({
        ...item,
        positionY: item.positionY + (rowMaxHeight[item.rowIndex] - itemMarkHeight) / 2,
      }));

    // Move the legend accroding to padding and position
    let gapX = 0;
    let gapY = 0;
    switch (position.horizontal) {
      case 'left':
        gapX = padding.left;
        break;
      case 'right':
        gapX = totalWidth - padding.right - totalWidthUsed;
        break;
      default:
        gapX = (totalWidth - totalWidthUsed) / 2;
        break;
    }
    switch (position.vertical) {
      case 'top':
        gapY = padding.top;
        break;
      case 'bottom':
        gapY = totalHeight - padding.bottom - totalHeightUsed;
        break;
      default:
        gapY = (totalHeight - totalHeightUsed) / 2;
        break;
    }
    return seriesWithRawPosition.map((item) => ({
      ...item,
      positionX: item.positionX + gapX,
      positionY: item.positionY + gapY,
    }));
  }, [
    seriesToDisplay,
    position.horizontal,
    position.vertical,
    getItemSpace,
    labelStyle,
    direction,
    availableWidth,
    availableHeight,
    itemGap,
    itemMarkHeight,
    padding.left,
    padding.right,
    padding.top,
    padding.bottom,
    totalWidth,
    totalHeight,
  ]);

  if (hidden) {
    return null;
  }

  return (
    <NoSsr>
      <ChartsLegendRoot className={classes.root}>
        {seriesWithPosition.map(({ id, label, color, positionX, positionY, innerHeight }) => (
          <g key={id} className={classes.series} transform={`translate(${positionX} ${positionY})`}>
            <rect
              className={classes.mark}
              y={(innerHeight - itemMarkHeight) / 2}
              width={itemMarkWidth}
              height={itemMarkHeight}
              fill={color}
            />
            <Text
              style={labelStyle}
              dominantBaseline="central"
              textAnchor="start"
              text={label}
              x={itemMarkWidth + markGap}
              y={itemMarkHeight / 2}
            />
          </g>
        ))}
      </ChartsLegendRoot>
    </NoSsr>
  );
}

export function ChartsLegend(inProps: ChartsLegendProps) {
  const props: DefaultizedChartsLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiChartsLegend',
  });

  const { position, direction, hidden, slots, slotProps } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const drawingArea = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  const ChartLegendRender = slots?.legend ?? DefaultChartsLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: {
      position,
      direction,
      classes,
      drawingArea,
      series,
      hidden,
      seriesToDisplay,
    },
    ownerState: {},
  });

  return <ChartLegendRender {...chartLegendRenderProps} />;
}
