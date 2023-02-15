import * as React from 'react';
import { ScaleLinear } from 'd3-scale';

export type DataParameters = {
  /**
   * Mapping from axis key to scalling function
   */
  xAxis: {
    [axisKey: string]: {
      scale: ScaleLinear<unknown, unknown>;
    };
  };
  yAxis: {
    [axisKey: string]: {
      scale: ScaleLinear<unknown, unknown>;
    };
  };
  /**
   * Defines the area in which it is possible to draw the charts
   */
  drawingArea: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

export const CoordinateContext = React.createContext<DataParameters>({
  xAxis: {},
  yAxis: {},
  drawingArea: {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
});

if (process.env.NODE_ENV !== 'production') {
  CoordinateContext.displayName = 'CoordinateContext';
}
