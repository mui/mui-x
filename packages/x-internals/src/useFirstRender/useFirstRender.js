'use client';
import * as React from 'react';
export function useFirstRender(callback) {
    const isFirstRender = React.useRef(true);
    if (isFirstRender.current) {
        isFirstRender.current = false;
        callback();
    }
}
