"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewContext = exports.TreeViewContext = void 0;
var React = require("react");
/**
 * @ignore - internal component.
 */
exports.TreeViewContext = React.createContext(null);
var useTreeViewContext = function () {
    var context = React.useContext(exports.TreeViewContext);
    if (context == null) {
        throw new Error([
            'MUI X: Could not find the Tree View context.',
            'It looks like you rendered your component outside of a SimpleTreeView or RichTreeView parent component.',
            'This can also happen if you are bundling multiple versions of the Tree View.',
        ].join('\n'));
    }
    return context;
};
exports.useTreeViewContext = useTreeViewContext;
