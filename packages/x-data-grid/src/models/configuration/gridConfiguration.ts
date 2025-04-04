import * as React from 'react';
import { GridRowAriaAttributesInternalHook } from './gridRowConfiguration';
import type { GridCSSVariablesInterface } from '../../constants/cssVariables';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook {
  useCSSVariables: () => { id: string; variables: GridCSSVariablesInterface };
}

export interface GridConfiguration {
  hooks: GridInternalHook;
}
