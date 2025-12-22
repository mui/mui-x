import * as React from 'react';
import type {
  GridRowAriaAttributesInternalHook,
  GridRowsOverridableMethodsInternalHook,
} from './gridRowConfiguration';
import type { GridAggregationInternalHooks } from './gridAggregationConfiguration';
import type { GridCellEditableInternalHook } from './gridCellEditableConfiguration';
import type { GridCSSVariablesInterface } from '../../constants/cssVariables';
import type { GridPrivateApiCommon } from '../api/gridApiCommon';
import type { GridPrivateApiCommunity } from '../api/gridApiCommunity';
import type { DataGridProcessedProps } from '../props/DataGridProps';
import type { GridParamsOverridableMethodsInternalHook } from './gridParamsConfiguration';

export interface GridAriaAttributesInternalHook {
  useGridAriaAttributes: () => React.HTMLAttributes<HTMLElement>;
}

export interface GridInternalHook<Api, Props>
  extends
    GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook,
    GridCellEditableInternalHook<Api, Props>,
    GridAggregationInternalHooks<Api, Props>,
    GridRowsOverridableMethodsInternalHook<Api, Props>,
    GridParamsOverridableMethodsInternalHook<Api> {
  useCSSVariables: () => { id: string; variables: GridCSSVariablesInterface };
}

export interface GridConfiguration<
  Api extends GridPrivateApiCommon = GridPrivateApiCommunity,
  Props = DataGridProcessedProps,
> {
  hooks: GridInternalHook<Api, Props>;
}
