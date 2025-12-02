/**
 * Pointers are used to simulate touch events in tests.
 */
export type Pointer = {
  /**
   * The id of the pointer.
   *
   * If not provided, the id will be generated automatically. Starting from 500.
   *
   * If provided, the id must be unique and in the range of 1-1000.
   * A mouse pointer will always have an id of 1.
   */
  id?: number;
  /**
   * The x coordinate of the pointer.
   *
   * @default target.x
   */
  x?: number;
  /**
   * The y coordinate of the pointer.
   *
   * @default target.y
   */
  y?: number;
  /**
   * The target of the pointer.
   *
   * If not provided in the pointer definition, the target will be taken from the gesture options.
   */
  target?: Element;
};

/**
 * A mouse pointer is a pointer with an id of 1.
 *
 * It is used to simulate mouse events in tests.
 */
export type MousePointer = Omit<Pointer, 'id'>;

export type PointerAmount = {
  /**
   * The number of pointers to be used.
   */
  amount?: number;
  /**
   * The distance between the pointers.
   */
  distance?: number;
  /**
   * Ids to be used for the pointers.
   *
   * If not provided, the ids will be generated automatically. Starting from 500.
   *
   * If provided, the ids must be unique and bigger than 1.
   * A mouse pointer will always have an id of 1.
   */
  ids?: number[];
};

/**
 * The type of pointers to be used.
 *
 * It can be an object with the amount and distance properties, or an array of pointers.
 */
export type Pointers = PointerAmount | Pointer[];

/**
 * The type of pointers.
 */
export type PointerType = 'mouse' | 'touch';
