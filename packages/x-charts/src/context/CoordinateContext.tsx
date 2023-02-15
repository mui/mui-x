import * as React from 'react';

/**
 * @param {unknown} value The data value. Can be any type (string, number, date, ...)
 * @returns {number} The position in the plot
 */
type ScaleFunctionType = (value: unknown) => number;

export type DataParameters = {
  /**
   * Mapping from axis key to scalling function
   */
  xDataToSvg: { [axisKey: string]: ScaleFunctionType };
  yDataToSvg: { [axisKey: string]: ScaleFunctionType };
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
  xDataToSvg: {},
  yDataToSvg: {},
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
