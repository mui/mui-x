"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridColumnHeaderMenu = GridColumnHeaderMenu;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var HTMLElementType_1 = require("@mui/utils/HTMLElementType");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
var GridMenu_1 = require("../GridMenu");
function GridColumnHeaderMenu(_a) {
    var columnMenuId = _a.columnMenuId, columnMenuButtonId = _a.columnMenuButtonId, ContentComponent = _a.ContentComponent, contentComponentProps = _a.contentComponentProps, field = _a.field, open = _a.open, target = _a.target, onExited = _a.onExited;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var colDef = apiRef.current.getColumn(field);
    var hideMenu = (0, useEventCallback_1.default)(function (event) {
        if (event) {
            // Prevent triggering the sorting
            event.stopPropagation();
            if (target === null || target === void 0 ? void 0 : target.contains(event.target)) {
                return;
            }
        }
        apiRef.current.hideColumnMenu();
    });
    if (!target || !colDef) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(GridMenu_1.GridMenu, { position: "bottom-".concat(colDef.align === 'right' ? 'start' : 'end'), open: open, target: target, onClose: hideMenu, onExited: onExited, children: (0, jsx_runtime_1.jsx)(ContentComponent, __assign({ colDef: colDef, hideMenu: hideMenu, open: open, id: columnMenuId, labelledby: columnMenuButtonId }, contentComponentProps)) }));
}
GridColumnHeaderMenu.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    columnMenuButtonId: prop_types_1.default.string,
    columnMenuId: prop_types_1.default.string,
    ContentComponent: prop_types_1.default.elementType.isRequired,
    contentComponentProps: prop_types_1.default.any,
    field: prop_types_1.default.string.isRequired,
    onExited: prop_types_1.default.func,
    open: prop_types_1.default.bool.isRequired,
    target: HTMLElementType_1.default,
};
