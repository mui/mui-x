import * as React from 'react';
import { GridApi, GridPrivateApi } from './gridApi';

/**
 * The apiRef component prop type.
 */
export type GridApiRef = React.MutableRefObject<GridApi>;

export type GridPrivateApiRef = React.MutableRefObject<GridPrivateApi>;
