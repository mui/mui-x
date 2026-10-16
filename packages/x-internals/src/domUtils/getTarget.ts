/**
 * Returns the target element of an event, accounting for shadow DOM.
 * @param event The event object.
 * @returns The target element of the event.
 */
export function getTarget(event: Event) {
  if ('composedPath' in event) {
    return event.composedPath()[0] ?? event.target;
  }

  // Fallback for environments where `composedPath` is not available.
  // TS narrows `event` to `never` here because it assumes `composedPath` always exists.
  return (event as Event).target;
}
