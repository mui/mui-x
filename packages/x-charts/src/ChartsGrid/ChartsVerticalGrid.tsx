import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { type ComputedXAxis } from '../models/axis';
import { GridLine } from './styledComponents';
import { type ChartsGridClasses } from './chartsGridClasses';
import { useChartContext } from '../context/ChartProvider';

interface ChartsGridVerticalProps {
  axis: ComputedXAxis;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props: ChartsGridVerticalProps) {
  const { instance } = useChartContext();
  const { axis, start, end, classes } = props;

  const { scale, tickNumber, tickInterval, tickSpacing } = axis;

  const xTicks = useTicks({
    scale,
    tickNumber,
    tickInterval,
    tickSpacing,
    direction: 'x',
    ordinalTimeTicks: 'ordinalTimeTicks' in axis ? axis.ordinalTimeTicks : undefined,
  });

  return (
    <React.Fragment>
      {xTicks.map(({ value, offset }) =>
        !instance.isXInside(offset) ? null : (
          <GridLine
            key={`vertical-${value?.getTime?.() ?? value}`}
            y1={start}
            y2={end}
            x1={offset}
            x2={offset}
            className={classes.verticalLine}
          />
        ),
      )}
    </React.Fragment>
  );
}
