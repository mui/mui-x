'use client';
import * as React from 'react';

/**
 * Surface-agnostic "armed occurrence" concept.
 *
 * An armed occurrence is the one the user has selected for touch editing — it reveals its resize
 * handles and selection outline. This is deliberately decoupled from *how* it got armed (today the
 * compact event drawer): event components across every surface (time grid, and later day grid /
 * month) read arming through this context instead of reaching into a specific modal, so the same
 * touch event component can be reused as new surfaces gain a touch experience.
 */
export interface ArmedOccurrenceContextValue {
  /**
   * The key of the currently armed occurrence, or `null` when nothing is armed.
   */
  armedKey: string | null;
  /**
   * Disarms the currently armed occurrence (if any).
   */
  disarm: () => void;
}

const ArmedOccurrenceContext = React.createContext<ArmedOccurrenceContextValue | null>(null);

export function ArmedOccurrenceProvider(props: {
  armedKey: string | null;
  onDisarm: () => void;
  children: React.ReactNode;
}) {
  const { armedKey, onDisarm, children } = props;
  const value = React.useMemo<ArmedOccurrenceContextValue>(
    () => ({ armedKey, disarm: onDisarm }),
    [armedKey, onDisarm],
  );
  return <ArmedOccurrenceContext.Provider value={value}>{children}</ArmedOccurrenceContext.Provider>;
}

const noop = () => {};

/**
 * Reads the arming state for a single occurrence. Safe to call outside a provider (e.g. desktop
 * surfaces): `isArmed` is then always `false`.
 */
export function useArmedOccurrence(occurrenceKey: string) {
  const context = React.useContext(ArmedOccurrenceContext);
  return {
    isArmed: context != null && context.armedKey === occurrenceKey,
    disarm: context?.disarm ?? noop,
  };
}
