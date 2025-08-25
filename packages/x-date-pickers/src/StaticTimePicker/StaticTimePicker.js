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
exports.StaticTimePicker = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var shared_1 = require("../TimePicker/shared");
var timeViewRenderers_1 = require("../timeViewRenderers");
var valueManagers_1 = require("../internals/utils/valueManagers");
var useStaticPicker_1 = require("../internals/hooks/useStaticPicker");
var validation_1 = require("../validation");
/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [StaticTimePicker API](https://mui.com/x/api/date-pickers/static-time-picker/)
 */
var StaticTimePicker = React.forwardRef(function StaticTimePicker(inProps, ref) {
    var _a, _b, _c;
    var defaultizedProps = (0, shared_1.useTimePickerDefaultizedProps)(inProps, 'MuiStaticTimePicker');
    var displayStaticWrapperAs = (_a = defaultizedProps.displayStaticWrapperAs) !== null && _a !== void 0 ? _a : 'mobile';
    var ampmInClock = (_b = defaultizedProps.ampmInClock) !== null && _b !== void 0 ? _b : displayStaticWrapperAs === 'desktop';
    var viewRenderers = __assign({ hours: timeViewRenderers_1.renderTimeViewClock, minutes: timeViewRenderers_1.renderTimeViewClock, seconds: timeViewRenderers_1.renderTimeViewClock }, defaultizedProps.viewRenderers);
    // Props with the default values specific to the static variant
    var props = __assign(__assign({}, defaultizedProps), { viewRenderers: viewRenderers, displayStaticWrapperAs: displayStaticWrapperAs, ampmInClock: ampmInClock, slotProps: __assign(__assign({}, defaultizedProps.slotProps), { toolbar: __assign({ hidden: displayStaticWrapperAs === 'desktop', ampmInClock: ampmInClock }, (_c = defaultizedProps.slotProps) === null || _c === void 0 ? void 0 : _c.toolbar) }) });
    var renderPicker = (0, useStaticPicker_1.useStaticPicker)({
        ref: ref,
        props: props,
        valueManager: valueManagers_1.singleItemValueManager,
        valueType: 'time',
        validator: validation_1.validateTime,
        steps: null,
    }).renderPicker;
    return renderPicker();
});
exports.StaticTimePicker = StaticTimePicker;
StaticTimePicker.propTypes = {
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
     * If `true`, disable values before the current date for date components, time for time components and both for date time components.
     * @default false
     */
    disablePast: prop_types_1.default.bool,
    /**
     * Force static wrapper inner components to be rendered in mobile or desktop mode.
     * @default "mobile"
     */
    displayStaticWrapperAs: prop_types_1.default.oneOf(['desktop', 'mobile']),
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
     * Callback fired when component requests to be closed.
     * Can be fired when selecting (by default on `desktop` mode) or clearing a value.
     * @deprecated Please avoid using as it will be removed in next major version.
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
     * Callback fired on view change.
     * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
     * @param {TView} view The new view.
     */
    onViewChange: prop_types_1.default.func,
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
