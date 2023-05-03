/**
 * Gathers data attributes props into a single `.dataProps` field
 */
export function groupDataProps<T extends {
  dataProps?: Record<string, any>,
  [key: string]: any,
}>(
  props: T
): T {
  const newProps = {} as Partial<T>;
  let dataProps: Record<string, any> | undefined = props.dataProps ?? undefined;

  for (let key in props) {
    if (key.startsWith('data-')) {
      dataProps ??= {}
      dataProps[key] = props[key]
    } else {
      newProps[key] = props[key]
    }
  }

  newProps.dataProps = dataProps;

  return newProps as T;
}
