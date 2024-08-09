import * as React from 'react';
import { GridRowAriaAttributesInternalHook } from './gridRowConfiguration';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook {}

export interface GridConfiguration {
  hooks: GridInternalHook;
}
