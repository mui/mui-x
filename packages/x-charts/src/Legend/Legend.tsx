import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme, styled } from '@mui/material/styles';
import { DrawingArea, DrawingContext } from '../context/DrawingProvider';
import { AnchorPosition, SizingParams, getSeriesToDisplay } from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';
import { LegendClasses, getLegendUtilityClass } from './legendClasses';
import { DefaultizedProps } from '../models/helpers';
import { ChartSeriesDefaultized } from '../models/seriesType/config';

export type LegendProps = {
  position?: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<LegendClasses>;
} & SizingParams;

type DefaultizedLegendProps = DefaultizedProps<LegendProps, 'direction' | 'position'>;

type SeriesLegendOwnerState = ChartSeriesDefaultized<any> &
  Pick<DefaultizedLegendProps, 'direction'> & { seriesIndex: number };

const useUtilityClasses = (ownerState: DefaultizedLegendProps & { theme: Theme }) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

type LegendRootOwnerState = {
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
}: Omit<LegendRootOwnerState, 'direction' | 'seriesNumber'>) {
  let xValue: string;
  switch (position.horizontal) {
    case 'left':
      xValue = `calc(var(--Legend-rootOffsetX, 0px) + ${drawingArea.left}px - var(--Legend-rootWidth))`;
      break;
    case 'middle':
      xValue = `calc(var(--Legend-rootOffsetX, 0px) + ${
        drawingArea.left + drawingArea.width / 2
      }px - 0.5 * var(--Legend-rootWidth))`;
      break;
    default:
      xValue = `calc(var(--Legend-rootOffsetX, 0px) + ${drawingArea.left + drawingArea.width}px)`;
      break;
  }
  let yValue: string;
  switch (position.vertical) {
    case 'top':
      yValue = `calc(var(--Legend-rootOffsetY, 0px) + ${drawingArea.top}px - var(--Legend-rootHeight))`;
      break;
    case 'middle':
      yValue = `calc(var(--Legend-rootOffsetY, 0px) + ${
        drawingArea.top + drawingArea.height / 2
      }px - 0.5 * var(--Legend-rootHeight))`;
      break;
    default:
      yValue = `calc(var(--Legend-rootOffsetY, 0px) + ${drawingArea.top + drawingArea.height}px)`;
      break;
  }
  return { transform: `translate(${xValue}, ${yValue})` };
}

export const LegendRoot = styled('g', {
  name: 'MuiLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: LegendRootOwnerState }>(({ ownerState }) => {
  const { direction, drawingArea, offsetX, offsetY, seriesNumber, position } = ownerState;

  return {
    '--Legend-rootOffsetX': typeof offsetX === 'number' ? `${offsetX}px` : undefined,
    '--Legend-rootOffsetY': typeof offsetY === 'number' ? `${offsetY}px` : undefined,
    '--Legend-rootWidth':
      direction === 'row'
        ? `calc(var(--Legend-itemWidth) * ${seriesNumber} + var(--Legend-rootSpacing) * ${
            seriesNumber - 1
          } )`
        : 'var(--Legend-itemWidth)',
    '--Legend-rootHeight':
      direction === 'row'
        ? 'var(--Legend-itemMarkSize)'
        : `calc(var(--Legend-itemMarkSize) * ${seriesNumber} + var(--Legend-rootSpacing) * ${
            seriesNumber - 1
          } )`,
    ...getTranslePosition({ position, drawingArea, offsetX, offsetY }),
  };
});

export const SeriesLegendGroup = styled('g', {
  name: 'MuiLegend',
  slot: 'SeriesLegendGroup',
  overridesResolver: (props, styles) => styles.series,
})<{ ownerState: SeriesLegendOwnerState }>(({ ownerState }) => {
  const { direction, seriesIndex } = ownerState;

  if (direction === 'row') {
    return {
      transform: `translate(calc(${seriesIndex} * (var(--Legend-itemWidth) + var(--Legend-rootSpacing))), 0)`,
    };
  }
  return {
    transform: `translate(0, calc(${seriesIndex} * (var(--Legend-itemMarkSize) + var(--Legend-rootSpacing))))`,
  };
});

export const LegendMark = styled('rect', {
  name: 'MuiLegend',
  slot: 'Mark',
  overridesResolver: (props, styles) => styles.mark,
})<{ ownerState: { color: string } }>(({ ownerState }) => ({
  x: 0,
  y: 0,
  width: 'var(--Legend-itemMarkSize)',
  height: 'var(--Legend-itemMarkSize)',
  fill: ownerState.color,
}));
export const LegendLabel = styled('text', {
  name: 'MuiLegend',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  ...theme.typography.body1,
  color: 'inherit',
  transform: `translate(
      calc(var(--Legend-itemMarkSize) + var(--Legend-labelSpacing)),
      calc(0.5 * var(--Legend-itemMarkSize))
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

export function Legend(inProps: LegendProps) {
  const props: DefaultizedLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiLegend',
  });

  const { position, direction, offset } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const drawingArea = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  return (
    <LegendRoot
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
        <SeriesLegendGroup
          key={id}
          ownerState={{ direction, seriesIndex, ...series }}
          className={classes.series}
        >
          <LegendMark ownerState={{ color }} className={classes.mark} />
          <LegendLabel className={classes.label}>{label}</LegendLabel>
        </SeriesLegendGroup>
      ))}
    </LegendRoot>
  );
}
