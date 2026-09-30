import { platform } from '@base-ui/utils/platform';

export const isJSDOM = platform.env.jsdom;
export const isOSX = platform.os.mac;
export const hasTouchSupport =
  typeof window.Touch !== 'undefined' && typeof window.TouchEvent !== 'undefined';
