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
import { getStringSize } from '../internals/domUtils';
import { Text } from '../internals/components/Text';

export interface ChartsLegendSlotsComponent {
  legend?: React.JSXElementConstructor<LegendRendererProps>;
}

export interface ChartsLegendSlotComponentProps {
  legend?: Partial<LegendRendererProps>;
}

export type ChartsLegendProps = {
  position?: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
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
      fill: theme.palette.text.primary,
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
  markSize: 20,
  itemWidth: 100,
  spacing: 2,
} as const;

export interface LegendRendererProps
  extends Omit<DefaultizedChartsLegendProps, 'slots' | 'slotProps'> {
  series: FormattedSeries;
  seriesToDisplay: LegendParams[];
  drawingArea: DrawingArea;
  classes: Record<'label' | 'mark' | 'series' | 'root', string>;
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
  labelSpacing?: number;
}

function getPosition(
  seriesToDisplay: LegendParams,
  direction: LegendRendererProps['direction'],
  position: LegendRendererProps['position'],
){
  
};
function DefaultChartsLegend(props: LegendRendererProps) {
  const {
    hidden,
    position,
    direction,
    offset,
    seriesToDisplay,
    drawingArea,
    classes,
    itemMarkWidth = 20,
    itemMarkHeight = 20,
    labelSpacing = 5,
  } = props;

  const seriesWithPosition = React.useMemo(() => {
    let x = drawingArea.left + (offset?.x ?? 0);
    let y = offset?.y ?? 0;

    return seriesToDisplay.map(({ label, ...other }) => {
      const rep = {
        ...other,
        label,
        size: getStringSize(label),
        positionX: x,
        positionY: y,
      };

      if (x + rep.size.width > drawingArea.left + drawingArea.width) {
        x = drawingArea.left + (offset?.x ?? 0);
        y += itemMarkSize + labelSpacing;
        rep.positionX = x;
        rep.positionY = y;
      }

      x += itemMarkSize + 3 * labelSpacing + rep.size.width;
      return rep;
    });
  }, [
    drawingArea.left,
    drawingArea.width,
    itemMarkSize,
    labelSpacing,
    offset?.x,
    offset?.y,
    seriesToDisplay,
  ]);

  if (hidden) {
    return null;
  }
  return (
    <NoSsr>
      <ChartsLegendRoot className={classes.root}>
        {seriesWithPosition.map(({ id, label, color, positionX, positionY }) => (
          <g key={id} className={classes.series} transform={`translate(${positionX} ${positionY})`}>
            <rect
              className={classes.mark}
              width={itemMarkWidth}
              height={itemMarkHeight}
              fill={color}
            />
            <Text
              className={classes.label}
              dominantBaseline="central"
              textAnchor="start"
              text={label}
              x={itemMarkWidth + labelSpacing}
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

  const { position, direction, offset, hidden, slots, slotProps } = props;
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
      offset,
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
