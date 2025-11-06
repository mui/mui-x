"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickFilterContext = void 0;
exports.useQuickFilterContext = useQuickFilterContext;
var React = require("react");
exports.QuickFilterContext = React.createContext(undefined);
function useQuickFilterContext() {
    var context = React.useContext(exports.QuickFilterContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Quick Filter subcomponents must be placed within a <QuickFilter /> component.');
    }
    return context;
}
