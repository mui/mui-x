export type MuiCancellableEvent = {
  defaultMuiPrevented?: boolean;
};

export type MuiCancellableEventHandler<Event> = (event: Event & MuiCancellableEvent) => void;

/**
 * Checks if the event handler should skip any custom logic implemented by the MUI X packages.
 * This should happen if the app has set `event.defaultMuiPrevented = true`.
 * @param {MuiCancellableEvent} event The event to check.
 * @returns {boolean} Whether the event handler should be skipped.
 */
export const shouldSkipEventHandler = (event: MuiCancellableEvent): boolean => {
  return event.defaultMuiPrevented === true;
};
