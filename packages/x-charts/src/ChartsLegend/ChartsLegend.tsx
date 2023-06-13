import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme, styled } from '@mui/material/styles';
import { DrawingArea, DrawingContext } from '../context/DrawingProvider';
import { AnchorPosition, SizingParams, getSeriesToDisplay } from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartsLegendClasses, getChartsLegendUtilityClass } from './chartsLegendClasses';
import { DefaultizedProps } from '../models/helpers';
import { ChartSeriesDefaultized } from '../models/seriesType/config';

export type ChartsLegendProps = {
  position?: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLegendClasses>;
} & SizingParams;

type DefaultizedChartsLegendProps = DefaultizedProps<ChartsLegendProps, 'direction' | 'position'>;

type SeriesLegendOwnerState = ChartSeriesDefaultized<any> &
  Pick<DefaultizedChartsLegendProps, 'direction'> & { seriesIndex: number };

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

function getTranslePosition({
  position,
  drawingArea,
}: Omit<ChartsLegendRootOwnerState, 'direction' | 'seriesNumber'>) {
  let xValue: string;
  switch (position.horizontal) {
    case 'left':
      xValue = `calc(var(--ChartsLegend-rootOffsetX, 0px) + ${drawingArea.left}px - var(--ChartsLegend-rootWidth))`;
      break;
    case 'middle':
      xValue = `calc(var(--ChartsLegend-rootOffsetX, 0px) + ${
        drawingArea.left + drawingArea.width / 2
      }px - 0.5 * var(--ChartsLegend-rootWidth))`;
      break;
    default:
      xValue = `calc(var(--ChartsLegend-rootOffsetX, 0px) + ${
        drawingArea.left + drawingArea.width
      }px)`;
      break;
  }
  let yValue: string;
  switch (position.vertical) {
    case 'top':
      yValue = `calc(var(--ChartsLegend-rootOffsetY, 0px) + ${drawingArea.top}px - var(--ChartsLegend-rootHeight))`;
      break;
    case 'middle':
      yValue = `calc(var(--ChartsLegend-rootOffsetY, 0px) + ${
        drawingArea.top + drawingArea.height / 2
      }px - 0.5 * var(--ChartsLegend-rootHeight))`;
      break;
    default:
      yValue = `calc(var(--ChartsLegend-rootOffsetY, 0px) + ${
        drawingArea.top + drawingArea.height
      }px)`;
      break;
  }
  return { transform: `translate(${xValue}, ${yValue})` };
}

export const ChartsLegendRoot = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ChartsLegendRootOwnerState }>(({ ownerState }) => {
  const { direction, drawingArea, offsetX, offsetY, seriesNumber, position } = ownerState;

  return {
    '--ChartsLegend-rootOffsetX': typeof offsetX === 'number' ? `${offsetX}px` : undefined,
    '--ChartsLegend-rootOffsetY': typeof offsetY === 'number' ? `${offsetY}px` : undefined,
    '--ChartsLegend-rootWidth':
      direction === 'row'
        ? `calc(var(--ChartsLegend-itemWidth) * ${seriesNumber} + var(--ChartsLegend-rootSpacing) * ${
            seriesNumber - 1
          } )`
        : 'var(--ChartsLegend-itemWidth)',
    '--ChartsLegend-rootHeight':
      direction === 'row'
        ? 'var(--ChartsLegend-itemMarkSize)'
        : `calc(var(--ChartsLegend-itemMarkSize) * ${seriesNumber} + var(--ChartsLegend-rootSpacing) * ${
            seriesNumber - 1
          } )`,
    ...getTranslePosition({ position, drawingArea, offsetX, offsetY }),
  };
});

export const ChartsSeriesLegendGroup = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'ChartsSeriesLegendGroup',
  overridesResolver: (props, styles) => styles.series,
})<{ ownerState: SeriesLegendOwnerState }>(({ ownerState }) => {
  const { direction, seriesIndex } = ownerState;

  if (direction === 'row') {
    return {
      transform: `translate(calc(${seriesIndex} * (var(--ChartsLegend-itemWidth) + var(--ChartsLegend-rootSpacing))), 0)`,
    };
  }
  return {
    transform: `translate(0, calc(${seriesIndex} * (var(--ChartsLegend-itemMarkSize) + var(--ChartsLegend-rootSpacing))))`,
  };
});

export const ChartsLegendMark = styled('rect', {
  name: 'MuiChartsLegend',
  slot: 'Mark',
  overridesResolver: (props, styles) => styles.mark,
})<{ ownerState: { color: string } }>(({ ownerState }) => ({
  x: 0,
  y: 0,
  width: 'var(--ChartsLegend-itemMarkSize)',
  height: 'var(--ChartsLegend-itemMarkSize)',
  fill: ownerState.color,
}));
export const ChartsLegendLabel = styled('text', {
  name: 'MuiChartsLegend',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  ...theme.typography.body1,
  color: 'inherit',
  transform: `translate(
      calc(var(--ChartsLegend-itemMarkSize) + var(--ChartsLegend-labelSpacing)),
      calc(0.5 * var(--ChartsLegend-itemMarkSize))
      )`,
  fill: theme.palette.text.primary,
  alignmentBaseline: 'central',
}));

const defaultProps = {
  position: { horizontal: 'middle', vertical: 'top' },
  direction: 'row',
  markSize: 20,
  itemWidth: 100,
  spacing: 2,
} as const;

export function ChartsLegend(inProps: ChartsLegendProps) {
  const props: DefaultizedChartsLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiChartsLegend',
  });

  const { position, direction, offset } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const drawingArea = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  return (
    <ChartsLegendRoot
      ownerState={{
        direction,
        offsetX: offset?.x,
        offsetY: offset?.y,
        seriesNumber: seriesToDisplay.length,
        position,
        drawingArea,
      }}
      className={classes.root}
    >
      {seriesToDisplay.map(({ id, label, color }, seriesIndex) => (
        <ChartsSeriesLegendGroup
          key={id}
          ownerState={{ direction, seriesIndex, ...series }}
          className={classes.series}
        >
          <ChartsLegendMark ownerState={{ color }} className={classes.mark} />
          <ChartsLegendLabel className={classes.label}>{label}</ChartsLegendLabel>
        </ChartsSeriesLegendGroup>
      ))}
    </ChartsLegendRoot>
  );
}
