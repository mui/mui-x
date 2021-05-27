/**
 * The events API interface that is available in the grid `apiRef`.
 */
export interface GridEventsApi {
  /**
   * Triggers a resize of the component and recalculation of width and height.
   */
  resize: () => void;
}
