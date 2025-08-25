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
exports.useStaticRangePicker = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var PickersLayout_1 = require("@mui/x-date-pickers/PickersLayout");
var internals_1 = require("@mui/x-date-pickers/internals");
var useRangePosition_1 = require("../useRangePosition");
var usePickerRangePositionContext_1 = require("../../../hooks/usePickerRangePositionContext");
var createRangePickerStepNavigation_1 = require("../../utils/createRangePickerStepNavigation");
var PickerStaticLayout = (0, styles_1.styled)(PickersLayout_1.PickersLayout)(function (_a) {
    var theme = _a.theme;
    return ({
        overflow: 'hidden',
        minWidth: internals_1.DIALOG_WIDTH,
        backgroundColor: (theme.vars || theme).palette.background.paper,
    });
});
/**
 * Hook managing all the range static pickers:
 * - StaticDateRangePicker
 */
var useStaticRangePicker = function (_a) {
    var _b;
    var props = _a.props, steps = _a.steps, pickerParams = __rest(_a, ["props", "steps"]);
    var localeText = props.localeText, slots = props.slots, slotProps = props.slotProps, displayStaticWrapperAs = props.displayStaticWrapperAs, autoFocus = props.autoFocus;
    var rangePositionResponse = (0, useRangePosition_1.useRangePosition)(props);
    var getStepNavigation = (0, createRangePickerStepNavigation_1.createRangePickerStepNavigation)({
        steps: steps,
        rangePositionResponse: rangePositionResponse,
    });
    var _c = (0, internals_1.usePicker)(__assign(__assign({}, pickerParams), { props: props, variant: displayStaticWrapperAs, autoFocusView: autoFocus !== null && autoFocus !== void 0 ? autoFocus : false, viewContainerRole: null, localeText: localeText, getStepNavigation: getStepNavigation })), providerProps = _c.providerProps, renderCurrentView = _c.renderCurrentView;
    var Layout = (_b = slots === null || slots === void 0 ? void 0 : slots.layout) !== null && _b !== void 0 ? _b : PickerStaticLayout;
    var renderPicker = function () {
        var _a, _b;
        return (<usePickerRangePositionContext_1.PickerRangePositionContext.Provider value={rangePositionResponse}>
      <internals_1.PickerProvider {...providerProps}>
        <Layout {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout} slots={slots} slotProps={slotProps} sx={(0, internals_1.mergeSx)(providerProps.contextValue.rootSx, (_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout) === null || _a === void 0 ? void 0 : _a.sx)} className={(0, clsx_1.default)(providerProps.contextValue.rootClassName, (_b = slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout) === null || _b === void 0 ? void 0 : _b.className)} ref={providerProps.contextValue.rootRef}>
          {renderCurrentView()}
        </Layout>
      </internals_1.PickerProvider>
    </usePickerRangePositionContext_1.PickerRangePositionContext.Provider>);
    };
    return { renderPicker: renderPicker };
};
exports.useStaticRangePicker = useStaticRangePicker;
