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
  /**
   * The gap between the left border of the SVG and the drawing area.
   */
  left: number;
  /**
   * The gap between the top border of the SVG and the drawing area.
   */
  top: number;
  /**
   * The gap between the bottom border of the SVG and the drawing area.
   */
  bottom: number;
  /**
   * The gap between the right border of the SVG and the drawing area.
   */
  right: number;
  /**
   * The width of the drawing area.
   */
  width: number;
  /**
   * The height of the drawing area.
   */
  height: number;
};

export const DrawingContext = React.createContext<DrawingArea>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
});
export const SVGContext = React.createContext<React.RefObject<SVGSVGElement>>({ current: null });

/**
 * API:
 *
 * - [DrawingProvider API](https://mui.com/x/api/charts/drawing-provider/)
 */
function DrawingProvider(props: DrawingProviderProps) {
  const { width, height, margin, svgRef, children } = props;
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
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
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
