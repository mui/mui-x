const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';

export const isFirefox = userAgent.includes('firefox');

export const isJSDOM =
  typeof window !== 'undefined' && /jsdom|HappyDOM/.test(window.navigator.userAgent);

export default {
  isFirefox,
  isJSDOM,
};
