'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
export const GridPanelContext = React.createContext(undefined);
export function useGridPanelContext() {
    const context = React.useContext(GridPanelContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context.');
    }
    return context;
}
export function GridPanelContextProvider({ children }) {
    const columnsPanelTriggerRef = React.useRef(null);
    const filterPanelTriggerRef = React.useRef(null);
    const aiAssistantPanelTriggerRef = React.useRef(null);
    const value = React.useMemo(() => ({ columnsPanelTriggerRef, filterPanelTriggerRef, aiAssistantPanelTriggerRef }), []);
    return _jsx(GridPanelContext.Provider, { value: value, children: children });
}
