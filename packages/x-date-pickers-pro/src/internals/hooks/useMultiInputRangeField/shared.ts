/* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
export const excludeProps = <TProps extends {}>(props: TProps, excludedProps: string[]): TProps => {
  return Object.keys(props).reduce((acc, key) => {
    if (!excludedProps.includes(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as TProps);
};
