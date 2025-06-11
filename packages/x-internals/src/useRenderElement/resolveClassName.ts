/* Adapted from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/resolveClassName.ts */
/**
 * If the provided className is a string, it will be returned as is.
 * Otherwise, the function will call the className function with the state as the first argument.
 *
 * @param className
 * @param state
 */
export function resolveClassName<State>(
  className: string | ((state: State) => string) | undefined,
  state: State,
) {
  return typeof className === 'function' ? className(state) : className;
}
