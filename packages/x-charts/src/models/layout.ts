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
   * It's used for leving space for extra information wuch as axes, or legend.
   * Accept and object with some of the next properties: `top`, `bottom`, `left`, and `right`.
   * @default object depends on the charts type.
   */
  margin?: Partial<CardinalDirections<number>>;
};
