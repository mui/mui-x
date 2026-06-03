'use client';
import * as React from 'react';

export interface ErrorContainerClasses {
  /** Styles applied to the error container element. */
  errorContainer: string;
  /** Styles applied to the error alert element. */
  errorAlert: string;
  /** Styles applied to the error message element. */
  errorMessage: string;
}

export interface EventSkeletonClasses {
  /** Styles applied to the event skeleton element. */
  eventSkeleton: string;
}

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
        'Ensure the component is rendered inside an EventCalendar or EventTimelinePremium component.',
    );
  }
  return value;
}
