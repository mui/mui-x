"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleContext = void 0;
exports.useCollapsibleContext = useCollapsibleContext;
var React = require("react");
exports.CollapsibleContext = React.createContext(undefined);
function useCollapsibleContext() {
    var context = React.useContext(exports.CollapsibleContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Collapsible subcomponents must be placed within a <Collapsible /> component.');
    }
    return context;
}
