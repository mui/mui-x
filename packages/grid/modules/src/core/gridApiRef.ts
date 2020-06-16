import React, { useRef } from 'react';
import { GridApi } from './models';

export type GridApiRef = React.MutableRefObject<GridApi | null | undefined>;
// eslint-disable-next-line react-hooks/rules-of-hooks
export const gridApiRef = (): GridApiRef => useRef<GridApi | null | undefined>();
export type GridRootRef = React.RefObject<HTMLDivElement>;
