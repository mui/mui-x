import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export const useGridIsRtl = (apiRef: React.MutableRefObject<GridPrivateApiCommon>): void => {
  const isRtl = useRtl();

  if (apiRef.current.state.isRtl === undefined) {
    apiRef.current.state.isRtl = isRtl;
  }

  const isFirstEffect = React.useRef(true);
  React.useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
    } else {
      apiRef.current.setState((state) => ({ ...state, isRtl }));
    }
  }, [apiRef, isRtl]);
};
