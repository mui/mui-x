import { localStorageAvailable } from '../utils/utils';

// A guide to feature toggling.
//
// The feature toggle is:
// - independent from the NODE_ENV
// - isn't pruning code in production, as the objective is to eventually ship the code.
// - doesn't allow to cherry-pick which feature to enable
//
// By default, the experimental features are only enabled in:
// - the local environment
// - the pull request previews
//
// Reviewers can force the value with the local storage and the EXPERIMENTAL_ENABLED key:
// - 'true' => force it to be enabled
// - 'false' => force it to be disabled
//
// Developers (users) can enable the experimental feature by setting the EXPERIMENTAL_ENABLED env.

let experimentalEnabled;

if (
  process.env.EXPERIMENTAL_ENABLED !== undefined &&
  localStorageAvailable() &&
  window.localStorage.getItem('EXPERIMENTAL_ENABLED')
) {
  experimentalEnabled = window.localStorage.getItem('EXPERIMENTAL_ENABLED') === 'true';
} else {
  experimentalEnabled = process.env.EXPERIMENTAL_ENABLED === 'true';
}

export const EXPERIMENTAL_ENABLED = experimentalEnabled as Boolean;
