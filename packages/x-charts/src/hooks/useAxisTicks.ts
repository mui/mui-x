import { useThemeProps } from '@mui/material/styles';
import { useXAxes, useYAxes } from './useAxis';
import { useTicks } from './useTicks';
import { type AxisId } from '../models/axis';
import { defaultProps } from '../ChartsXAxis/utilities';

export function useXAxisTicks(axisId: AxisId) {
  const { xAxis: xAxes } = useXAxes();
  const axis = xAxes[axisId];

  // FIXME: `useAxisTicksProps` does this, but should we do it here?
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsXAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  // TODO: Can we avoid the valueFormatter here? I'm pretty sure we can refactor it out.
  return useTicks({
    scale: axis.scale,
    tickNumber: axis.tickNumber,
    valueFormatter: defaultizedProps.valueFormatter,
    tickInterval: defaultizedProps.tickInterval,
    tickPlacement: defaultizedProps.tickPlacement,
    tickLabelPlacement: defaultizedProps.tickLabelPlacement,
    tickSpacing: defaultizedProps.tickSpacing,
    direction: 'x',
    // @ts-expect-error
    ordinalTimeTicks: defaultizedProps.ordinalTimeTicks,
  });
}

export function useYAxisTicks(axisId: AxisId) {
  const { yAxis: yAxes } = useYAxes();
  const axis = yAxes[axisId];

  // FIXME: `useAxisTicksProps` does this, but should we do it here?
  // eslint-disable-next-line material-ui/mui-name-matches-component-name
  const themedProps = useThemeProps({ props: axis, name: 'MuiChartsYAxis' });

  const defaultizedProps = {
    ...defaultProps,
    ...themedProps,
  };

  // TODO: Can we avoid the valueFormatter here? I'm pretty sure we can refactor it out.
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
