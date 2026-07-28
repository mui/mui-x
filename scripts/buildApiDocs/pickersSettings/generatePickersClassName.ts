import createGenerateClassName from '../createGenerateClassName';

/**
 * Pickers components that reuse another component's classes instead of declaring their
 * own `{ComponentName}Classes` interface, mapped to the `muiName` that owns those classes.
 */
export const sharedClassNameOwners: Record<string, string> = {
  // `PickersShortcuts` extends `ListProps`, so it reuses the `@mui/material` List classes
  // (`MuiList-dense`, `MuiList-padding`, `MuiList-root`).
  MuiPickersShortcuts: 'MuiList',
};

const generatePickersClassName = createGenerateClassName(sharedClassNameOwners);

export default generatePickersClassName;
