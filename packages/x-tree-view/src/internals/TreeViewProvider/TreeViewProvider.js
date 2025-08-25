"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeViewProvider = TreeViewProvider;
var React = require("react");
var TreeViewContext_1 = require("./TreeViewContext");
var TreeViewStyleContext_1 = require("./TreeViewStyleContext");
var EMPTY_OBJECT = {};
/**
 * Sets up the contexts for the underlying Tree Item components.
 *
 * @ignore - do not document.
 */
function TreeViewProvider(props) {
    var contextValue = props.contextValue, _a = props.classes, classes = _a === void 0 ? EMPTY_OBJECT : _a, _b = props.slots, slots = _b === void 0 ? EMPTY_OBJECT : _b, _c = props.slotProps, slotProps = _c === void 0 ? EMPTY_OBJECT : _c, children = props.children;
    var styleContextValue = React.useMemo(function () { return ({
        classes: classes,
        slots: {
            collapseIcon: slots.collapseIcon,
            expandIcon: slots.expandIcon,
            endIcon: slots.endIcon,
        },
        slotProps: {
            collapseIcon: slotProps.collapseIcon,
            expandIcon: slotProps.expandIcon,
            endIcon: slotProps.endIcon,
        },
    }); }, [
        classes,
        slots.collapseIcon,
        slots.expandIcon,
        slots.endIcon,
        slotProps.collapseIcon,
        slotProps.expandIcon,
        slotProps.endIcon,
    ]);
    return (<TreeViewContext_1.TreeViewContext.Provider value={contextValue}>
      <TreeViewStyleContext_1.TreeViewStyleContext.Provider value={styleContextValue}>
        {contextValue.wrapRoot({ children: children })}
      </TreeViewStyleContext_1.TreeViewStyleContext.Provider>
    </TreeViewContext_1.TreeViewContext.Provider>);
}
