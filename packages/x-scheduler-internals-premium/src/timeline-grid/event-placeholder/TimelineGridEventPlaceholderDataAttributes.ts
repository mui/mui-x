export enum TimelineGridEventPlaceholderDataAttributes {
  /**
   * Present when the event start date is in the past.
   */
  started = 'data-started',
  /**
   * Present when the event end date is in the past.
   */
  ended = 'data-ended',
  /**
   * Present when the placeholder's start does not render at its real position: it is
   * before the visible timeline range, or inside the hours the preset config hides.
   */
  startingBeforeEdge = 'data-starting-before-edge',
  /**
   * Present when the placeholder's end does not render at its real position: it is after
   * the visible timeline range, or inside the hours the preset config hides.
   */
  endingAfterEdge = 'data-ending-after-edge',
}
