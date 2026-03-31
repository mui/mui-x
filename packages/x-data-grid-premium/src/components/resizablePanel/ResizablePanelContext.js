'use client';
import * as React from 'react';
export const ResizablePanelContext = React.createContext(undefined);
export function useResizablePanelContext() {
    const context = React.useContext(ResizablePanelContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. ResizablePanel subcomponents must be placed within a <ResizablePanel /> component.');
    }
    return context;
}
