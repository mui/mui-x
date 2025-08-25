"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptFieldContext = void 0;
exports.usePromptFieldContext = usePromptFieldContext;
var React = require("react");
exports.PromptFieldContext = React.createContext(undefined);
function usePromptFieldContext() {
    var context = React.useContext(exports.PromptFieldContext);
    if (context === undefined) {
        throw new Error('MUI X: Missing context. Prompt Field subcomponents must be placed within a <PromptField /> component.');
    }
    return context;
}
