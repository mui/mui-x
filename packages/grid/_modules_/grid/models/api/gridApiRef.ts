import * as React from 'react';
import { GridApiCommon, GridApiCommunity, GridApiPro } from './gridApi';

/**
 * The reference storing the api of the grid.
 * TODO v6: Make the `GridApi` generic mandatory. This interface should only be used when accessing dynamically api methods or state based on the plan.
 */
export type GridApiRef<GridApi extends GridApiCommon = GridApiCommunity> =
  React.MutableRefObject<GridApi>;

/**
 * The reference storing the api of the Community-plan grid.
 */
export type GridApiRefCommunity = React.MutableRefObject<GridApiCommunity>;

/**
 * The reference storing the api of the Pro-plan grid.
 */
export type GridApiRefPro = React.MutableRefObject<GridApiPro>;
