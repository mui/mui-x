'use client';
import * as React from 'react';
export const PromptFieldContext = React.createContext(undefined);
export function usePromptFieldContext() {
    const context = React.useContext(PromptFieldContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Prompt Field subcomponents must be placed within a <PromptField /> component.');
    }
    return context;
}
