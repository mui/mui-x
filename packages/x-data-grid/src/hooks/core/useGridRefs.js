'use client';
import * as React from 'react';
export const useGridRefs = (apiRef) => {
    const rootElementRef = React.useRef(null);
    const mainElementRef = React.useRef(null);
    const virtualScrollerRef = React.useRef(null);
    const virtualScrollbarVerticalRef = React.useRef(null);
    const virtualScrollbarHorizontalRef = React.useRef(null);
    const columnHeadersContainerRef = React.useRef(null);
    apiRef.current.register('public', {
        rootElementRef,
    });
    apiRef.current.register('private', {
        mainElementRef,
        virtualScrollerRef,
        virtualScrollbarVerticalRef,
        virtualScrollbarHorizontalRef,
        columnHeadersContainerRef,
    });
};
