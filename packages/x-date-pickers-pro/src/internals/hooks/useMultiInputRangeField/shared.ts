/* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
export const excludeClearableProps = <TProps extends {}>(
  props: TProps,
  excludedProps: string[],
): TProps =>
  Object.keys(props).reduce((prev, key) => {
    if (!excludedProps.includes(key)) {
      return {
        ...prev,
        [key as keyof TProps]: props[key as keyof TProps],
      };
    }
    return prev;
  }, {}) as TProps;
