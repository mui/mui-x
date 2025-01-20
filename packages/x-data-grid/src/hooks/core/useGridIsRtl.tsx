import * as React from 'react';
import { ApiRef } from '@mui/x-internals/apiRef';
import { useRtl } from '@mui/system/RtlProvider';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { GridStateCommunity } from '../../models/gridStateCommunity';

export const useGridIsRtl = (apiRef: ApiRef<GridPrivateApiCommon>): void => {
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
