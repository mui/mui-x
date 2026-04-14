import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { GridLine } from './styledComponents';
import { type ChartsRadialGridClasses } from './chartsRadialGridClasses';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { type PolarAxisDefaultized } from '../models/axis';

interface ChartsRotationGridProps {
  axis: PolarAxisDefaultized<any, any, any>;
  radius: number;
  classes: Partial<ChartsRadialGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsRotationGrid(props: ChartsRotationGridProps) {
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { axis, radius, classes } = props;
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const { scale, tickNumber, tickInterval, tickSpacing } = axis;

  const ticks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'rotation',
  });

  return (
    <React.Fragment>
      {ticks.map(({ value, offset }) => {
        const angle = (offset * Math.PI) / 180 - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        return (
          <GridLine
            key={`rotation-${value?.getTime?.() ?? value}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            className={classes.rotationLine}
          />
        );
      })}
    </React.Fragment>
  );
}
