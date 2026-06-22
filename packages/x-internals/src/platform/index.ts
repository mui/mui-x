const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';

export const isFirefox = userAgent.includes('firefox');

// iOS/iPadOS WebKit browsers
// Check support status at: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html
export const iOSMediaQuery = '@supports (-webkit-touch-callout: none)';

export const isJSDOM =
  typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);

export default {
  isFirefox,
  isJSDOM,
};
