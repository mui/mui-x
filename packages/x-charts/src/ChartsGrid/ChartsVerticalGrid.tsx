import * as React from 'react';
import { useTicks } from '../hooks/useTicks';
import { AxisDefaultized, ChartsXAxisProps, ScaleName } from '../models/axis';
import { GridLine } from './styledComponents';
import { ChartsGridClasses } from './chartsGridClasses';

interface ChartsGridVerticalProps {
  axis: AxisDefaultized<ScaleName, any, ChartsXAxisProps>;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props: ChartsGridVerticalProps) {
  const { axis, start, end, classes } = props;

  const { scale, scaleType, tickNumber, tickInterval } = axis;

  const xTicks = useTicks({ scale, scaleType, tickNumber, tickInterval });

  return (
    <React.Fragment>
      {xTicks.map(({ value, offset }) => (
        <GridLine
          key={`vertical-${value}`}
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
