"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiInputDateTimeRangeField = void 0;
var prop_types_1 = require("prop-types");
var managers_1 = require("../managers");
var createMultiInputRangeField_1 = require("../internals/utils/createMultiInputRangeField");
var multiInputDateTimeRangeFieldClasses_1 = require("./multiInputDateTimeRangeFieldClasses");
/**
 * Demos:
 *
 * - [DateTimeRangeField](http://mui.com/x/react-date-pickers/date-time-range-field/)
 * - [Fields](https://mui.com/x/react-date-pickers/fields/)
 *
 * API:
 *
 * - [MultiInputDateTimeRangeField API](https://mui.com/x/api/multi-input-date-time-range-field/)
 */
var MultiInputDateTimeRangeField = (0, createMultiInputRangeField_1.createMultiInputRangeField)({
    name: 'MuiMultiInputDateTimeRangeField',
    getUtilityClass: multiInputDateTimeRangeFieldClasses_1.getMultiInputDateTimeRangeFieldUtilityClass,
    useManager: managers_1.useDateTimeRangeManager,
});
exports.MultiInputDateTimeRangeField = MultiInputDateTimeRangeField;
MultiInputDateTimeRangeField.propTypes = {
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
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    component: prop_types_1.default.elementType,
    /**
     * String displayed between the start and the end dates.
     * @default "–"
     */
    dateSeparator: prop_types_1.default.string,
    /**
     * The default value. Use when the component is not controlled.
     */
    defaultValue: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * Defines the `flex-direction` style property.
     * It is applied for all screen sizes.
     * @default 'column'
     */
    direction: prop_types_1.default.oneOfType([
        prop_types_1.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
        prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])),
        prop_types_1.default.object,
    ]),
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
     * Add an element between each child.
     */
    divider: prop_types_1.default.node,
    /**
     * @default true
     */
    enableAccessibleFieldDOMStructure: prop_types_1.default.bool,
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
     * Maximal selectable date.
     * @default 2099-12-31
     */
    maxDate: prop_types_1.default.object,
    /**
     * Maximal selectable moment of time with binding to date, to set max time in each day use `maxTime`.
     */
    maxDateTime: prop_types_1.default.object,
    /**
     * Maximal selectable time.
     * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
     */
    maxTime: prop_types_1.default.object,
    /**
     * Minimal selectable date.
     * @default 1900-01-01
     */
    minDate: prop_types_1.default.object,
    /**
     * Minimal selectable moment of time with binding to date, to set min time in each day use `minTime`.
     */
    minDateTime: prop_types_1.default.object,
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
     * Callback fired when the value changes.
     * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
     * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
     * @param {TValue} value The new value.
     * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
     */
    onChange: prop_types_1.default.func,
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
     * Callback fired when the selected sections change.
     * @param {FieldSelectedSections} newValue The new selected sections.
     */
    onSelectedSectionsChange: prop_types_1.default.func,
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
    referenceDate: prop_types_1.default.oneOfType([prop_types_1.default.arrayOf(prop_types_1.default.object), prop_types_1.default.object]),
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
     * Disable specific date.
     *
     * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
     *
     * @param {PickerValidDate} day The date to test.
     * @param {string} position The date to test, 'start' or 'end'.
     * @returns {boolean} Returns `true` if the date should be disabled.
     */
    shouldDisableDate: prop_types_1.default.func,
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
     * Defines the space between immediate children.
     * @default 0
     */
    spacing: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string])),
        prop_types_1.default.number,
        prop_types_1.default.object,
        prop_types_1.default.string,
    ]),
    style: prop_types_1.default.object,
    /**
     * The system prop, which allows defining system overrides as well as additional CSS styles.
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
    unstableEndFieldRef: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object]),
    unstableStartFieldRef: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object]),
    /**
     * If `true`, the CSS flexbox `gap` is used instead of applying `margin` to children.
     *
     * While CSS `gap` removes the [known limitations](https://mui.com/joy-ui/react-stack/#limitations),
     * it is not fully supported in some browsers. We recommend checking https://caniuse.com/?search=flex%20gap before using this flag.
     *
     * To enable this flag globally, follow the [theme's default props](https://mui.com/material-ui/customization/theme-components/#default-props) configuration.
     * @default false
     */
    useFlexGap: prop_types_1.default.bool,
    /**
     * The selected value.
     * Used when the component is controlled.
     */
    value: prop_types_1.default.arrayOf(prop_types_1.default.object),
};
