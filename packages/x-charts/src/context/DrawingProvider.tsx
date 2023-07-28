import * as React from 'react';
import PropTypes from 'prop-types';
import useChartDimensions from '../hooks/useChartDimensions';
import { LayoutConfig } from '../models/layout';

export interface DrawingProviderProps extends LayoutConfig {
  children: React.ReactNode;
  svgRef: React.RefObject<SVGSVGElement>;
}

/**
 * Defines the area in which it is possible to draw the charts.
 */
export type DrawingArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const DrawingContext = React.createContext<DrawingArea>({
  top: 0,
  left: 0,
  height: 300,
  width: 400,
});
export const SVGContext = React.createContext<React.RefObject<SVGSVGElement>>({ current: null });

function DrawingProvider({ width, height, margin, svgRef, children }: DrawingProviderProps) {
  const drawingArea = useChartDimensions(width, height, margin);

  return (
    <SVGContext.Provider value={svgRef}>
      <DrawingContext.Provider value={drawingArea}>{children}</DrawingContext.Provider>
    </SVGContext.Provider>
  );
}

DrawingProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  svgRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  width: PropTypes.number.isRequired,
} as any;

export { DrawingProvider };
