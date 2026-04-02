import * as React from 'react';
import { PolarGridLine } from './styledComponents';
import { type ChartsPolarGridClasses } from './chartsPolarGridClasses';
import { useRadiusAxis, useRotationAxis } from '../hooks';
import { useTicks } from '../hooks/useTicks';
import { generatePolar2svg } from '../internals/plugins/featurePlugins/useChartPolarAxis/coordinateTransformation';

interface ChartsPolarRadialGridProps {
  center: { cx: number; cy: number };
  classes: Partial<ChartsPolarGridClasses>;
}

/**
 * Renders radial lines from the center to each corner of the polar grid.
 * @ignore - internal component.
 */
export function ChartsPolarRadialGrid(props: ChartsPolarRadialGridProps) {
  const { center, classes } = props;

  const radiusAxis = useRadiusAxis();
  const rotationAxis = useRotationAxis();

  const { scale, tickNumber = 5, tickInterval, tickSpacing } = rotationAxis!;

  const rotationTicks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'rotation',
    ordinalTimeTicks:
      'ordinalTimeTicks' in rotationAxis! ? rotationAxis.ordinalTimeTicks : undefined,
  });

  const radiusRange = radiusAxis?.scale.range() ?? [0, 0];

  const polar2Svg = generatePolar2svg(center);
  return (
    <React.Fragment>
      {rotationTicks.map((tick) => {
        const [x1, y1] = polar2Svg(radiusRange[0], tick.offset);
        const [x2, y2] = polar2Svg(radiusRange[1], tick.offset);
        return (
          <PolarGridLine
            key={tick.value}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={classes.radialLine}
          />
        );
      })}
    </React.Fragment>
  );
}
