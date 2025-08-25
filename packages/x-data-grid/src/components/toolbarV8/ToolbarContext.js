"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarContext = void 0;
exports.useToolbarContext = useToolbarContext;
var React = require("react");
exports.ToolbarContext = React.createContext(undefined);
function useToolbarContext() {
    var context = React.useContext(exports.ToolbarContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Toolbar subcomponents must be placed within a <Toolbar /> component.');
    }
    return context;
}
