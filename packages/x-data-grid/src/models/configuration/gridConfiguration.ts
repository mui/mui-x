import * as React from 'react';
import { GridRowAriaAttributesInternalHook } from './gridRowConfiguration';
import type { GridCSSVariablesInterface } from '../../constants/cssVariables';
import type { GridRowId } from '../gridRows';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook {
  useCSSVariables: () => { id: string; variables: GridCSSVariablesInterface };
  useCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => { position: 'footer' | 'inline'; value: any } | null;
}

export interface GridConfiguration {
  hooks: GridInternalHook;
}
