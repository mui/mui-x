export const GRID_MULTIPLE_SELECTION_KEYS = ['Meta', 'Control', 'Shift'];
export const isMultipleKey = (key: string): boolean =>
  GRID_MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;

export const GRID_ENTER_EDIT_CELL_KEYS = ['Enter', 'Delete', 'Backspace'];
export const isEnterEditCellKeys = (key: string): boolean =>
  GRID_ENTER_EDIT_CELL_KEYS.indexOf(key) > -1;

export const GRID_EXIT_EDIT_CELL_KEYS = ['Enter', 'Escape', 'Tab'];
export const isExitEditCellKeys = (key: string): boolean =>
  GRID_EXIT_EDIT_CELL_KEYS.indexOf(key) > -1;

export const isTabKey = (key: string): boolean => key === 'Tab';

export const isSpaceKey = (key: string): boolean => key === ' ';

export const isArrowKeys = (key: string): boolean => key.indexOf('Arrow') === 0;

export const isHomeOrEndKeys = (key: string): boolean => key === 'Home' || key === 'End';

export const isPageKeys = (key: string): boolean => key.indexOf('Page') === 0;

export const isNavigationKey = (key: string) =>
  isHomeOrEndKeys(key) || isArrowKeys(key) || isPageKeys(key) || isSpaceKey(key);

export const isDeleteKeys = (key: string) => key === 'Delete' || key === 'Backspace';

export const isKeyboardEvent = (event: any): event is React.KeyboardEvent => !!event.key;
