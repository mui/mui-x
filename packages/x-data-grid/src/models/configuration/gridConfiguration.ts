import type * as React from 'react';
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

export interface GridColumnHeaderAdornmentInternalHook {
  /**
   * Returns an optional adornment rendered inside a column header's title
   * content, at the start, before the title label. Placing it inside the
   * (non-reversed) title content keeps it on the same side of the title for
   * both left- and right-aligned headers. Called once per rendered header
   * cell, so the implementation may use hooks.
   * @param {string} field The column field.
   * @returns {React.ReactNode} The adornment node, or `null` for none.
   */
  useColumnHeaderAdornment: (field: string) => React.ReactNode;
}

export interface GridInternalHook<Api, Props>
  extends
    GridAriaAttributesInternalHook,
    GridRowAriaAttributesInternalHook,
    GridCellEditableInternalHook<Api, Props>,
    GridAggregationInternalHooks<Api, Props>,
    GridColumnHeaderAdornmentInternalHook,
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
