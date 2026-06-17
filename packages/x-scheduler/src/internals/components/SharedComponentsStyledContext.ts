'use client';
import * as React from 'react';
import { ErrorContainerClasses } from './error-container/errorContainerClasses';
import { EventSkeletonClasses } from './event-skeleton/eventSkeletonClasses';

/**
 * Styling injected by the consuming product into the shared internal components
 * (e.g. `ErrorContainer`, `EventSkeleton`) so they stay decoupled from any
 * product-specific styled context.
 */
export interface SharedComponentsStyledContextValue {
  classes: ErrorContainerClasses & EventSkeletonClasses;
}

export const SharedComponentsStyledContext =
  React.createContext<SharedComponentsStyledContextValue | null>(null);

export function useSharedComponentsStyledContext(): SharedComponentsStyledContextValue {
  const value = React.useContext(SharedComponentsStyledContext);
  if (!value) {
    throw new Error(
      'MUI X Scheduler: useSharedComponentsStyledContext must be used within a SharedComponentsStyledContext.Provider. ' +
        'The shared internal components require the product to inject their utility classes. ' +
        'Ensure the component is rendered inside an EventCalendar, EventCalendarPremium, or EventTimelinePremium component, ' +
        'a standalone view, or another component that provides SharedComponentsStyledContext.',
    );
  }
  return value;
}
