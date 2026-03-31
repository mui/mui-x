'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import reactMajor from '@mui/x-internals/reactMajor';
export default function useRefCallback(fn) {
    const refCleanup = React.useRef(undefined);
    const refCallback = useEventCallback((node) => {
        if (!node) {
            // Cleanup for R18
            refCleanup.current?.();
            return;
        }
        refCleanup.current = fn(node);
        if (reactMajor >= 19) {
            /* eslint-disable-next-line consistent-return */
            return refCleanup.current;
        }
    });
    return refCallback;
}
