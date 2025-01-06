import * as React from 'react';
import { DrawingAreaState } from '../context/DrawingAreaProvider';
import { useTicks } from '../hooks/useTicks';
import { AxisDefaultized, ChartsXAxisProps, ScaleName } from '../models/axis';
import { GridLine } from './styledComponents';
import { ChartsGridClasses } from './chartsGridClasses';

interface ChartsGridVerticalProps {
  axis: AxisDefaultized<ScaleName, any, ChartsXAxisProps>;
  drawingArea: DrawingAreaState;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props: ChartsGridVerticalProps) {
  const { axis, drawingArea, classes } = props;

  const { scale, tickNumber, tickInterval } = axis;

  const xTicks = useTicks({ scale, tickNumber, tickInterval });

  return (
    <React.Fragment>
      {xTicks.map(({ value, offset }) => (
        <GridLine
          key={`vertical-${value}`}
          y1={drawingArea.top}
          y2={drawingArea.top + drawingArea.height}
          x1={offset}
          x2={offset}
          className={classes.verticalLine}
        />
      ))}
    </React.Fragment>
  );
}
