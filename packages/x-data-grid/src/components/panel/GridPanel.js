"use strict";
'use client';
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
exports.GridPanel = exports.gridPanelClasses = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var cssVariables_1 = require("../../constants/cssVariables");
var context_1 = require("../../utils/css/context");
var useGridApiContext_1 = require("../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var assert_1 = require("../../utils/assert");
exports.gridPanelClasses = (0, generateUtilityClasses_1.default)('MuiDataGrid', [
    'panel',
    'paper',
]);
var GridPanelRoot = (0, styles_1.styled)((assert_1.NotRendered), {
    name: 'MuiDataGrid',
    slot: 'panel',
})({
    zIndex: cssVariables_1.vars.zIndex.panel,
});
var GridPanelContent = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'panelContent',
})({
    backgroundColor: cssVariables_1.vars.colors.background.overlay,
    borderRadius: cssVariables_1.vars.radius.base,
    boxShadow: cssVariables_1.vars.shadows.overlay,
    display: 'flex',
    maxWidth: "calc(100vw - ".concat(cssVariables_1.vars.spacing(2), ")"),
    overflow: 'auto',
});
var GridPanel = (0, forwardRef_1.forwardRef)(function (props, ref) {
    var _a, _b;
    var children = props.children, className = props.className, classesProp = props.classes, onClose = props.onClose, other = __rest(props, ["children", "className", "classes", "onClose"]);
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = exports.gridPanelClasses;
    var _c = React.useState(false), isPlaced = _c[0], setIsPlaced = _c[1];
    var variablesClass = (0, context_1.useCSSVariablesClass)();
    var onDidShow = (0, useEventCallback_1.default)(function () { return setIsPlaced(true); });
    var onDidHide = (0, useEventCallback_1.default)(function () { return setIsPlaced(false); });
    var handleClickAway = (0, useEventCallback_1.default)(function () {
        onClose === null || onClose === void 0 ? void 0 : onClose();
    });
    var handleKeyDown = (0, useEventCallback_1.default)(function (event) {
        if (event.key === 'Escape') {
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    });
    var _d = React.useState(null), fallbackTarget = _d[0], setFallbackTarget = _d[1];
    React.useEffect(function () {
        var _a, _b;
        var panelAnchor = (_b = (_a = apiRef.current.rootElementRef) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.querySelector('[data-id="gridPanelAnchor"]');
        if (panelAnchor) {
            setFallbackTarget(panelAnchor);
        }
    }, [apiRef]);
    if (!fallbackTarget) {
        return null;
    }
    return (<GridPanelRoot as={rootProps.slots.basePopper} ownerState={rootProps} placement="bottom-end" className={(0, clsx_1.default)(classes.panel, className, variablesClass)} flip onDidShow={onDidShow} onDidHide={onDidHide} onClickAway={handleClickAway} clickAwayMouseEvent="onPointerUp" clickAwayTouchEvent={false} focusTrap {...other} {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.basePopper} target={(_b = props.target) !== null && _b !== void 0 ? _b : fallbackTarget} ref={ref}>
      <GridPanelContent className={classes.paper} ownerState={rootProps} onKeyDown={handleKeyDown}>
        {isPlaced && children}
      </GridPanelContent>
    </GridPanelRoot>);
});
exports.GridPanel = GridPanel;
GridPanel.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    children: prop_types_1.default.node,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    flip: prop_types_1.default.bool,
    id: prop_types_1.default.string,
    onClose: prop_types_1.default.func,
    open: prop_types_1.default.bool.isRequired,
    target: prop_types_1.default /* @typescript-to-proptypes-ignore */.any,
};
