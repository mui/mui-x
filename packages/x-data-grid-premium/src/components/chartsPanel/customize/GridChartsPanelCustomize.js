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
exports.GridChartsPanelCustomize = GridChartsPanelCustomize;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var system_1 = require("@mui/system");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useGridApiContext_1 = require("../../../hooks/utils/useGridApiContext");
var useGridRootProps_1 = require("../../../hooks/utils/useGridRootProps");
var useGridChartIntegration_1 = require("../../../hooks/utils/useGridChartIntegration");
var Collapsible_1 = require("../../collapsible/Collapsible");
var CollapsibleTrigger_1 = require("../../collapsible/CollapsibleTrigger");
var CollapsiblePanel_1 = require("../../collapsible/CollapsiblePanel");
var useGridChartsIntegration_1 = require("../../../hooks/features/chartsIntegration/useGridChartsIntegration");
var GridChartsPanelCustomizeRoot = (0, system_1.styled)(x_data_grid_pro_1.GridShadowScrollArea)({
    height: '100%',
});
var GridChartsPanelCustomizeSection = (0, system_1.styled)(Collapsible_1.Collapsible, {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelCustomizeSection',
})({
    margin: internals_1.vars.spacing(0.5, 1),
});
var GridChartsPanelCustomizePanel = (0, system_1.styled)(CollapsiblePanel_1.CollapsiblePanel, {
    name: 'MuiDataGrid',
    slot: 'chartsPanelSection',
})({
    display: 'flex',
    flexDirection: 'column',
    padding: internals_1.vars.spacing(2, 1.5),
    gap: internals_1.vars.spacing(3),
});
var GridChartsPanelCustomizePanelTitle = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ChartsPanelCustomizePanelTitle',
})({
    font: internals_1.vars.typography.font.body,
    fontWeight: internals_1.vars.typography.fontWeight.medium,
});
function GridChartsPanelCustomize(props) {
    var _a;
    var activeChartId = props.activeChartId, sections = props.sections;
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var _b = (0, useGridChartIntegration_1.useGridChartsIntegrationContext)(), chartStateLookup = _b.chartStateLookup, setChartState = _b.setChartState;
    var _c = (_a = chartStateLookup[activeChartId]) !== null && _a !== void 0 ? _a : useGridChartsIntegration_1.EMPTY_CHART_INTEGRATION_CONTEXT_STATE, chartType = _c.type, configuration = _c.configuration, dimensions = _c.dimensions, values = _c.values;
    var handleChange = function (field, value) {
        var _a;
        setChartState(activeChartId, __assign(__assign({}, configuration), { configuration: __assign(__assign({}, configuration), (_a = {}, _a[field] = value, _a)) }));
    };
    if (chartType === '') {
        return (0, jsx_runtime_1.jsx)(x_data_grid_pro_1.GridOverlay, { children: apiRef.current.getLocaleText('chartsChartNotSelected') });
    }
    return ((0, jsx_runtime_1.jsx)(GridChartsPanelCustomizeRoot, { children: sections.map(function (section, index) { return ((0, jsx_runtime_1.jsxs)(GridChartsPanelCustomizeSection, { initiallyOpen: index === 0, ownerState: rootProps, children: [(0, jsx_runtime_1.jsx)(CollapsibleTrigger_1.CollapsibleTrigger, { children: (0, jsx_runtime_1.jsx)(GridChartsPanelCustomizePanelTitle, { ownerState: rootProps, children: section.label }) }), (0, jsx_runtime_1.jsx)(GridChartsPanelCustomizePanel, { ownerState: rootProps, children: Object.entries(section.controls).map(function (_a) {
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        var key = _a[0], optRaw = _a[1];
                        var opt = optRaw;
                        var context = { configuration: configuration, dimensions: dimensions, values: values };
                        var isHidden = (_c = (_b = opt.isHidden) === null || _b === void 0 ? void 0 : _b.call(opt, context)) !== null && _c !== void 0 ? _c : false;
                        if (isHidden) {
                            return null;
                        }
                        var isDisabled = (_e = (_d = opt.isDisabled) === null || _d === void 0 ? void 0 : _d.call(opt, context)) !== null && _e !== void 0 ? _e : false;
                        if (opt.type === 'boolean') {
                            return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseSwitch, __assign({ checked: Boolean((_f = configuration[key]) !== null && _f !== void 0 ? _f : opt.default), onChange: function (event) {
                                    return handleChange(key, event.target.checked);
                                }, size: "small", label: opt.label, disabled: isDisabled }, (_g = rootProps.slotProps) === null || _g === void 0 ? void 0 : _g.baseSwitch), key));
                        }
                        if (opt.type === 'select') {
                            return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseSelect, __assign({ fullWidth: true, size: "small", label: opt.label, value: (_h = configuration[key]) !== null && _h !== void 0 ? _h : opt.default, onChange: function (event) {
                                    return handleChange(key, event.target.value);
                                }, disabled: isDisabled, slotProps: {
                                    htmlInput: __assign({}, opt.htmlAttributes),
                                } }, (_j = rootProps.slotProps) === null || _j === void 0 ? void 0 : _j.baseSelect, { children: (opt.options || []).map(function (option) { return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseSelectOption, { value: option.value, native: false, children: option.content }, option.value)); }) }), key));
                        }
                        // string or number
                        return ((0, jsx_runtime_1.jsx)(rootProps.slots.baseTextField, __assign({ "aria-label": opt.label, placeholder: opt.label, label: opt.label, type: opt.type === 'number' ? 'number' : 'text', size: "small", fullWidth: true, disabled: isDisabled, slotProps: {
                                htmlInput: __assign({}, opt.htmlAttributes),
                            } }, (_k = rootProps.slotProps) === null || _k === void 0 ? void 0 : _k.baseTextField, { value: ((_m = (_l = configuration[key]) !== null && _l !== void 0 ? _l : opt.default) !== null && _m !== void 0 ? _m : '').toString(), onChange: function (event) {
                                return handleChange(key, opt.type === 'number' ? Number(event.target.value) : event.target.value);
                            } }), key));
                    }) })] }, section.id)); }) }));
}
