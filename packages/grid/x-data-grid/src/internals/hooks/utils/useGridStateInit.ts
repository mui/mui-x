import * as React from 'react';
import type { GridApiCommon } from '../../models';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const useGridStateInit = <Api extends GridApiCommon>(
  apiRef: React.MutableRefObject<Api>,
  callback: (state: DeepPartial<Api['state']>) => DeepPartial<Api['state']>,
) => {
  const isInitialized = React.useRef(false);

  if (!isInitialized.current) {
    apiRef.current.state = callback(apiRef.current.state) as Api['state'];
    isInitialized.current = true;
  }
};
