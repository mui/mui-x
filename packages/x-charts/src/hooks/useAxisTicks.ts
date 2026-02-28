import { useThemeProps } from '@mui/material/styles';
import { useXAxes, useYAxes } from './useAxis';
import { type TickItem, useTicks } from './useTicks';
import { type AxisId } from '../models/axis';
import { defaultProps } from '../ChartsXAxis/utilities';

/**
 * Returns the ticks for the given X axis. Ticks outside the drawing area are not included.
 * The ticks returned from this hook are not grouped, i.e., they don't follow the `groups` prop of the axis.
 * @param axisId The id of the X axis.
 */
export function useXAxisTicks(axisId: AxisId): TickItem[] {
  const { xAxis: xAxes } = useXAxes();
  const axis = xAxes[axisId];

  // FIXME: `useAxisTicksProps` does this, but should we do it here?
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  return useTicks({
    scale: axis.scale,
    tickNumber: axis.tickNumber,
    valueFormatter: defaultizedProps.valueFormatter,
    tickInterval: defaultizedProps.tickInterval,
    tickPlacement: defaultizedProps.tickPlacement,
    tickLabelPlacement: defaultizedProps.tickLabelPlacement,
    tickSpacing: defaultizedProps.tickSpacing,
    direction: 'x',
    ordinalTimeTicks:
      'ordinalTimeTicks' in defaultizedProps ? defaultizedProps.ordinalTimeTicks : undefined,
  });
}

/**
 * Returns the ticks for the given Y axis. Ticks outside the drawing area are not included.
 * The ticks returned from this hook are not grouped, i.e., they don't follow the `groups` prop of the axis.
 * @param axisId The id of the Y axis.
 */
export function useYAxisTicks(axisId: AxisId): TickItem[] {
  const { yAxis: yAxes } = useYAxes();
  const axis = yAxes[axisId];

  // FIXME: `useAxisTicksProps` does this, but should we do it here?
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsYAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  return useTicks({
    scale: axis.scale,
    tickNumber: axis.tickNumber,
    valueFormatter: defaultizedProps.valueFormatter,
    tickInterval: defaultizedProps.tickInterval,
    tickPlacement: defaultizedProps.tickPlacement,
    tickLabelPlacement: defaultizedProps.tickLabelPlacement,
    tickSpacing: defaultizedProps.tickSpacing,
    direction: 'y',
    // @ts-expect-error
    ordinalTimeTicks: defaultizedProps.ordinalTimeTicks,
  });
}
