'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { isReactVersionAtLeast } from '@base-ui/utils/reactVersion';

export default function useRefCallback(fn: (node: HTMLDivElement) => (() => void) | undefined) {
  const refCleanup = React.useRef<() => void | undefined>(undefined);
  const refCallback = useEventCallback((node: HTMLDivElement | null) => {
    if (!node) {
      // Cleanup for R18
      refCleanup.current?.();
      return;
    }

    refCleanup.current = fn(node);

    if (isReactVersionAtLeast(19)) {
      /* eslint-disable-next-line consistent-return */
      return refCleanup.current;
    }
  });
  return refCallback;
}
