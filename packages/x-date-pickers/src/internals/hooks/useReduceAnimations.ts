import useMediaQuery from '@mui/material/useMediaQuery';

const PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

// TODO v10: Remove user-agent sniffing. The Android branch is dead and the iOS branch is becoming
// irrelevant.
// https://github.com/mui/mui-x/pull/22710#discussion_r3377072061

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
