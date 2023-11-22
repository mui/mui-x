export interface CardinalDirections<T> {
  top?: T;
  bottom?: T;
  left?: T;
  right?: T;
}

export type LayoutConfig = {
  width: number;
  height: number;
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin?: Partial<CardinalDirections<number>>;
};
