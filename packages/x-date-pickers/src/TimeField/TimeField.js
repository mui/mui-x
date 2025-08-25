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
exports.TimeField = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var refType_1 = require("@mui/utils/refType");
var useTimeField_1 = require("./useTimeField");
var PickerFieldUI_1 = require("../internals/components/PickerFieldUI");
var icons_1 = require("../icons");
/**
 * Demos:
 *
 * - [TimeField](http://mui.com/x/react-date-pickers/time-field/)
 * - [Fields](https://mui.com/x/react-date-pickers/fields/)
 *
 * API:
 *
 * - [TimeField API](https://mui.com/x/api/date-pickers/time-field/)
 */
var TimeField = React.forwardRef(function TimeField(inProps, inRef) {
    var themeProps = (0, styles_1.useThemeProps)({
        props: inProps,
        name: 'MuiTimeField',
    });
    var slots = themeProps.slots, slotProps = themeProps.slotProps, InputProps = themeProps.InputProps, inputProps = themeProps.inputProps, other = __rest(themeProps, ["slots", "slotProps", "InputProps", "inputProps"]);
    var textFieldProps = (0, PickerFieldUI_1.useFieldTextFieldProps)({
        slotProps: slotProps,
        ref: inRef,
        externalForwardedProps: other,
    });
    var fieldResponse = (0, useTimeField_1.useTimeField)(textFieldProps);
    return (<PickerFieldUI_1.PickerFieldUI slots={slots} slotProps={slotProps} fieldResponse={fieldResponse} defaultOpenPickerIcon={icons_1.ClockIcon}/>);
});
exports.TimeField = TimeField;
TimeField.propTypes = {
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
     * If `true`, the `input` element is focused during the first mount.
     * @default false
     */
    autoFocus: prop_types_1.default.bool,
    className: prop_types_1.default.string,
    /**
     * If `true`, a clear button will be shown in the field allowing value clearing.
     * @default false
     */
    clearable: prop_types_1.default.bool,
    /**
     * The position at which the clear button is placed.
     * If the field is not clearable, the button is not rendered.
     * @default 'end'
     */
    clearButtonPosition: prop_types_1.default.oneOf(['end', 'start']),
    /**
     * The color of the component.
     * It supports both default and custom theme colors, which can be added as shown in the
     * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
     * @default 'primary'
     */
    color: prop_types_1.default.oneOf(['error', 'info', 'primary', 'secondary', 'success', 'warning']),
    component: prop_types_1.default.elementType,
    /**
     * The default value. Use when the component is not controlled.
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
     * @default true
     */
    enableAccessibleFieldDOMStructure: prop_types_1.default.bool,
    /**
     * If `true`, the component is displayed in focused state.
     */
    focused: prop_types_1.default.bool,
    /**
     * Format of the date when rendered in the input(s).
     */
    format: prop_types_1.default.string,
    /**
     * Density of the format when rendered in the input.
     * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
     * @default "dense"
     */
    formatDensity: prop_types_1.default.oneOf(['dense', 'spacious']),
    /**
     * Props applied to the [`FormHelperText`](https://mui.com/material-ui/api/form-helper-text/) element.
     * @deprecated Use `slotProps.formHelperText` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
     */
    FormHelperTextProps: prop_types_1.default.object,
    /**
     * If `true`, the input will take up the full width of its container.
     * @default false
     */
    fullWidth: prop_types_1.default.bool,
    /**
     * The helper text content.
     */
    helperText: prop_types_1.default.node,
    /**
     * If `true`, the label is hidden.
     * This is used to increase density for a `FilledInput`.
     * Be sure to add `aria-label` to the `input` element.
     * @default false
     */
    hiddenLabel: prop_types_1.default.bool,
    /**
     * The id of the `input` element.
     * Use this prop to make `label` and `helperText` accessible for screen readers.
     */
    id: prop_types_1.default.string,
    /**
     * Props applied to the [`InputLabel`](https://mui.com/material-ui/api/input-label/) element.
     * Pointer events like `onClick` are enabled if and only if `shrink` is `true`.
     * @deprecated Use `slotProps.inputLabel` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
     */
    InputLabelProps: prop_types_1.default.object,
    /**
     * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#attributes) applied to the `input` element.
     * @deprecated Use `slotProps.htmlInput` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
     */
    inputProps: prop_types_1.default.object,
    /**
     * Props applied to the Input element.
     * It will be a [`FilledInput`](https://mui.com/material-ui/api/filled-input/),
     * [`OutlinedInput`](https://mui.com/material-ui/api/outlined-input/) or [`Input`](https://mui.com/material-ui/api/input/)
     * component depending on the `variant` prop value.
     * @deprecated Use `slotProps.input` instead. This prop will be removed in a future major release. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
     */
    InputProps: prop_types_1.default.object,
    /**
     * Pass a ref to the `input` element.
     */
    inputRef: refType_1.default,
    /**
     * The label content.
     */
    label: prop_types_1.default.node,
    /**
     * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
     * @default 'none'
     */
    margin: prop_types_1.default.oneOf(['dense', 'none', 'normal']),
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
     * Name attribute of the `input` element.
     */
    name: prop_types_1.default.string,
    onBlur: prop_types_1.default.func,
    /**
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The new value.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onChange: prop_types_1.default.func,
    /**
     * Callback fired when the clear button is clicked.
     */
    onClear: prop_types_1.default.func,
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
    onFocus: prop_types_1.default.func,
    /**
     * Callback fired when the selected sections change.
     * @param {FieldSelectedSections} newValue The new selected sections.
     */
    onSelectedSectionsChange: prop_types_1.default.func,
    /**
     * The position at which the opening button is placed.
     * If there is no Picker to open, the button is not rendered
     * @default 'end'
     */
    openPickerButtonPosition: prop_types_1.default.oneOf(['end', 'start']),
    /**
     * If `true`, the component is read-only.
     * When read-only, the value cannot be changed but the user can interact with the interface.
     * @default false
     */
    readOnly: prop_types_1.default.bool,
    /**
     * The date used to generate a part of the new value that is not present in the format when both `value` and `defaultValue` are empty.
     * For example, on time fields it will be used to determine the date to set.
     * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`. Value is rounded to the most granular section used.
     */
    referenceDate: prop_types_1.default.object,
    /**
     * If `true`, the label is displayed as required and the `input` element is required.
     * @default false
     */
    required: prop_types_1.default.bool,
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
     * If `true`, the format will respect the leading zeroes (for example on dayjs, the format `M/D/YYYY` will render `8/16/2018`)
     * If `false`, the format will always add leading zeroes (for example on dayjs, the format `M/D/YYYY` will render `08/16/2018`)
     *
     * Warning n°1: Luxon is not able to respect the leading zeroes when using macro tokens (for example "DD"), so `shouldRespectLeadingZeros={true}` might lead to inconsistencies when using `AdapterLuxon`.
     *
     * Warning n°2: When `shouldRespectLeadingZeros={true}`, the field will add an invisible character on the sections containing a single digit to make sure `onChange` is fired.
     * If you need to get the clean value from the input, you can remove this character using `input.value.replace(/\u200e/g, '')`.
     *
     * Warning n°3: When used in strict mode, dayjs and moment require to respect the leading zeros.
     * This mean that when using `shouldRespectLeadingZeros={false}`, if you retrieve the value directly from the input (not listening to `onChange`) and your format contains tokens without leading zeros, the value will not be parsed by your library.
     *
     * @default false
     */
    shouldRespectLeadingZeros: prop_types_1.default.bool,
    /**
     * The size of the component.
     * @default 'medium'
     */
    size: prop_types_1.default.oneOf(['medium', 'small']),
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
    style: prop_types_1.default.object,
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
     * The ref object used to imperatively interact with the field.
     */
    unstableFieldRef: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object]),
    /**
     * The selected value.
     * Used when the component is controlled.
     */
    value: prop_types_1.default.object,
    /**
     * The variant to use.
     * @default 'outlined'
     */
    variant: prop_types_1.default.oneOf(['filled', 'outlined', 'standard']),
};
