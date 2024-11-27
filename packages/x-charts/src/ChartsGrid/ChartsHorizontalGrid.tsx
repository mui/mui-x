import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { AxisDefaultized, ChartsYAxisProps, ScaleName } from '../models/axis';
import { GridLine } from './styledComponents';
import { ChartsGridClasses } from './chartsGridClasses';

interface ChartsGridHorizontalProps {
  axis: AxisDefaultized<ScaleName, any, ChartsYAxisProps>;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridHorizontal(props: ChartsGridHorizontalProps) {
  const { axis, start, end, classes } = props;

  const { scale, tickNumber, tickInterval } = axis;

  const yTicks = useTicks({ scale, tickNumber, tickInterval });

  return (
    <React.Fragment>
      {yTicks.map(({ value, offset }) => (
        <GridLine
          key={`horizontal-${value}`}
          y1={offset}
          y2={offset}
          x1={start}
          x2={end}
          className={classes.horizontalLine}
        />
      ))}
    </React.Fragment>
  );
}
