import * as React from 'react';
import {
  GridRowAriaAttributesInternalHook,
  GridRowsOverridableMethodsInternalHook,
} from './gridRowConfiguration';
import type { GridCSSVariablesInterface } from '../../constants/cssVariables';
import type { GridRowId } from '../gridRows';
import type { GridPrivateApiCommon } from '../api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../api/gridApiCommunity';
import type { DataGridProcessedProps } from '../props/DataGridProps';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook<Api, Props>
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook,
    GridRowsOverridableMethodsInternalHook<Api, Props> {
  useCSSVariables: () => { id: string; variables: GridCSSVariablesInterface };
  useCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => { position: 'footer' | 'inline'; value: any } | null;
}

export interface GridConfiguration<
  Api extends GridPrivateApiCommon = GridPrivateApiCommunity,
  Props = DataGridProcessedProps,
> {
  hooks: GridInternalHook<Api, Props>;
}
