import * as React from 'react';

const PREFERS_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// detect if user agent has Android version < 10 or iOS version < 13
const mobileVersionMatches =
  typeof navigator !== 'undefined' && navigator.userAgent.match(/android\s(\d+)|OS\s(\d+)/i);
const androidVersion =
  mobileVersionMatches && mobileVersionMatches[1] ? parseInt(mobileVersionMatches[1], 10) : null;
const iOSVersion =
  mobileVersionMatches && mobileVersionMatches[2] ? parseInt(mobileVersionMatches[2], 10) : null;
export const slowAnimationDevices =
  (androidVersion && androidVersion < 10) || (iOSVersion && iOSVersion < 13) || false;

// Module-level stable references so useSyncExternalStore doesn't re-subscribe on every render.
const noopSubscribe = () => () => {};

function subscribeToReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const mql = window.matchMedia(PREFERS_REDUCED_MOTION);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia(PREFERS_REDUCED_MOTION).matches;
}

export function useReduceAnimations(customReduceAnimations: boolean | undefined): boolean {
  // When the prop is explicitly provided, skip subscribing to the media query.
  // noopSubscribe tells useSyncExternalStore to create no matchMedia listener,
  // avoiding per-instance listener churn for every DateCalendar and
  // DateRangeCalendar that has reduceAnimations set via theme or prop.
  const subscribe =
    customReduceAnimations != null ? noopSubscribe : subscribeToReducedMotion;
  const prefersReduced = React.useSyncExternalStore(
    subscribe,
    getReducedMotionSnapshot,
    () => false,
  );

  return customReduceAnimations ?? (prefersReduced || slowAnimationDevices);
}
