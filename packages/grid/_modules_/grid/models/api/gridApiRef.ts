import * as React from 'react';
import { GridApiCommon, GridApiCommunity, GridApiPro } from './gridApi';

/**
 * The apiRef component prop type.
 * TODO v6: Make the `GridApi` generic mandatory. This interface should only be used when accessing dynamically api methods or state based on the plan.
 */
export type GridApiRef<GridApi extends GridApiCommon = GridApiCommunity> =
  React.MutableRefObject<GridApi>;

export type GridApiRefCommunity = React.MutableRefObject<GridApiCommunity>;

export type GridApiRefPro = React.MutableRefObject<GridApiPro>;
