"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeRootContext = void 0;
exports.useCompositeRootContext = useCompositeRootContext;
var React = require("react");
exports.CompositeRootContext = React.createContext(undefined);
function useCompositeRootContext(optional) {
    if (optional === void 0) { optional = false; }
    var context = React.useContext(exports.CompositeRootContext);
    if (context === undefined && !optional) {
        throw new Error('Base UI: CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>.');
    }
    return context;
}
