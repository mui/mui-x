'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
export function useGridApiMethod(privateApiRef, apiMethods, visibility) {
    const isFirstRender = React.useRef(true);
    useEnhancedEffect(() => {
        isFirstRender.current = false;
        privateApiRef.current.register(visibility, apiMethods);
    }, [privateApiRef, visibility, apiMethods]);
    if (isFirstRender.current) {
        privateApiRef.current.register(visibility, apiMethods);
    }
}
