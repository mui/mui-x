import * as React from 'react';
import { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';
import { GridSlotsComponent } from '../../models';

interface WithComponents {
  components?: Partial<GridSlotsComponent>;
  componentsProps?: GridSlotsComponentsProps;
}

export function useProps<T extends WithComponents>(allProps: T) {
  return React.useMemo(() => {
    const { components, componentsProps, ...themedProps } = allProps;
    return [components, componentsProps, themedProps] as const;
  }, [allProps]);
}
