"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridPanelContext = void 0;
exports.useGridPanelContext = useGridPanelContext;
exports.GridPanelContextProvider = GridPanelContextProvider;
var React = require("react");
exports.GridPanelContext = React.createContext(undefined);
function useGridPanelContext() {
    var context = React.useContext(exports.GridPanelContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context.');
    }
    return context;
}
function GridPanelContextProvider(_a) {
    var children = _a.children;
    var columnsPanelTriggerRef = React.useRef(null);
    var filterPanelTriggerRef = React.useRef(null);
    var aiAssistantPanelTriggerRef = React.useRef(null);
    var value = React.useMemo(function () { return ({ columnsPanelTriggerRef: columnsPanelTriggerRef, filterPanelTriggerRef: filterPanelTriggerRef, aiAssistantPanelTriggerRef: aiAssistantPanelTriggerRef }); }, []);
    return <exports.GridPanelContext.Provider value={value}>{children}</exports.GridPanelContext.Provider>;
}
