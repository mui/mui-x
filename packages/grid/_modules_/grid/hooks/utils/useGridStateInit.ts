import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommon } from '../../models';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const useGridStateInit = <GridApi extends GridApiCommon>(
  apiRef: GridApiRef<GridApi>,
  callback: (state: DeepPartial<GridApi['state']>) => DeepPartial<GridApi['state']>,
) => {
  const isInitialized = React.useRef(false);

  if (!isInitialized.current) {
    apiRef.current.state = callback(apiRef.current.state) as GridApi['state'];
    isInitialized.current = true;
  }
};
