export enum TimelineGridEventDataAttributes {
  /**
   * Present when the event start date is in the past.
   */
  started = 'data-started',
  /**
   * Present when the event end date is in the past.
   */
  ended = 'data-ended',
  /**
   * Present when the event is being dragged.
   */
  dragging = 'data-dragging',
  /**
   * Present when the event is being resized.
   */
  resizing = 'data-resizing',
  /**
   * Present when the event starts before the visible timeline range.
   */
  startingBeforeEdge = 'data-starting-before-edge',
  /**
   * Present when the event ends after the visible timeline range.
   */
  endingAfterEdge = 'data-ending-after-edge',
}
