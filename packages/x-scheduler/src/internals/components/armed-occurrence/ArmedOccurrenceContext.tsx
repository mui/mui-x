'use client';
import * as React from 'react';

/**
 * Tracks the "armed" occurrence: the one selected for touch editing, showing its resize handles and
 * selection outline. Event components read arming through this context (rather than from whatever
 * armed it), so the same touch event component works across surfaces.
 */
export interface ArmedOccurrenceContextValue {
  /**
   * The key of the currently armed occurrence, or `null` when nothing is armed.
   */
  armedKey: string | null;
}

const ArmedOccurrenceContext = React.createContext<ArmedOccurrenceContextValue | null>(null);

export function ArmedOccurrenceProvider(props: {
  armedKey: string | null;
  children: React.ReactNode;
}) {
  const { armedKey, children } = props;
  const value = React.useMemo<ArmedOccurrenceContextValue>(() => ({ armedKey }), [armedKey]);
  return (
    <ArmedOccurrenceContext.Provider value={value}>{children}</ArmedOccurrenceContext.Provider>
  );
}

/**
 * Reads the arming state for a single occurrence. Safe to call outside a provider (e.g. desktop
 * surfaces): `isArmed` is then always `false`.
 */
export function useArmedOccurrence(occurrenceKey: string) {
  const context = React.useContext(ArmedOccurrenceContext);
  return {
    isArmed: context != null && context.armedKey === occurrenceKey,
  };
}
