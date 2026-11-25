'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useTimeout } from '../utils/useTimeout';
import type { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import type { GridLiveRegionPrivateApi } from '../../models/api/gridLiveRegionApi';
import { useGridApiMethod } from '../utils/useGridApiMethod';

// Long enough for screen readers to finish reading the message
const CLEAR_DELAY = 5000;

export const useGridLiveRegion = (apiRef: RefObject<GridPrivateApiCommon>) => {
  const liveRegionRef = React.useRef<HTMLDivElement>(null);
  const clearTimer = useTimeout();

  const announce = React.useCallback<GridLiveRegionPrivateApi['announce']>(
    (message) => {
      const region = liveRegionRef.current;
      if (!region) {
        return;
      }
      // A new node, so screen readers announce a repeated message again
      const node = region.ownerDocument.createElement('span');
      node.textContent = message;
      region.replaceChildren(node);
      // So a user who reads the page later doesn't find a stale message
      clearTimer.start(CLEAR_DELAY, () => region.replaceChildren());
    },
    [clearTimer],
  );

  useGridApiMethod(apiRef, { liveRegionRef, announce }, 'private');
};
