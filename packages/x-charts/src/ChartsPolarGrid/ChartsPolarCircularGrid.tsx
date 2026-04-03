import * as React from 'react';
import { PolarGridCircle } from './styledComponents';
import { type ChartsPolarGridClasses } from './chartsPolarGridClasses';
import { useTicks } from '../hooks/useTicks';
import { useRadiusAxis } from '../hooks/useAxis';

interface ChartsPolarCircularGridProps {
  center: { cx: number; cy: number };
  classes: Partial<ChartsPolarGridClasses>;
}

/**
 * Renders concentric circular rings at radius axis tick positions.
 * @ignore - internal component.
 */
export function ChartsPolarCircularGrid(props: ChartsPolarCircularGridProps) {
  const { center, classes } = props;

  const radiusAxis = useRadiusAxis();

  const { scale, tickNumber = 5, tickInterval, tickSpacing } = radiusAxis!;

  const radiusTicks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'radius',
    ordinalTimeTicks: 'ordinalTimeTicks' in radiusAxis! ? radiusAxis.ordinalTimeTicks : undefined,
  });

  return (
    <React.Fragment>
      {radiusTicks.map((tick) => (
        <PolarGridCircle
          key={tick.value}
          cx={center.cx}
          cy={center.cy}
          r={tick.offset}
          className={classes.circularLine}
        />
      ))}
    </React.Fragment>
  );
}
