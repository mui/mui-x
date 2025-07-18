import * as React from 'react';
import { useDrawingArea } from '../hooks';
import { useUtilityClasses } from './cartesianDrawingAreaClasses';

export function ChartsCartesianDrawingArea() {
  const { left, top, width, height } = useDrawingArea();
  const classes = useUtilityClasses();

  return (
    <rect className={classes.root} fill="none" x={left} y={top} width={width} height={height} />
  );
}
