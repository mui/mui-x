import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { ComputedAxis, ChartsXAxisProps, ScaleName } from '../models/axis';
import { GridLine } from './styledComponents';
import { ChartsGridClasses } from './chartsGridClasses';

interface ChartsGridVerticalProps {
  axis: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props: ChartsGridVerticalProps) {
  const { axis, start, end, classes } = props;

  const { scale, tickNumber, tickInterval } = axis;

  const xTicks = useTicks({ scale, tickNumber, tickInterval });

  return (
    <React.Fragment>
      {xTicks.map(({ value, offset }) => (
        <GridLine
          key={`vertical-${value.getTime?.() ?? value}`}
          y1={start}
          y2={end}
          x1={offset}
          x2={offset}
          className={classes.verticalLine}
        />
      ))}
    </React.Fragment>
  );
}
