import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme, styled } from '@mui/material/styles';
import { DrawingContext } from '../context/DrawingProvider';
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

type LegendRootOwnerState = any;

function getTranslePosition(position: AnchorPosition, chartBox, offsetX, offsetY) {
  let xValue: string;
  switch (position.horizontal) {
    case 'left':
      xValue = `calc(${offsetX + chartBox.left}px - var(--Legend-width))`;
      break;
    case 'middle':
      xValue = `calc(${offsetX + chartBox.left + chartBox.width / 2}px - 0.5 *var(--Legend-width))`;
      break;
    default:
      xValue = `calc(${offsetX}px + ${chartBox.left + chartBox.width}px)`;
      break;
  }
  let yValue: string;
  switch (position.vertical) {
    case 'top':
      yValue = `calc(${offsetY + chartBox.top}px - var(--Legend-height))`;
      break;
    case 'middle':
      yValue = `calc(${
        offsetY + chartBox.top + chartBox.height / 2
      }px - 0.5 * var(--Legend-height))`;
      break;
    default:
      yValue = `calc(${offsetY + chartBox.top + chartBox.height}px)`;
      break;
  }
  return { transform: `translate(${xValue}, ${yValue})` };
}

export const LegendRoot = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: LegendRootOwnerState }>(({ ownerState }) => {
  const { direction, chartBox, offsetX, offsetY, seriesNumber, position } = ownerState;

  return {
    '--Legend-width':
      direction === 'row'
        ? `calc(var(--Legend-item-width) * ${seriesNumber} + var(--Legend-spacing) *${
            seriesNumber - 1
          } )`
        : 'var(--Legend-item-width)',
    '--Legend-height':
      direction === 'row'
        ? 'var(--Legend-mark-size)'
        : `calc(var(--Legend-mark-size) * ${seriesNumber} + var(--Legend-spacing) *${
            seriesNumber - 1
          } )`,
    ...getTranslePosition(position, chartBox, offsetX, offsetY),
  };
});

export const SeriesLegendGroup = styled('g', {
  name: 'MuiChartsLegend',
  slot: 'SeriesLegendGroup',
  overridesResolver: (props, styles) => styles.series,
})<{ ownerState: SeriesLegendOwnerState }>(({ ownerState }) => {
  const { direction, seriesIndex } = ownerState;

  if (direction === 'row') {
    return {
      transform: `translate(calc(${seriesIndex} * (var(--Legend-item-width) + var(--Legend-spacing))), 0)`,
    };
  }
  return {
    transform: `translate(0, calc(${seriesIndex} * (var(--Legend-mark-size) + var(--Legend-spacing))))`,
  };
});

export const LegendMark = styled('rect', {
  name: 'MuiChartsLegend',
  slot: 'Mark',
  overridesResolver: (props, styles) => styles.mark,
})<{ ownerState: { color: string } }>(({ ownerState }) => ({
  x: 0,
  y: 0,
  width: 'var(--Legend-mark-size)',
  height: 'var(--Legend-mark-size)',
  fill: ownerState.color,
}));
export const LegendLabel = styled('text', {
  name: 'MuiChartsLegend',
  slot: 'Label',
  overridesResolver: (props, styles) => styles.label,
})(({ theme }) => ({
  ...theme.typography.body1,
  color: 'inherit',
  transform: `translate(
      calc(var(--Legend-mark-size) + var(--Legend-spacing)),
      calc(0.5 * var(--Legend-mark-size))
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

  const { left, top, width, height } = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  return (
    <LegendRoot
      ownerState={{
        direction,
        offsetX,
        offsetY,
        seriesNumber: seriesToDisplay.length,
        position,
        chartBox: { left, top, width, height },
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
