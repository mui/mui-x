import * as React from 'react';
import { DrawingAreaState } from '../context/DrawingAreaProvider';
import { useTicks } from '../hooks/useTicks';
import { AxisDefaultized, ChartsYAxisProps, ScaleName } from '../models/axis';
import { GridLine } from './styledComponents';
import { ChartsGridClasses } from './chartsGridClasses';

interface ChartsGridHorizontalProps {
  axis: AxisDefaultized<ScaleName, any, ChartsYAxisProps>;
  drawingArea: DrawingAreaState;
  classes: Partial<ChartsGridClasses>;
}

/**
 * @ignore - internal component.
 */
export function ChartsGridHorizontal(props: ChartsGridHorizontalProps) {
  const { axis, drawingArea, classes } = props;

  const { scale, tickNumber, tickInterval } = axis;

  const yTicks = useTicks({ scale, tickNumber, tickInterval });

  return (
    <React.Fragment>
      {yTicks.map(({ value, offset }) => (
        <GridLine
          key={`horizontal-${value}`}
          y1={offset}
          y2={offset}
          x1={drawingArea.left}
          x2={drawingArea.left + drawingArea.width}
          className={classes.horizontalLine}
        />
      ))}
    </React.Fragment>
  );
}
