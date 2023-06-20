import * as React from 'react';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';
import { GridSlotsComponent } from '../../models';

interface WithComponents {
  components?: Partial<GridSlotsComponent>;
  componentsProps?: GridSlotsComponentsProps;
}

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

export function useProps<T extends WithComponents>(allProps: T) {
  return React.useMemo(() => {
    const { components, componentsProps, ...themedProps } = allProps;
    return [components, componentsProps, groupForwardedProps(themedProps)] as const;
  }, [allProps]);
}
