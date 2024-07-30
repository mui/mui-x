import * as React from 'react';

/** Gathers props for the root element into a single `.forwardedProps` field */
function groupForwardedProps<
  T extends {
    forwardedProps?: Record<string, any>;
    [key: string]: any;
  },
>(props: T): T {
  const keys = Object.keys(props);

  if (!keys.some((key) => key.startsWith('aria-') || key.startsWith('data-'))) {
    return props;
  }

  const newProps = {} as Record<string, unknown>;
  const forwardedProps: Record<string, unknown> = props.forwardedProps ?? {};

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.startsWith('aria-') || key.startsWith('data-')) {
      forwardedProps[key] = props[key];
    } else {
      newProps[key] = props[key];
    }
  }

  newProps.forwardedProps = forwardedProps;

  return newProps as T;
}

export function useProps<T extends Record<string, any>>(allProps: T) {
  return React.useMemo(() => groupForwardedProps(allProps), [allProps]);
}
