/* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
export const excludeProps = <TProps extends {}>(
  props: TProps,
  excludedProps: Array<keyof TProps>,
): TProps => {
  return (Object.keys(props) as Array<keyof TProps>).reduce((acc, key) => {
    if (!excludedProps.includes(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as TProps);
};
