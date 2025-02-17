import * as React from 'react';
import { GridRowAriaAttributesInternalHook } from './gridRowConfiguration';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook {
  useCSSVariables: () => { id: string; variables: Record<string, string | number> };
}

export interface GridConfiguration {
  hooks: GridInternalHook;
}
