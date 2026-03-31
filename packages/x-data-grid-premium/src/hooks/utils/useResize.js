'use client';
import * as React from 'react';
export const useResize = (options) => {
    const resizeHandleRef = React.useRef(null);
    const optionsRef = React.useRef(options);
    React.useEffect(() => {
        optionsRef.current = options;
    }, [options]);
    React.useEffect(() => {
        const handle = resizeHandleRef.current;
        if (!handle) {
            return undefined;
        }
        const { onSizeChange, getInitialSize, direction = 'horizontal' } = optionsRef.current;
        let startPosition = null;
        let startSize = null;
        const handlePointerMove = (event) => {
            event.preventDefault();
            if (startPosition === null || startSize === null) {
                return;
            }
            const delta = direction === 'horizontal' ? startPosition - event.clientX : startPosition - event.clientY;
            const newSize = startSize + delta;
            onSizeChange(newSize, handle);
        };
        const handlePointerUp = (event) => {
            startPosition = null;
            startSize = null;
            handle.removeEventListener('pointermove', handlePointerMove);
            handle.releasePointerCapture(event.pointerId);
        };
        const handlePointerDown = (event) => {
            startPosition = direction === 'horizontal' ? event.clientX : event.clientY;
            startSize = getInitialSize(handle);
            handle.addEventListener('pointermove', handlePointerMove);
            handle.setPointerCapture(event.pointerId);
        };
        handle.addEventListener('pointerdown', handlePointerDown);
        handle.addEventListener('pointerup', handlePointerUp);
        return () => {
            handle.removeEventListener('pointerdown', handlePointerDown);
            handle.removeEventListener('pointerup', handlePointerUp);
            handle.removeEventListener('pointermove', handlePointerMove);
        };
    }, []);
    return {
        ref: resizeHandleRef,
    };
};
