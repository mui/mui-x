import { ChartPluginSignature } from '../../models';

export interface ChartMargin {
  /**
   * The gap between the left border of the SVG and the axis area or the drawing area.
   */
  left: number;
  /**
   * The gap between the top border of the SVG and the axis area or the drawing area.
   */
  top: number;
  /**
   * The gap between the bottom border of the SVG and the axis area or the drawing area.
   */
  bottom: number;
  /**
   * The gap between the right border of the SVG and the axis area or the drawing area.
   */
  right: number;
}

export interface ChartAxisSize {
  /**
   * The gap between the left margin of the SVG and the drawing area.
   */
  left: number;
  /**
   * The gap between the top margin of the SVG and the drawing area.
   */
  top: number;
  /**
   * The gap between the bottom margin of the SVG and the drawing area.
   */
  bottom: number;
  /**
   * The gap between the right margin of the SVG and the drawing area.
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
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  margin?: Partial<ChartMargin> | number;
  /**
   * The size of the axis.
   * It's used for leaving some space for the axis labels.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   */
  axisSize?: Partial<ChartAxisSize> | number;
}

export type UseChartDimensionsDefaultizedParameters = Required<
  Omit<UseChartDimensionsParameters, 'margin' | 'axisSize'> & {
    margin: ChartMargin;
    axisSize: ChartAxisSize;
  }
>;

export interface UseChartDimensionsState {
  dimensions: {
    /**
     * Indicates which axis are enabled to reserve space for them.
     */
    enabledAxis: {
      /**
       * Indicates if the left axis is enabled.
       */
      left: boolean;
      /**
       * Indicates if the top axis is enabled.
       */
      top: boolean;
      /**
       * Indicates if the bottom axis is enabled.
       */
      bottom: boolean;
      /**
       * Indicates if the right axis is enabled.
       */
      right: boolean;
    };
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
     * The SVG width in px provided by props.
     */
    propsWidth: number | undefined;
    /**
     * The SVG height in px provided by props.
     */
    propsHeight: number | undefined;
  };
}

export interface UseChartDimensionsInstance {
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
  /**
   * Adds the axis size to the margin.
   * @param {keyof ChartMargin} side The side to add the axis size to.
   */
  addAxisSide: (side: keyof ChartMargin) => void;
  /**
   * Removes the axis size from the margin.
   * @param {keyof ChartMargin} side The side to remove the axis size from.
   */
  removeAxisSide: (side: keyof ChartMargin) => void;
}

export type UseChartDimensionsSignature = ChartPluginSignature<{
  params: UseChartDimensionsParameters;
  defaultizedParams: UseChartDimensionsDefaultizedParameters;
  state: UseChartDimensionsState;
  instance: UseChartDimensionsInstance;
}>;
