import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridApiCommon } from '../../models';
import { GridApiCommunity } from '../../models/api/gridApiCommunity';

/**
 * Hook that instantiate a [[GridApiRef]].
 */
export const useGridApiRef = <Api extends GridApiCommon = GridApiCommunity>() =>
  // TODO v8: initialize with null (see https://github.com/mui/mui-x/issues/16135#issuecomment-2589395230 and https://github.com/mui/mui-x/issues/16000#issuecomment-2567820735)
  React.useRef({}) as RefObject<Api>;
