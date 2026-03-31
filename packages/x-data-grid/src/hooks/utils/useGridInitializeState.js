'use client';
import * as React from 'react';
export const useGridInitializeState = (initializer, privateApiRef, props, key) => {
    const previousKey = React.useRef(key);
    const isInitialized = React.useRef(false);
    if (key !== previousKey.current) {
        isInitialized.current = false;
        previousKey.current = key;
    }
    if (!isInitialized.current) {
        privateApiRef.current.state = initializer(privateApiRef.current.state, props, privateApiRef);
        isInitialized.current = true;
    }
};
