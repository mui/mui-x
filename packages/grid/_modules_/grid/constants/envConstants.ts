import { localStorageAvailable } from '../utils/utils';

const forceEnabled = localStorageAvailable()
  ? Boolean(window.localStorage.getItem('EXPERIMENTAL_ENABLED'))
  : null;

let experimentalEnabled;

if (forceEnabled !== null) {
  experimentalEnabled = forceEnabled;
} else {
  experimentalEnabled = process.env.EXPERIMENTAL_ENABLED === 'true';
}

export const EXPERIMENTAL_ENABLED = experimentalEnabled as Boolean;
