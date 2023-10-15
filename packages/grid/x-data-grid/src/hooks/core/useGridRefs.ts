import * as React from 'react';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export const useGridRefs = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: React.MutableRefObject<PrivateApi>
) => {
  const mainElementRef = React.useRef<HTMLDivElement>(null);
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.register('private', {
    mainElementRef,
    virtualScrollerRef,
  });
};
