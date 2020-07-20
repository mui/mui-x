import * as React from 'react';
import { GridApi } from './gridApi';
/**
 * The apiRef component prop type.
 */
export type ApiRef = React.MutableRefObject<GridApi | null | undefined>;
