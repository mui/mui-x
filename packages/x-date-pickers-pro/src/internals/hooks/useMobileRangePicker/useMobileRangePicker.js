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
exports.useMobileRangePicker = void 0;
var React = require("react");
var useSlotProps_1 = require("@mui/utils/useSlotProps");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var resolveComponentProps_1 = require("@mui/utils/resolveComponentProps");
var x_license_1 = require("@mui/x-license");
var PickersLayout_1 = require("@mui/x-date-pickers/PickersLayout");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var useRangePosition_1 = require("../useRangePosition");
var usePickerRangePositionContext_1 = require("../../../hooks/usePickerRangePositionContext");
var date_fields_utils_1 = require("../../utils/date-fields-utils");
var createRangePickerStepNavigation_1 = require("../../utils/createRangePickerStepNavigation");
var useMobileRangePicker = function (_a) {
    var _b, _c, _d;
    var props = _a.props, steps = _a.steps, pickerParams = __rest(_a, ["props", "steps"]);
    (0, x_license_1.useLicenseVerifier)('x-date-pickers-pro', '__RELEASE_INFO__');
    var slots = props.slots, innerSlotProps = props.slotProps, label = props.label, inputRef = props.inputRef, localeText = props.localeText;
    var fieldType = (0, date_fields_utils_1.getRangeFieldType)(slots.field);
    var rangePositionResponse = (0, useRangePosition_1.useRangePosition)(props);
    var contextTranslations = (0, hooks_1.usePickerTranslations)();
    var getStepNavigation = (0, createRangePickerStepNavigation_1.createRangePickerStepNavigation)({
        steps: steps,
        rangePositionResponse: rangePositionResponse,
    });
    var _e = (0, internals_1.usePicker)(__assign(__assign({}, pickerParams), { props: props, variant: 'mobile', autoFocusView: true, viewContainerRole: 'dialog', localeText: localeText, getStepNavigation: getStepNavigation, onPopperExited: (0, useEventCallback_1.default)(function () { var _a; return rangePositionResponse.setRangePosition((_a = props.defaultRangePosition) !== null && _a !== void 0 ? _a : 'start'); }) })), providerProps = _e.providerProps, renderCurrentView = _e.renderCurrentView, ownerState = _e.ownerState;
    var labelId = providerProps.privateContextValue.labelId;
    var isToolbarHidden = (_c = (_b = innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.toolbar) === null || _b === void 0 ? void 0 : _b.hidden) !== null && _c !== void 0 ? _c : false;
    var Field = slots.field;
    var _f = (0, useSlotProps_1.default)({
        elementType: Field,
        externalSlotProps: innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.field,
        additionalProps: __assign({}, (fieldType === 'single-input' &&
            isToolbarHidden && {
            id: labelId,
        })),
        ownerState: ownerState,
    }), fieldOwnerState = _f.ownerState, fieldProps = __rest(_f, ["ownerState"]);
    var Layout = (_d = slots === null || slots === void 0 ? void 0 : slots.layout) !== null && _d !== void 0 ? _d : PickersLayout_1.PickersLayout;
    var finalLocaleText = __assign(__assign({}, contextTranslations), localeText);
    var labelledById = pickerParams.valueType === 'date-time'
        ? "".concat(labelId, "-start-toolbar ").concat(labelId, "-end-toolbar")
        : labelId;
    if (isToolbarHidden) {
        var labels = [];
        if (fieldType === 'multi-input') {
            if (finalLocaleText.start) {
                labels.push("".concat(labelId, "-start-label"));
            }
            if (finalLocaleText.end) {
                labels.push("".concat(labelId, "-end-label"));
            }
        }
        else if (label != null) {
            labels.push("".concat(labelId, "-label"));
        }
        labelledById = labels.length > 0 ? labels.join(' ') : undefined;
    }
    var slotProps = __assign(__assign(__assign({}, innerSlotProps), { toolbar: __assign(__assign({}, innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.toolbar), { titleId: labelId }), mobilePaper: __assign({ 'aria-labelledby': labelledById }, innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.mobilePaper) }), (fieldType === 'multi-input' && {
        textField: function (slotOwnerState) {
            return __assign(__assign({}, (0, resolveComponentProps_1.default)(innerSlotProps === null || innerSlotProps === void 0 ? void 0 : innerSlotProps.textField, slotOwnerState)), { id: "".concat(labelId, "-").concat(slotOwnerState.position) });
        },
    }));
    var renderPicker = function () { return (<internals_1.PickerProvider {...providerProps}>
      <internals_1.PickerFieldUIContextProvider slots={slots} slotProps={slotProps} inputRef={inputRef}>
        <usePickerRangePositionContext_1.PickerRangePositionContext.Provider value={rangePositionResponse}>
          <Field {...fieldProps}/>
          <internals_1.PickersModalDialog slots={slots} slotProps={slotProps}>
            <Layout {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.layout} slots={slots} slotProps={slotProps}>
              {renderCurrentView()}
            </Layout>
          </internals_1.PickersModalDialog>
        </usePickerRangePositionContext_1.PickerRangePositionContext.Provider>
      </internals_1.PickerFieldUIContextProvider>
    </internals_1.PickerProvider>); };
    return {
        renderPicker: renderPicker,
    };
};
exports.useMobileRangePicker = useMobileRangePicker;
