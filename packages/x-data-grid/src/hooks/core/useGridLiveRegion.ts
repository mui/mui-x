'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridLiveRegionPrivateApi } from '../../models/api/gridLiveRegionApi';
import { useGridApiMethod } from '../utils/useGridApiMethod';

export const useGridLiveRegion = (apiRef: RefObject<GridPrivateApiCommon>) => {
  const liveRegionRef = React.useRef<HTMLDivElement>(null);

  const announce = React.useCallback<GridLiveRegionPrivateApi['announce']>((message) => {
    const region = liveRegionRef.current;
    if (!region) {
      return;
    }
    // A new node, so screen readers announce a repeated message again
    const node = region.ownerDocument.createElement('span');
    node.textContent = message;
    region.replaceChildren(node);
  }, []);

  useGridApiMethod(apiRef, { liveRegionRef, announce }, 'private');
};
