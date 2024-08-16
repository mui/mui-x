import * as React from 'react';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export const useGridRefs = <PrivateApi extends GridPrivateApiCommon>(
  apiRef: React.MutableRefObject<PrivateApi>,
) => {
  const rootElementRef = React.useRef<HTMLDivElement>(null);
  const mainElementRef = React.useRef<HTMLDivElement>(null);
  const virtualScrollerRef = React.useRef<HTMLDivElement>(null);
  const columnHeadersContainerRef = React.useRef<HTMLDivElement>(null);

  apiRef.current.register('public', {
    rootElementRef,
  });

  apiRef.current.register('private', {
    mainElementRef,
    virtualScrollerRef,
    columnHeadersContainerRef,
  });
};
