import * as React from 'react';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';
import { GridSlotsComponent } from '../../models';

interface WithComponents {
  components?: Partial<GridSlotsComponent>;
  componentsProps?: GridSlotsComponentsProps;
}

/** Gathers data attributes props into a single `.dataProps` field */
function groupDataProps<
  T extends {
    dataProps?: Record<string, any>;
    [key: string]: any;
  },
>(props: T): T {
  const keys = Object.keys(props);

  if (
    !keys.some((key) => key.startsWith('aria-')) &&
    !keys.some((key) => key.startsWith('data-'))
  ) {
    return props;
  }

  const newProps = {} as Record<string, unknown>;
  const dataProps: Record<string, unknown> = props.dataProps ?? {};

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.startsWith('aria-') || key.startsWith('data-')) {
      dataProps[key] = props[key];
    } else {
      newProps[key] = props[key];
    }
  }

  newProps.dataProps = dataProps;

  return newProps as T;
}

export function useProps<T extends WithComponents>(allProps: T) {
  return React.useMemo(() => {
    const { components, componentsProps, ...themedProps } = allProps;
    return [components, componentsProps, groupDataProps(themedProps)] as const;
  }, [allProps]);
}
