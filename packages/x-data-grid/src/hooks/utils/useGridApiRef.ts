import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon } from '../../models';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <Api extends GridApiCommon = GridApiCommunity>() =>
  React.useRef(null) as RefObject<Api | null>;
