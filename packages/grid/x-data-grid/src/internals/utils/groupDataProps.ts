/**
 * Gathers data attributes props into a single `.dataProps` field
 */
export function groupDataProps<T extends {
  dataProps?: Record<string, any>,
  [key: string]: any,
}>(
  props: T
): T {
  const keys = Object.keys(props);

  if (!keys.some(key => key.startsWith('data-'))) {
    return props;
  }

  const newProps = {} as Record<string, unknown>;
  const dataProps: Record<string, unknown> = props.dataProps ?? {};

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.startsWith('data-')) {
      dataProps[key] = props[key]
    } else {
      newProps[key] = props[key]
    }
  }

  newProps.dataProps = dataProps;

  return newProps as T;
}
