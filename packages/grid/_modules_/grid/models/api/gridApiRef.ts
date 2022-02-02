import * as React from 'react';
import { GridApiCommunity, GridApiPro } from './gridApi';

/**
 * The reference storing the api of the Community-plan grid.
 */
export type GridApiRefCommunity = React.MutableRefObject<GridApiCommunity>;

/**
 * The reference storing the api of the Pro-plan grid.
 */
export type GridApiRefPro = React.MutableRefObject<GridApiPro>;
