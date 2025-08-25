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
exports.useDesktopPicker = void 0;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var PickerPopper_1 = require("../../components/PickerPopper/PickerPopper");
var usePicker_1 = require("../usePicker");
var PickersLayout_1 = require("../../../PickersLayout");
var PickerProvider_1 = require("../../components/PickerProvider");
var PickerFieldUI_1 = require("../../components/PickerFieldUI");
var createNonRangePickerStepNavigation_1 = require("../../utils/createNonRangePickerStepNavigation");
/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
var useDesktopPicker = function (_a) {
    var _b, _c, _d;
    var props = _a.props, steps = _a.steps, pickerParams = __rest(_a, ["props", "steps"]);
    var slots = props.slots, innerSlotProps = props.slotProps, label = props.label, inputRef = props.inputRef, localeText = props.localeText;
    var getStepNavigation = (0, createNonRangePickerStepNavigation_1.createNonRangePickerStepNavigation)({ steps: steps });
    var _e = (0, usePicker_1.usePicker)(__assign(__assign({}, pickerParams), { props: props, localeText: localeText, autoFocusView: true, viewContainerRole: 'dialog', variant: 'desktop', getStepNavigation: getStepNavigation })), providerProps = _e.providerProps, renderCurrentView = _e.renderCurrentView, ownerState = _e.ownerState;
    var labelId = providerProps.privateContextValue.labelId;
    var isToolbarHidden = (_c = (_b = innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.toolbar) === null || _b === void 0 ? void 0 : _b.hidden) !== null && _c !== void 0 ? _c : false;
    var Field = slots.field;
    var _f = (0, useSlotProps_1.default)({
        elementType: Field,
        externalSlotProps: innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.field,
        additionalProps: __assign({}, (isToolbarHidden && { id: labelId })),
        ownerState: ownerState,
    }), fieldOwnerState = _f.ownerState, fieldProps = __rest(_f, ["ownerState"]);
    var Layout = (_d = slots.layout) !== null && _d !== void 0 ? _d : PickersLayout_1.PickersLayout;
    var labelledById = labelId;
    if (isToolbarHidden) {
        if (label) {
            labelledById = "".concat(labelId, "-label");
        }
        else {
            labelledById = undefined;
        }
    }
    var slotProps = __assign(__assign({}, innerSlotProps), { toolbar: __assign(__assign({}, innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.toolbar), { titleId: labelId }), popper: __assign({ 'aria-labelledby': labelledById }, innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.popper) });
    var renderPicker = function () { return (<PickerProvider_1.PickerProvider {...providerProps}>
      <PickerFieldUI_1.PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <Field {...fieldProps}/>
        <PickerPopper_1.PickerPopper slots={slots} slotProps={slotProps}>
          <Layout {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickerPopper_1.PickerPopper>
      </PickerFieldUI_1.PickerFieldUIContextProvider>
    </PickerProvider_1.PickerProvider>); };
    return { renderPicker: renderPicker };
};
exports.useDesktopPicker = useDesktopPicker;
