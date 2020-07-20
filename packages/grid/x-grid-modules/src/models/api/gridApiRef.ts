import * as React from 'react';
import { GridApi } from './gridApi';

/**
 * The apiRef component prop type.
 */
export type GridApiRef = React.MutableRefObject<GridApi | null | undefined>;

/**
 * Helper Function that instantiate GridApiRef to pass in component prop.
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const gridApiRef = (): GridApiRef => React.useRef<GridApi | null | undefined>();
// TODO move to useApiRef hook

/**
 * The ref type of the inner grid root container.
 */
export type GridRootRef = React.RefObject<HTMLDivElement>;
