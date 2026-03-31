'use client';
import * as React from 'react';
export const CollapsibleContext = React.createContext(undefined);
export function useCollapsibleContext() {
    const context = React.useContext(CollapsibleContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Collapsible subcomponents must be placed within a <Collapsible /> component.');
    }
    return context;
}
