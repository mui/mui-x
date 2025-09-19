import * as React from 'react';
import type {
  GridRowAriaAttributesInternalHook,
  GridRowsOverridableMethodsInternalHook,
} from './gridRowConfiguration';
import type { GridAggregationInternalHooks } from './gridAggregationConfiguration';
import type { GridCSSVariablesInterface } from '../../constants/cssVariables';
import { DataGridProcessedProps } from '../props/DataGridProps';
import type { GridPrivateApiCommon } from '../api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../api/gridApiCommunity';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook<Api, Props>
  extends GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook,
    GridAggregationInternalHooks<Api, Props>,
    GridRowsOverridableMethodsInternalHook<Api> {
  useCSSVariables: () => { id: string; variables: GridCSSVariablesInterface };
}

export interface GridConfiguration<
  Api extends GridPrivateApiCommon = GridPrivateApiCommunity,
  Props = DataGridProcessedProps,
> {
  hooks: GridInternalHook<Api, Props>;
}
