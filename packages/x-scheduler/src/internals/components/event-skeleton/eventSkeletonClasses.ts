export interface EventSkeletonClasses {
  /** Styles applied to the event skeleton element. */
  eventSkeleton: string;
}

export type EventSkeletonClassKey = keyof EventSkeletonClasses;

// Shared so every product that hosts the `EventSkeleton` derives the same keys.
// A rename here breaks the build in every product instead of silently dropping a CSS class.
export const eventSkeletonClassKeys: EventSkeletonClassKey[] = ['eventSkeleton'];

export const eventSkeletonSlots: Record<EventSkeletonClassKey, [EventSkeletonClassKey]> = {
  eventSkeleton: ['eventSkeleton'],
};
