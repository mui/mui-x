import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { GridCircle, GridPath } from './styledComponents';
import { type ChartsRadialGridClasses } from './chartsRadialGridClasses';
import { useChartsContext } from '../context/ChartsProvider';
import {
  selectorChartPolarCenter,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { type PolarAxisDefaultized } from '../models/axis';

interface ChartsRadiusGridProps {
  axis: PolarAxisDefaultized<any, any, any>;
  startAngle: number;
  endAngle: number;
  classes: Partial<ChartsRadialGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsRadiusGrid(props: ChartsRadiusGridProps) {
  const { store } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { axis, startAngle, endAngle, classes } = props;
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const { scale, tickNumber, tickInterval, tickSpacing } = axis;

  const ticks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'radius',
  });

  const isFullCircle = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 0.0001;

  if (isFullCircle) {
    return (
      <React.Fragment>
        {ticks.map(({ offset: radius }) => (
          <GridCircle
            key={`radius-${radius}`}
            cx={cx}
            cy={cy}
            r={radius}
            className={classes.radiusLine}
          />
        ))}
      </React.Fragment>
    );
  }

  const startDx = Math.cos(startAngle - Math.PI / 2);
  const startDy = Math.sin(startAngle - Math.PI / 2);
  const endDx = Math.cos(endAngle - Math.PI / 2);
  const endDy = Math.sin(endAngle - Math.PI / 2);

  const isLargeArc = Math.abs(endAngle - startAngle) >= Math.PI;
  return (
    <React.Fragment>
      {ticks.map(({ offset: radius }) => {
        return (
          <GridPath
            key={`radius-${radius}`}
            d={`M${cx + startDx * radius},${cy + startDy * radius} A ${radius} ${radius} 0 ${isLargeArc ? 1 : 0} 1 ${cx + endDx * radius},${cy + endDy * radius}`}
            className={classes.radiusLine}
          />
        );
      })}
    </React.Fragment>
  );
}
