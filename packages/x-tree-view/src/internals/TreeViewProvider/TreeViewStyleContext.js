"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewStyleContext = exports.TreeViewStyleContext = void 0;
var React = require("react");
/**
 * @ignore - internal component.
 */
exports.TreeViewStyleContext = React.createContext({
    classes: {},
    slots: {},
    slotProps: {},
});
var useTreeViewStyleContext = function () {
    return React.useContext(exports.TreeViewStyleContext);
};
exports.useTreeViewStyleContext = useTreeViewStyleContext;
