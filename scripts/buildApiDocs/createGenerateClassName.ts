import generateUtilityClass from '@mui/utils/generateUtilityClass';

/**
 * Creates a `generateClassName` for the API docs builder that remaps the prefix of
 * components reusing another component's classes.
 *
 * Some components render a part of another component and reuse its classes (generated
 * with `generateUtilityClass('MuiOwner', ...)`) instead of declaring their own
 * `{ComponentName}Classes` interface. For those, the builder would derive the documented
 * class name from the component's own `muiName`, producing a class that does not exist at
 * runtime (e.g. `MuiAreaElement-area` instead of the real `MuiLineChart-area`).
 *
 * @param sharedClassNameOwners Map from a component `muiName` to the `muiName` of the
 * component that owns the classes it reuses.
 */
export default function createGenerateClassName(
  sharedClassNameOwners: Record<string, string>,
): typeof generateUtilityClass {
  return (componentName, slot, globalStatePrefix) =>
    generateUtilityClass(
      sharedClassNameOwners[componentName] ?? componentName,
      slot,
      globalStatePrefix,
    );
}
