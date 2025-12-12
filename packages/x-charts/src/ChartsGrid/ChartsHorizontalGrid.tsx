import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { type ComputedYAxis } from '../models/axis';
import { GridLine } from './styledComponents';
import { type ChartsGridClasses } from './chartsGridClasses';
import { useChartContext } from '../context/ChartProvider';

interface ChartsGridHorizontalProps {
  axis: ComputedYAxis;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridHorizontal(props: ChartsGridHorizontalProps) {
  const { instance } = useChartContext();
  const { axis, start, end, classes } = props;

  const { scale, tickNumber, tickInterval, tickSpacing } = axis;

  const yTicks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'y',
    ordinalTimeTicks: 'ordinalTimeTicks' in axis ? axis.ordinalTimeTicks : undefined,
  });

  return (
    <React.Fragment>
      {yTicks.map(({ value, offset }) =>
        !instance.isYInside(offset) ? null : (
          <GridLine
            key={`horizontal-${value?.getTime?.() ?? value}`}
            y1={offset}
            y2={offset}
            x1={start}
            x2={end}
            className={classes.horizontalLine}
          />
        ),
      )}
    </React.Fragment>
  );
}
