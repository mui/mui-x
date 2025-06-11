/* Adapted from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/getStyleHookProps.ts */
export type CustomStyleHookMapping<State> = {
  [Property in keyof State]?: (state: State[Property]) => Record<string, string> | null;
};

export function getStyleHookProps<State extends Record<string, any>>(
  state: State,
  customMapping?: CustomStyleHookMapping<State>,
) {
  const props: Record<string, string> = {};

  /* eslint-disable-next-line guard-for-in */
  for (const key in state) {
    const value = state[key];

    if (customMapping?.hasOwnProperty(key)) {
      const customProps = customMapping[key]!(value);
      if (customProps != null) {
        Object.assign(props, customProps);
      }

      continue;
    }

    if (value === true) {
      props[`data-${key.toLowerCase()}`] = '';
    } else if (value) {
      props[`data-${key.toLowerCase()}`] = value.toString();
    }
  }

  return props;
}
