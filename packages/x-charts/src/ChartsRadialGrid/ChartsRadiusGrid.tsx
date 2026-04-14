import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { GridCircle } from './styledComponents';
import { type ChartsRadialGridClasses } from './chartsRadialGridClasses';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { type PolarAxisDefaultized } from '../models/axis';

interface ChartsRadiusGridProps {
  axis: PolarAxisDefaultized<any, any, any>;
  classes: Partial<ChartsRadialGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsRadiusGrid(props: ChartsRadiusGridProps) {
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { axis, classes } = props;
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const { scale, tickNumber, tickInterval, tickSpacing } = axis;

  const ticks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'radius',
  });

  return (
    <React.Fragment>
      {ticks.map(({ value, offset }) => (
        <GridCircle
          key={`radius-${value?.getTime?.() ?? value}`}
          cx={cx}
          cy={cy}
          r={offset}
          className={classes.radiusLine}
        />
      ))}
    </React.Fragment>
  );
}
