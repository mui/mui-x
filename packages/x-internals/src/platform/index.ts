const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';

export const isFirefox = userAgent.includes('firefox');

export const iOSMediaQuery = '@supports (-webkit-touch-callout: none)'; // Only available on iOS Safari

export const isJSDOM =
  typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);

export default {
  isFirefox,
  isJSDOM,
};
