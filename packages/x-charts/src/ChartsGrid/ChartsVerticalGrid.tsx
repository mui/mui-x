import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import type { ComputedXAxis } from '../models/axis';
import { GridLine } from './styledComponents';
import type { ChartsGridClasses } from './chartsGridClasses';
import { useChartsContext } from '../context/ChartsProvider';

interface ChartsGridVerticalProps {
  axis: ComputedXAxis;
  start: number;
  end: number;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props: ChartsGridVerticalProps) {
  const { instance } = useChartsContext();
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
      {xTicks.map(({ offset }, index) =>
        !instance.isXInside(offset) ? null : (
          <GridLine
            key={index}
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
