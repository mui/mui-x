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
  innerRadius: number;
  outerRadius: number;
  classes: Partial<ChartsRadialGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsRotationGrid(props: ChartsRotationGridProps) {
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { axis, innerRadius, outerRadius, classes } = props;
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
        const angle = offset - Math.PI / 2;

        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        const x1 = cx + innerRadius * dx;
        const y1 = cy + innerRadius * dy;
        const x2 = cx + outerRadius * dx;
        const y2 = cy + outerRadius * dy;
        return (
          <GridLine
            key={`rotation-${value?.getTime?.() ?? value}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={classes.rotationLine}
          />
        );
      })}
    </React.Fragment>
  );
}
