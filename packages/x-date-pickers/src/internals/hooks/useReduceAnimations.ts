import useMediaQuery from '@mui/material/useMediaQuery';

const PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

// detect if user agent has Android version < 10 or iOS version < 13
const mobileVersionMatches =
  typeof navigator !== 'undefined' && navigator.userAgent.match(/android\s(\d+)|OS\s(\d+)/i);
const androidVersion =
  mobileVersionMatches && mobileVersionMatches[1] ? parseInt(mobileVersionMatches[1], 10) : null;
const iOSVersion =
  mobileVersionMatches && mobileVersionMatches[2] ? parseInt(mobileVersionMatches[2], 10) : null;
export const slowAnimationDevices =
  (androidVersion && androidVersion < 10) || (iOSVersion && iOSVersion < 13) || false;

export function useReduceAnimations(customReduceAnimations: boolean | undefined) {
  const prefersReduced = useMediaQuery(PREFERS_REDUCED_MOTION, { defaultMatches: false });

  if (customReduceAnimations != null) {
    return customReduceAnimations;
  }

  return prefersReduced || slowAnimationDevices;
}
