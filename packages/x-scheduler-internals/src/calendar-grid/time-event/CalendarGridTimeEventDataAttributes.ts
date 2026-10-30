export enum CalendarGridTimeEventDataAttributes {
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
   * Present when the event renders as a link.
   */
  link = 'data-link',
}
