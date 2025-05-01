/**
 * Compose CSS styles with the `classes` prop
 *
 * @example
 * ```tsx
 * const styles = css('MuiDataGrid-panel', {
 *  root: {
 *    color: 'black',
 *  },
 *  focused: {
 *    color: 'blue',
 *  },
 * });
 *
 * const classes = {
 *   'panel--focused': 'text-red-100',
 * };
 *
 * const output = composeStyles(styles, classes, 'MuiDataGrid');
 * // {
 * //   root: 'MuiDataGrid-panel',
 * //   focused: 'MuiDataGrid-panel--focused text-red-100',
 * // }
 * ```
 */
export function composeStyles<T extends Record<string, string>>(
  componentName: string,
  styles: T,
  classes: Record<string, string> | undefined = undefined,
): T {
  if (!classes) {
    return styles;
  }

  const output = {} as any;

  for (const name in styles) {
    if (Object.hasOwn(styles, name)) {
      const className = styles[name];
      const classesProp = className.slice(componentName.length + 1);

      let buffer = className as string;

      const classesValue = classes[classesProp];
      if (classesValue) {
        buffer += ' ' + classesValue; // eslint-disable-line prefer-template
      }

      output[name] = buffer;
    }
  }

  return output;
}
