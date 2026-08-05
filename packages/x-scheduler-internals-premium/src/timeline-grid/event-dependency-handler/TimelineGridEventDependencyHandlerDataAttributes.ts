export enum TimelineGridEventDependencyHandlerDataAttributes {
  /**
   * Always present; its value is the occurrence key of the row appearance the
   * terminal is anchored on, so hover tracking can tie the terminal to its event.
   */
  dependencyHandle = 'data-dependency-handle',
  /**
   * Always present; the resource of the row appearance, qualifying the occurrence key
   * — an event assigned to several resources repeats the same key on each row.
   */
  resourceId = 'data-resource-id',
}
