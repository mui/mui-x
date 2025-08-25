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
exports.ChartsToolbarImageExportTrigger = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var internals_1 = require("@mui/x-charts/internals");
var context_1 = require("../context");
/**
 * A button that triggers an image export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-charts/export/)
 */
var ChartsToolbarImageExportTrigger = (0, forwardRef_1.forwardRef)(function ChartsToolbarImageExportTrigger(props, ref) {
    var render = props.render, options = props.options, onClick = props.onClick, other = __rest(props, ["render", "options", "onClick"]);
    var _a = (0, internals_1.useChartsSlots)(), slots = _a.slots, slotProps = _a.slotProps;
    var apiRef = (0, context_1.useChartProApiContext)();
    var handleClick = function (event) {
        apiRef.current.exportAsImage(options);
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(slots.baseButton, render, __assign(__assign(__assign(__assign({}, slotProps === null || slotProps === void 0 ? void 0 : slotProps.baseButton), { onClick: handleClick }), other), { ref: ref }));
    return <React.Fragment>{element}</React.Fragment>;
});
exports.ChartsToolbarImageExportTrigger = ChartsToolbarImageExportTrigger;
ChartsToolbarImageExportTrigger.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    disabled: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    /**
     * The options to apply on the image export.
     * @demos
     *   - [Export as Image](https://mui.com/x/react-charts/export/#export-as-image)
     */
    options: prop_types_1.default.shape({
        copyStyles: prop_types_1.default.bool,
        fileName: prop_types_1.default.string,
        onBeforeExport: prop_types_1.default.func,
        quality: prop_types_1.default.number,
        type: prop_types_1.default.string.isRequired,
    }),
    /**
     * A function to customize the rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
};
