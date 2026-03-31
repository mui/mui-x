'use client';
import * as React from 'react';
export const ToolbarContext = React.createContext(undefined);
export function useToolbarContext() {
    const context = React.useContext(ToolbarContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Toolbar subcomponents must be placed within a <Toolbar /> component.');
    }
    return context;
}
