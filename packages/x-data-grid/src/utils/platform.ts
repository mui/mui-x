const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : 'empty';

export const isFirefox = userAgent.includes('firefox');
