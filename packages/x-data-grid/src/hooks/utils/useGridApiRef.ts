'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = () => React.useRef(null) as RefObject<GridApiCommunity | null>;
