import { lowerPlatform, maxTouchPoints } from './shared';

const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';

export const isFirefox = userAgent.includes('firefox');

// iPadOS 13+ reports `MacIntel` for `navigator.platform`; disambiguated via
// `maxTouchPoints` so iPad is classified as iOS, not macOS.
// https://github.com/mui/base-ui/issues/1309
/** iPhone, iPad (including iPadOS 13+ reporting as macOS), iPod. */
export const isIOS =
  /^i(os$|p)/.test(lowerPlatform) || (lowerPlatform === 'macintel' && maxTouchPoints > 1);

export const isJSDOM =
  typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);

export default {
  isFirefox,
  isIOS,
  isJSDOM,
};
