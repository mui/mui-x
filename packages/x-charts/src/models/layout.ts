export interface CardinalDirections<T> {
  top?: T;
  bottom?: T;
  left?: T;
  right?: T;
}

export type LayoutConfig = {
  width: number;
  height: number;
  margin?: Partial<CardinalDirections<number>>;
};
