"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItemDragAndDropOverlay = TreeItemDragAndDropOverlay;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var createStyled_1 = require("@mui/system/createStyled");
var zero_styled_1 = require("../internals/zero-styled");
var TreeItemDragAndDropOverlayRoot = (0, zero_styled_1.styled)('div', {
    name: 'MuiTreeItemDragAndDropOverlay',
    slot: 'Root',
    shouldForwardProp: function (prop) { return (0, createStyled_1.shouldForwardProp)(prop) && prop !== 'action'; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'absolute',
        left: 0,
        display: 'flex',
        top: 0,
        bottom: 0,
        right: 0,
        pointerEvents: 'none',
        variants: [
            {
                props: { action: 'make-child' },
                style: {
                    marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.vars
                        ? "rgba(".concat(theme.vars.palette.primary.darkChannel, " / ").concat(theme.vars.palette.action.focusOpacity, ")")
                        : (0, styles_1.alpha)(theme.palette.primary.dark, theme.palette.action.focusOpacity),
                },
            },
            {
                props: { action: 'reorder-above' },
                style: {
                    marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
                    borderTop: "1px solid ".concat((theme.vars || theme).palette.action.active),
                },
            },
            {
                props: { action: 'reorder-below' },
                style: {
                    marginLeft: 'calc(var(--TreeView-indentMultiplier) * var(--TreeView-itemDepth))',
                    borderBottom: "1px solid ".concat((theme.vars || theme).palette.action.active),
                },
            },
            {
                props: { action: 'move-to-parent' },
                style: {
                    marginLeft: 'calc(var(--TreeView-indentMultiplier) * calc(var(--TreeView-itemDepth) - 1))',
                    borderBottom: "1px solid ".concat((theme.vars || theme).palette.action.active),
                },
            },
        ],
    });
});
function TreeItemDragAndDropOverlay(props) {
    if (props.action == null) {
        return null;
    }
    return <TreeItemDragAndDropOverlayRoot {...props}/>;
}
TreeItemDragAndDropOverlay.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    action: prop_types_1.default.oneOf(['make-child', 'move-to-parent', 'reorder-above', 'reorder-below']),
    style: prop_types_1.default.object,
};
