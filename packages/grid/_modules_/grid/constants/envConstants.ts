import { localStorageAvailable } from '../utils/utils';

const force =
  localStorageAvailable() && window.localStorage.getItem('EXPERIMENTAL_ENABLED') != null;

export const EXPERIMENTAL_ENABLED =
  process.env.EXPERIMENTAL_ENABLED !== undefined &&
  (process.env.EXPERIMENTAL_ENABLED === 'true' || force);
