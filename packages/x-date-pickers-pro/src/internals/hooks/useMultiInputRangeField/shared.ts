/* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
export const excludeProps = <TProps extends {}>(props: TProps, excludedProps: string[]): TProps => {
  const filteredProps = Object.entries(props).filter(([key]) => !excludedProps.includes(key));
  return Object.fromEntries(filteredProps) as TProps;
};
