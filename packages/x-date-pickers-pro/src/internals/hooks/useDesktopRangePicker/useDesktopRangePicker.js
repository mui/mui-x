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
exports.useDesktopRangePicker = void 0;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var x_license_1 = require("@mui/x-license");
var PickersLayout_1 = require("@mui/x-date-pickers/PickersLayout");
var internals_1 = require("@mui/x-date-pickers/internals");
var useRangePosition_1 = require("../useRangePosition");
var usePickerRangePositionContext_1 = require("../../../hooks/usePickerRangePositionContext");
var date_fields_utils_1 = require("../../utils/date-fields-utils");
var createRangePickerStepNavigation_1 = require("../../utils/createRangePickerStepNavigation");
var useDesktopRangePicker = function (_a) {
    var _b;
    var props = _a.props, steps = _a.steps, pickerParams = __rest(_a, ["props", "steps"]);
    (0, x_license_1.useLicenseVerifier)('x-date-pickers-pro', '__RELEASE_INFO__');
    var slots = props.slots, slotProps = props.slotProps, inputRef = props.inputRef, localeText = props.localeText;
    var fieldType = (0, date_fields_utils_1.getRangeFieldType)(slots.field);
    var viewContainerRole = fieldType === 'single-input' ? 'dialog' : 'tooltip';
    var rangePositionResponse = (0, useRangePosition_1.useRangePosition)(props);
    var getStepNavigation = (0, createRangePickerStepNavigation_1.createRangePickerStepNavigation)({
        steps: steps,
        rangePositionResponse: rangePositionResponse,
    });
    var _c = (0, internals_1.usePicker)(__assign(__assign({}, pickerParams), { props: props, variant: 'desktop', autoFocusView: viewContainerRole === 'dialog', viewContainerRole: viewContainerRole, localeText: localeText, getStepNavigation: getStepNavigation, onPopperExited: (0, useEventCallback_1.default)(function () { var _a; return rangePositionResponse.setRangePosition((_a = props.defaultRangePosition) !== null && _a !== void 0 ? _a : 'start'); }) })), providerProps = _c.providerProps, renderCurrentView = _c.renderCurrentView, ownerState = _c.ownerState;
    var Field = slots.field;
    var _d = (0, useSlotProps_1.default)({
        elementType: Field,
        externalSlotProps: slotProps === null || slotProps === void 0 ? void 0 : slotProps.field,
        ownerState: ownerState,
        additionalProps: {
            'data-active-range-position': providerProps.contextValue.open
                ? rangePositionResponse.rangePosition
                : undefined,
        },
    }), fieldOwnerState = _d.ownerState, fieldProps = __rest(_d, ["ownerState"]);
    var Layout = (_b = slots === null || slots === void 0 ? void 0 : slots.layout) !== null && _b !== void 0 ? _b : PickersLayout_1.PickersLayout;
    var renderPicker = function () { return (<internals_1.PickerProvider {...providerProps}>
      <internals_1.PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <usePickerRangePositionContext_1.PickerRangePositionContext.Provider value={rangePositionResponse}>
          <Field {...fieldProps}/>
          <internals_1.PickerPopper slots={slots} slotProps={slotProps}>
            <Layout {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout} slots={slots} slotProps={slotProps}>
              {renderCurrentView()}
            </Layout>
          </internals_1.PickerPopper>
        </usePickerRangePositionContext_1.PickerRangePositionContext.Provider>
      </internals_1.PickerFieldUIContextProvider>
    </internals_1.PickerProvider>); };
    return {
        renderPicker: renderPicker,
    };
};
exports.useDesktopRangePicker = useDesktopRangePicker;
