import { type ChartPluginSignature } from '../../models';
import type { UseChartCartesianAxisSignature } from '../../featurePlugins/useChartCartesianAxis';

export interface ChartMargin {
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
}

export interface UseChartDimensionsParameters {
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height?: number;
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   *
   * Accepts a `number` to be used on all sides or an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin?: Partial<ChartMargin> | number;
}

export type UseChartDimensionsDefaultizedParameters = UseChartDimensionsParameters & {
  margin: ChartMargin;
};

export interface UseChartDimensionsState {
  dimensions: {
    /**
     * The drawing area's margin.
     */
    margin: ChartMargin;
    /**
     * The width of the drawing area.
     */
    width: number;
    /**
     * The height of the drawing area.
     */
    height: number;
    /**
     * The SVG width in px provided by props.
     */
    propsWidth: number | undefined;
    /**
     * The SVG height in px provided by props.
     */
    propsHeight: number | undefined;
    /**
     * Whether the chart has been hydrated (client-side rendering is complete).
     * Used to trigger recomputation of auto-sized axes.
     */
    isHydrated: boolean;
  };
}

export interface UseChartDimensionsInstance {
  /**
   * Checks if a point is inside the drawing area.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @param {Element | EventTarget | null} targetElement The element to check if it is allowed to overflow the drawing area.
   * @returns {boolean} `true` if the point is inside the drawing area, `false` otherwise.
   */
  isPointInside: (x: number, y: number, targetElement?: Element | EventTarget | null) => boolean;
  /**
   * Checks if the x coordinate is inside the drawing area.
   * @param {number} x The x coordinate of the point.
   * @returns {boolean} `true` if the point is inside the drawing area, `false` otherwise.
   */
  isXInside: (x: number) => boolean;
  /**
   * Checks if the y coordinate is inside the drawing area.
   * @param {number} y The y coordinate of the point.
   * @returns {boolean} `true` if the point is inside the drawing area, `false` otherwise.
   */
  isYInside: (y: number) => boolean;
}

export type UseChartDimensionsSignature = ChartPluginSignature<{
  params: UseChartDimensionsParameters;
  defaultizedParams: UseChartDimensionsDefaultizedParameters;
  state: UseChartDimensionsState;
  instance: UseChartDimensionsInstance;
  optionalDependencies: [UseChartCartesianAxisSignature];
}>;
