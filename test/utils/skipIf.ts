export const isJSDOM = /jsdom/.test(window.navigator.userAgent);
export const isOSX = /macintosh/i.test(window.navigator.userAgent);
export const hasTouchSupport =
  typeof window.Touch !== 'undefined' && typeof window.TouchEvent !== 'undefined';
