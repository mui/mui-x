'use client';
import * as React from 'react';
export const QuickFilterContext = React.createContext(undefined);
export function useQuickFilterContext() {
    const context = React.useContext(QuickFilterContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Quick Filter subcomponents must be placed within a <QuickFilter /> component.');
    }
    return context;
}
