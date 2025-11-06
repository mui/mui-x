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
exports.GridColumnMenuColumnsItem = GridColumnMenuColumnsItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var GridColumnMenuHideItem_1 = require("./GridColumnMenuHideItem");
var GridColumnMenuManageItem_1 = require("./GridColumnMenuManageItem");
function GridColumnMenuColumnsItem(props) {
    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(GridColumnMenuHideItem_1.GridColumnMenuHideItem, __assign({}, props)), (0, jsx_runtime_1.jsx)(GridColumnMenuManageItem_1.GridColumnMenuManageItem, __assign({}, props))] }));
}
GridColumnMenuColumnsItem.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    colDef: prop_types_1.default.object.isRequired,
    onClick: prop_types_1.default.func.isRequired,
};
