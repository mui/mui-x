import * as React from 'react';
import { GridApiCommon } from '../../models';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <Api extends GridApiCommon = GridApiCommunity>() =>
  React.useRef({}) as React.MutableRefObject<Api>;
