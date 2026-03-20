"use strict";
'use client';
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
exports.ChartsToolbarPro = ChartsToolbarPro;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var Toolbar_1 = require("@mui/x-charts/Toolbar");
var internals_1 = require("@mui/x-charts/internals");
var hooks_1 = require("@mui/x-charts/hooks");
var useId_1 = require("@mui/utils/useId");
var ChartsToolbarDivider_1 = require("./internals/ChartsToolbarDivider");
var ChartsMenu_1 = require("./internals/ChartsMenu");
var useChartProZoom_1 = require("../internals/plugins/useChartProZoom");
var ChartsToolbarZoomInTrigger_1 = require("./ChartsToolbarZoomInTrigger");
var ChartsToolbarZoomOutTrigger_1 = require("./ChartsToolbarZoomOutTrigger");
var ChartsToolbarPrintExportTrigger_1 = require("./ChartsToolbarPrintExportTrigger");
var ChartsToolbarImageExportTrigger_1 = require("./ChartsToolbarImageExportTrigger");
var DEFAULT_IMAGE_EXPORT_OPTIONS = [{ type: 'image/png' }];
/**
 * The chart toolbar component for the pro package.
 */
function ChartsToolbarPro(_a) {
    var printOptions = _a.printOptions, rawImageExportOptions = _a.imageExportOptions, other = __rest(_a, ["printOptions", "imageExportOptions"]);
    var _b = (0, internals_1.useChartsSlots)(), slots = _b.slots, slotProps = _b.slotProps;
    var store = (0, internals_1.useChartsContext)().store;
    var localeText = (0, hooks_1.useChartsLocalization)().localeText;
    var _c = React.useState(false), exportMenuOpen = _c[0], setExportMenuOpen = _c[1];
    var exportMenuTriggerRef = React.useRef(null);
    var exportMenuId = (0, useId_1.default)();
    var exportMenuTriggerId = (0, useId_1.default)();
    var isZoomEnabled = store.use(useChartProZoom_1.selectorChartZoomIsEnabled);
    var imageExportOptionList = rawImageExportOptions !== null && rawImageExportOptions !== void 0 ? rawImageExportOptions : DEFAULT_IMAGE_EXPORT_OPTIONS;
    var showExportMenu = !(printOptions === null || printOptions === void 0 ? void 0 : printOptions.disableToolbarButton) || imageExportOptionList.length > 0;
    var children = [];
    if (isZoomEnabled) {
        var Tooltip = slots.baseTooltip;
        var ZoomOutIcon = slots.zoomOutIcon;
        var ZoomInIcon = slots.zoomInIcon;
        children.push((0, jsx_runtime_1.jsx)(Tooltip, __assign({}, slotProps.baseTooltip, { title: localeText.zoomIn, children: (0, jsx_runtime_1.jsx)(ChartsToolbarZoomInTrigger_1.ChartsToolbarZoomInTrigger, { render: (0, jsx_runtime_1.jsx)(Toolbar_1.ToolbarButton, { size: "small" }), children: (0, jsx_runtime_1.jsx)(ZoomInIcon, __assign({ fontSize: "small" }, slotProps.zoomInIcon)) }) }), "zoom-in"));
        children.push((0, jsx_runtime_1.jsx)(Tooltip, __assign({}, slotProps.baseTooltip, { title: localeText.zoomOut, children: (0, jsx_runtime_1.jsx)(ChartsToolbarZoomOutTrigger_1.ChartsToolbarZoomOutTrigger, { render: (0, jsx_runtime_1.jsx)(Toolbar_1.ToolbarButton, { size: "small" }), children: (0, jsx_runtime_1.jsx)(ZoomOutIcon, __assign({ fontSize: "small" }, slotProps.zoomOutIcon)) }) }), "zoom-out"));
    }
    if (showExportMenu) {
        var Tooltip = slots.baseTooltip;
        var MenuList = slots.baseMenuList;
        var MenuItem_1 = slots.baseMenuItem;
        var ExportIcon = slots.exportIcon;
        var closeExportMenu_1 = function () { return setExportMenuOpen(false); };
        var handleListKeyDown = function (event) {
            if (event.key === 'Tab') {
                event.preventDefault();
            }
            if (isHideMenuKey(event.key)) {
                closeExportMenu_1();
            }
        };
        if (children.length > 0) {
            children.push((0, jsx_runtime_1.jsx)(ChartsToolbarDivider_1.ChartsToolbarDivider, {}, "divider"));
        }
        children.push((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)(Tooltip, { title: localeText.toolbarExport, disableInteractive: exportMenuOpen, children: (0, jsx_runtime_1.jsx)(Toolbar_1.ToolbarButton, { ref: exportMenuTriggerRef, id: exportMenuTriggerId, "aria-controls": exportMenuId, "aria-haspopup": "true", "aria-expanded": exportMenuOpen ? 'true' : undefined, onClick: function () { return setExportMenuOpen(!exportMenuOpen); }, size: "small", children: (0, jsx_runtime_1.jsx)(ExportIcon, { fontSize: "small" }) }) }), (0, jsx_runtime_1.jsx)(ChartsMenu_1.ChartsMenu, { target: exportMenuTriggerRef.current, open: exportMenuOpen, onClose: closeExportMenu_1, position: "bottom-end", children: (0, jsx_runtime_1.jsxs)(MenuList, __assign({ id: exportMenuId, "aria-labelledby": exportMenuTriggerId, onKeyDown: handleListKeyDown, autoFocusItem: true }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.baseMenuList, { children: [!(printOptions === null || printOptions === void 0 ? void 0 : printOptions.disableToolbarButton) && ((0, jsx_runtime_1.jsx)(ChartsToolbarPrintExportTrigger_1.ChartsToolbarPrintExportTrigger, { render: (0, jsx_runtime_1.jsx)(MenuItem_1, __assign({ dense: true }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.baseMenuItem)), options: printOptions, onClick: closeExportMenu_1, children: localeText.toolbarExportPrint })), imageExportOptionList.map(function (imageExportOptions) { return ((0, jsx_runtime_1.jsx)(ChartsToolbarImageExportTrigger_1.ChartsToolbarImageExportTrigger, { render: (0, jsx_runtime_1.jsx)(MenuItem_1, __assign({ dense: true }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.baseMenuItem)), options: imageExportOptions, onClick: closeExportMenu_1, children: localeText.toolbarExportImage(imageExportOptions.type) }, imageExportOptions.type)); })] })) })] }, "export-menu"));
    }
    if (children.length === 0) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(Toolbar_1.Toolbar, __assign({}, other, { children: children }));
}
ChartsToolbarPro.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    imageExportOptions: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        copyStyles: prop_types_1.default.bool,
        fileName: prop_types_1.default.string,
        nonce: prop_types_1.default.string,
        onBeforeExport: prop_types_1.default.func,
        quality: prop_types_1.default.number,
        type: prop_types_1.default.string.isRequired,
    })),
    printOptions: prop_types_1.default.object,
};
function isHideMenuKey(key) {
    return key === 'Tab' || key === 'Escape';
}
