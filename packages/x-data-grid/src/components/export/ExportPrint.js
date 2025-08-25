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
exports.ExportPrint = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useComponentRenderer_1 = require("@mui/x-internals/useComponentRenderer");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
/**
 * A button that triggers a print export.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Export](https://mui.com/x/react-data-grid/components/export/)
 *
 * API:
 *
 * - [ExportPrint API](https://mui.com/x/api/data-grid/export-print/)
 */
var ExportPrint = (0, forwardRef_1.forwardRef)(function ExportPrint(props, ref) {
    var _a;
    var render = props.render, options = props.options, onClick = props.onClick, other = __rest(props, ["render", "options", "onClick"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var handleClick = function (event) {
        apiRef.current.exportDataAsPrint(options);
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
    };
    var element = (0, useComponentRenderer_1.useComponentRenderer)(rootProps.slots.baseButton, render, __assign(__assign(__assign(__assign({}, (_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.baseButton), { onClick: handleClick }), other), { ref: ref }));
    return <React.Fragment>{element}</React.Fragment>;
});
exports.ExportPrint = ExportPrint;
ExportPrint.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    className: prop_types_1.default.string,
    disabled: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    /**
     * The options to apply on the Print export.
     * @demos
     *   - [Print export](/x/react-data-grid/export/#print-export)
     */
    options: prop_types_1.default.shape({
        allColumns: prop_types_1.default.bool,
        bodyClassName: prop_types_1.default.string,
        copyStyles: prop_types_1.default.bool,
        fields: prop_types_1.default.arrayOf(prop_types_1.default.string),
        fileName: prop_types_1.default.string,
        getRowsToExport: prop_types_1.default.func,
        hideFooter: prop_types_1.default.bool,
        hideToolbar: prop_types_1.default.bool,
        includeCheckboxes: prop_types_1.default.bool,
        pageStyle: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
    }),
    /**
     * A function to customize rendering of the component.
     */
    render: prop_types_1.default.oneOfType([prop_types_1.default.element, prop_types_1.default.func]),
    role: prop_types_1.default.string,
    size: prop_types_1.default.oneOf(['large', 'medium', 'small']),
    startIcon: prop_types_1.default.node,
    style: prop_types_1.default.object,
    tabIndex: prop_types_1.default.number,
    title: prop_types_1.default.string,
    touchRippleRef: prop_types_1.default.any,
};
