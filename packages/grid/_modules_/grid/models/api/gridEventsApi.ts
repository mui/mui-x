/**
 * The events API interface that is available in the grid [[apiRef]].
 */
export interface GridEventsApi {
  /**
   * Trigger a resize of the component, and recalculation of width and height.
   * @param handler
   */
  resize: () => void;
}
