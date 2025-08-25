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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileTimePicker = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var resolveComponentProps_1 = require("@mui/utils/resolveComponentProps");
var refType_1 = require("@mui/utils/refType");
var valueManagers_1 = require("../internals/utils/valueManagers");
var TimeField_1 = require("../TimeField");
var shared_1 = require("../TimePicker/shared");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var validation_1 = require("../validation");
var useMobilePicker_1 = require("../internals/hooks/useMobilePicker");
var timeViewRenderers_1 = require("../timeViewRenderers");
var time_utils_1 = require("../internals/utils/time-utils");
/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [MobileTimePicker API](https://mui.com/x/api/date-pickers/mobile-time-picker/)
 */
var MobileTimePicker = React.forwardRef(function MobileTimePicker(inProps, ref) {
    var _a, _b;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    // Props with the default values common to all time pickers
    var defaultizedProps = (0, shared_1.useTimePickerDefaultizedProps)(inProps, 'MuiMobileTimePicker');
    var viewRenderers = __assign({ hours: timeViewRenderers_1.renderTimeViewClock, minutes: timeViewRenderers_1.renderTimeViewClock, seconds: timeViewRenderers_1.renderTimeViewClock }, defaultizedProps.viewRenderers);
    var ampmInClock = (_a = defaultizedProps.ampmInClock) !== null && _a !== void 0 ? _a : false;
    // Props with the default values specific to the mobile variant
    var props = __assign(__assign({}, defaultizedProps), { ampmInClock: ampmInClock, viewRenderers: viewRenderers, format: (0, time_utils_1.resolveTimeFormat)(adapter, defaultizedProps), slots: __assign({ field: TimeField_1.TimeField }, defaultizedProps.slots), slotProps: __assign(__assign({}, defaultizedProps.slotProps), { field: function (ownerState) {
                var _a;
                return (__assign(__assign({}, (0, resolveComponentProps_1.default)((_a = defaultizedProps.slotProps) === null || _a === void 0 ? void 0 : _a.field, ownerState)), (0, validation_1.extractValidationProps)(defaultizedProps)));
            }, toolbar: __assign({ hidden: false, ampmInClock: ampmInClock }, (_b = defaultizedProps.slotProps) === null || _b === void 0 ? void 0 : _b.toolbar) }) });
    var renderPicker = (0, useMobilePicker_1.useMobilePicker)({
        ref: ref,
        props: props,
        valueManager: valueManagers_1.singleItemValueManager,
        valueType: 'time',
        validator: validation_1.validateTime,
        steps: null,
    }).renderPicker;
    return renderPicker();
});
exports.MobileTimePicker = MobileTimePicker;
MobileTimePicker.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * 12h/24h view for hour selection clock.
     * @default adapter.is12HourCycleInCurrentLocale()
     */
    ampm: prop_types_1.default.bool,
    /**
     * Display ampm controls under the clock (instead of in the toolbar).
     * @default true on desktop, false on mobile
     */
    ampmInClock: prop_types_1.default.bool,
    /**
     * If `true`, the main element is focused during the first mount.
     * This main element is:
     * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
     * - the `input` element if there is a field rendered.
     */
    autoFocus: prop_types_1.default.bool,
    className: prop_types_1.default.string,
    /**
     * If `true`, the Picker will close after submitting the full date.
     * @default false
     */
    closeOnSelect: prop_types_1.default.bool,
    /**
     * The default value.
     * Used when the component is not controlled.
     */
    defaultValue: prop_types_1.default.object,
    /**
     * If `true`, the component is disabled.
     * When disabled, the value cannot be changed and no interaction is possible.
     * @default false
     */
    disabled: prop_types_1.default.bool,
    /**
     * If `true`, disable values after the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disableFuture: prop_types_1.default.bool,
    /**
     * Do not ignore date part when validating min/max time.
     * @default false
     */
    disableIgnoringDatePartForTimeValidation: prop_types_1.default.bool,
    /**
     * If `true`, the button to open the Picker will not be rendered (it will only render the field).
     * @deprecated Use the [field component](https://mui.com/x/react-date-pickers/fields/) instead.
     * @default false
     */
    disableOpenPicker: prop_types_1.default.bool,
    /**
     * If `true`, disable values before the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disablePast: prop_types_1.default.bool,
    /**
     * @default true
     */
    enableAccessibleFieldDOMStructure: prop_types_1.default.any,
    /**
     * Format of the date when rendered in the input(s).
     * Defaults to localized format based on the used `views`.
     */
    format: prop_types_1.default.string,
    /**
     * Density of the format when rendered in the input.
     * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
     * @default "dense"
     */
    formatDensity: prop_types_1.default.oneOf(['dense', 'spacious']),
    /**
     * Pass a ref to the `input` element.
     */
    inputRef: refType_1.default,
    /**
     * The label content.
     */
    label: prop_types_1.default.node,
    /**
     * Locale for components texts.
     * Allows overriding texts coming from `LocalizationProvider` and `theme`.
     */
    localeText: prop_types_1.default.object,
    /**
     * Maximal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    maxTime: prop_types_1.default.object,
    /**
     * Minimal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    minTime: prop_types_1.default.object,
    /**
     * Step over minutes.
     * @default 1
     */
    minutesStep: prop_types_1.default.number,
    /**
     * Name attribute used by the `input` element in the Field.
     */
    name: prop_types_1.default.string,
    /**
     * Callback fired when the value is accepted.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The value that was just accepted.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onAccept: prop_types_1.default.func,
    /**
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The new value.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onChange: prop_types_1.default.func,
    /**
     * Callback fired when the popup requests to be closed.
     * Use in controlled mode (see `open`).
     */
    onClose: prop_types_1.default.func,
    /**
     * Callback fired when the error associated with the current value changes.
     * When a validation error is detected, the `error` parameter contains a non-null value.
     * This can be used to render an appropriate form error.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @param {TError} error The reason why the current value is not valid.
     * @param {TValue} value The value associated with the error.
     */
    onError: prop_types_1.default.func,
    /**
     * Callback fired when the popup requests to be opened.
     * Use in controlled mode (see `open`).
     */
    onOpen: prop_types_1.default.func,
    /**
     * Callback fired when the selected sections change.
     * @param {FieldSelectedSections} newValue The new selected sections.
     */
    onSelectedSectionsChange: prop_types_1.default.func,
    /**
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
    /**
     * Control the popup or dialog open state.
     * @default false
     */
    open: prop_types_1.default.bool,
    /**
     * The default visible view.
     * Used when the component view is not controlled.
     * Must be a valid option from `views` list.
     */
    openTo: prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']),
    /**
     * Force rendering in particular orientation.
     */
    orientation: prop_types_1.default.oneOf(['landscape', 'portrait']),
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * If `true`, disable heavy animations.
     * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
     */
    reduceAnimations: prop_types_1.default.bool,
    /**
     * The date used to generate the new value when both `value` and `defaultValue` are empty.
     * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * The currently selected sections.
     * This prop accepts four formats:
     * 1. If a number is provided, the section at this index will be selected.
     * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
     * 3. If `"all"` is provided, all the sections will be selected.
     * 4. If `null` is provided, no section will be selected.
     * If not provided, the selected sections will be handled internally.
     */
    selectedSections: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf([
            'all',
            'day',
            'empty',
            'hours',
            'meridiem',
            'minutes',
            'month',
            'seconds',
            'weekDay',
            'year',
        ]),
        prop_types_1.default.number,
    ]),
    /**
     * Disable specific time.
     * @param {PickerValidDate} value The value to check.
     * @param {TimeView} view The clock type of the timeValue.
     * @returns {boolean} If `true` the time will be disabled.
     */
    shouldDisableTime: prop_types_1.default.func,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * Choose which timezone to use for the value.
     * Example: "default", "system", "UTC", "America/New_York".
     * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
     * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
     * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
     */
    timezone: prop_types_1.default.string,
    /**
     * The selected value.
     * Used when the component is controlled.
     */
    value: prop_types_1.default.object,
    /**
     * The visible view.
     * Used when the component view is controlled.
     * Must be a valid option from `views` list.
     */
    view: prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']),
    /**
     * Define custom view renderers for each section.
     * If `null`, the section will only have field editing.
     * If `undefined`, internally defined view will be used.
     */
    viewRenderers: prop_types_1.default.shape({
        hours: prop_types_1.default.func,
        minutes: prop_types_1.default.func,
        seconds: prop_types_1.default.func,
    }),
    /**
     * Available views.
     */
    views: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['hours', 'minutes', 'seconds']).isRequired),
};
