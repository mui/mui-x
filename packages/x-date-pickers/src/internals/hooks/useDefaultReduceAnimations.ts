import useMediaQuery from '@mui/material/useMediaQuery';

const PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

export const defaultReduceAnimations =
  typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent);

export const useDefaultReduceAnimations = () => {
  const prefersReduced = useMediaQuery(PREFERS_REDUCED_MOTION, { defaultMatches: false });
  return prefersReduced || defaultReduceAnimations;
};
