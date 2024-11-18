import * as React from 'react';
import { LayoutConfig } from '../../models';

export interface DrawingAreaProviderProps extends LayoutConfig {
  children: React.ReactNode;
}

/**
 * Defines the area in which it is possible to draw the charts.
 */
export type DrawingAreaState = {
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
  /**
   * Checks if a point is inside the drawing area.
   * @param {Object} point The point to check.
   * @param {number} point.x The x coordinate of the point.
   * @param {number} point.y The y coordinate of the point.
   * @param {Object} options The options of the check.
   * @param {Element} [options.targetElement] The element to check if it is allowed to overflow the drawing area.
   * @param {'x' | 'y'} [options.direction] The direction to check.
   * @returns {boolean} `true` if the point is inside the drawing area, `false` otherwise.
   */
  isPointInside: (
    point: { x: number; y: number },
    options?: {
      targetElement?: Element;
      direction?: 'x' | 'y';
    },
  ) => boolean;
};
