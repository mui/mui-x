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
exports.GridColumnHeaderSortIcon = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var GridIconButtonContainer_1 = require("./GridIconButtonContainer");
var GridColumnSortButton_1 = require("../GridColumnSortButton");
function GridColumnHeaderSortIconRaw(props) {
    return ((0, jsx_runtime_1.jsx)(GridIconButtonContainer_1.GridIconButtonContainer, { children: (0, jsx_runtime_1.jsx)(GridColumnSortButton_1.GridColumnSortButton, __assign({}, props, { tabIndex: -1 })) }));
}
var GridColumnHeaderSortIcon = React.memo(GridColumnHeaderSortIconRaw);
exports.GridColumnHeaderSortIcon = GridColumnHeaderSortIcon;
GridColumnHeaderSortIconRaw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    color: prop_types_1.default.oneOf(['default', 'inherit', 'primary']),
    direction: prop_types_1.default.oneOf(['asc', 'desc']),
    disabled: prop_types_1.default.bool,
    edge: prop_types_1.default.oneOf(['end', 'start', false]),
    field: prop_types_1.default.string.isRequired,
    id: prop_types_1.default.string,
    index: prop_types_1.default.number,
    label: prop_types_1.default.string,
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    sortingOrder: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['asc', 'desc'])).isRequired,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};
