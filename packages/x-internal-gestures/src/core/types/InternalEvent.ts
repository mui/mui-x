/**
 * Used to create an internal event to trigger force reset on the pointer manager.
 */
export type InternalEvent = PointerEvent & {
  forceReset: boolean;
};
