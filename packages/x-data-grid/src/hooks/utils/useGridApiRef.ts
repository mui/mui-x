'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = () => React.useRef(null) as RefObject<GridApiCommunity | null>;
