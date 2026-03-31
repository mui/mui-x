'use client';
import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
export const useGridRegisterPipeProcessor = (apiRef, group, callback, enabled = true) => {
    const cleanup = React.useRef(null);
    const id = React.useRef(`mui-${Math.round(Math.random() * 1e9)}`);
    const registerPreProcessor = React.useCallback(() => {
        cleanup.current = apiRef.current.registerPipeProcessor(group, id.current, callback);
    }, [apiRef, callback, group]);
    useFirstRender(() => {
        if (enabled) {
            registerPreProcessor();
        }
    });
    const isFirstRender = React.useRef(true);
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else if (enabled) {
            registerPreProcessor();
        }
        return () => {
            if (cleanup.current) {
                cleanup.current();
                cleanup.current = null;
            }
        };
    }, [registerPreProcessor, enabled]);
};
