export const MULTIPLE_SELECTION_KEYS = ['Meta', 'Control'];
export const isMultipleKey = (code: string): boolean => MULTIPLE_SELECTION_KEYS.indexOf(code) > -1;
export const isTabKey = (code: string): boolean => code === 'Tab';
export const isSpaceKey = (code: string): boolean => code === 'Space';
export const isArrowKeys = (code: string): boolean => code.indexOf('Arrow') === 0;
export const isHomeOrEndKeys = (code: string): boolean => code === 'Home' || code === 'End';
export const isPageKeys = (code: string): boolean => code.indexOf('Page') === 0;

export const isNavigationKey = (code: string) =>
  isHomeOrEndKeys(code) || isArrowKeys(code) || isPageKeys(code) || isSpaceKey(code);
