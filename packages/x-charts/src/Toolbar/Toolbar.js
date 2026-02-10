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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var clsx_1 = require("clsx");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var ToolbarContext_1 = require("@mui/x-internals/ToolbarContext");
var chartToolbarClasses_1 = require("./chartToolbarClasses");
var ToolbarRoot = (0, styles_1.styled)('div', {
    name: 'MuiChartsToolbar',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        flex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        gap: theme.spacing(0.25),
        padding: theme.spacing(0.5),
        marginBottom: theme.spacing(1.5),
        minHeight: 44,
        boxSizing: 'border-box',
        border: "1px solid ".concat((theme.vars || theme).palette.divider),
        borderRadius: 4,
    });
});
exports.Toolbar = React.forwardRef(function Toolbar(_a, ref) {
    var className = _a.className, render = _a.render, other = __rest(_a, ["className", "render"]);
    var element = (0, useComponentRenderer_1.useComponentRenderer)(ToolbarRoot, render, __assign(__assign({ role: 'toolbar', 'aria-orientation': 'horizontal', className: (0, clsx_1.default)(chartToolbarClasses_1.chartsToolbarClasses.root, className) }, other), { ref: ref }));
    return (0, jsx_runtime_1.jsx)(ToolbarContext_1.ToolbarContextProvider, { children: element });
});
exports.Toolbar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
};
