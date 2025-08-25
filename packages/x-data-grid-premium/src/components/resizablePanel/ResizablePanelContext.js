"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizablePanelContext = void 0;
exports.useResizablePanelContext = useResizablePanelContext;
var React = require("react");
exports.ResizablePanelContext = React.createContext(undefined);
function useResizablePanelContext() {
    var context = React.useContext(exports.ResizablePanelContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. ResizablePanel subcomponents must be placed within a <ResizablePanel /> component.');
    }
    return context;
}
