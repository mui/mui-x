'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useRtl } from '@mui/system/RtlProvider';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridStateCommunity } from '../../models/gridStateCommunity';

export const useGridIsRtl = (apiRef: RefObject<GridPrivateApiCommon>): void => {
  const isRtl = useRtl();

  if (apiRef.current.state.isRtl === undefined) {
    apiRef.current.state.isRtl = isRtl;
  }

  const isFirstEffect = React.useRef(true);
  React.useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
    } else {
      apiRef.current.setState((state: GridStateCommunity) => ({ ...state, isRtl }));
    }
  }, [apiRef, isRtl]);
};
