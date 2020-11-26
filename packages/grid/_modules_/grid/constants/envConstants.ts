import { localStorageAvailable } from '../utils/utils';

let experimentalEnabled;

if (localStorageAvailable() && window.localStorage.getItem('EXPERIMENTAL_ENABLED')) {
  experimentalEnabled = window.localStorage.getItem('EXPERIMENTAL_ENABLED') === 'true';
} else {
  experimentalEnabled = process.env.EXPERIMENTAL_ENABLED === 'true';
}

export const EXPERIMENTAL_ENABLED = experimentalEnabled as Boolean;
