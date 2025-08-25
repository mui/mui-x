"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiInputRangeField = useMultiInputRangeField;
var internals_1 = require("@mui/x-date-pickers/internals");
var validation_1 = require("@mui/x-date-pickers/validation");
var useTextFieldProps_1 = require("./useTextFieldProps");
var useMultiInputRangeFieldSelectedSections_1 = require("./useMultiInputRangeFieldSelectedSections");
var useMultiInputRangeFieldRootProps_1 = require("./useMultiInputRangeFieldRootProps");
/**
 * Basic example:
 *
 * ```tsx
 * import Box from '@mui/material/Box';
 * import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
 * import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
 * import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
 *
 * function MultiInputField(props) {
 *   const manager = useDateRangeManager();
 *   const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
 *   const response = useMultiInputRangeField({
 *     manager,
 *     internalProps,
 *     startTextFieldProps: {},
 *     endTextFieldProps: {},
 *     rootProps: forwardedProps,
 *   });
 *
 *   return (
 *     <Box {...response.root}>
 *       <PickersTextField {...response.startTextField} />
 *       <span>{' – '}</span>
 *       <PickersTextField {...response.endTextField} />
 *     </Box>
 *   );
 * }
 * ```
 *
 * @param {UseMultiInputRangeFieldParameters<TManager, TTextFieldProps>} parameters The parameters of the hook.
 * @param {TManager} parameters.manager The manager of the field.
 * @param {PickerManagerFieldInternalProps<TManager>} parameters.internalProps The internal props of the field.
 * @param {TTextFieldProps} parameters.startForwardedProps The forwarded props of the start field.
 * @param {TTextFieldProps} parameters.endForwardedProps The forwarded props of the end field.
 * @returns {UseMultiInputRangeFieldReturnValue<TManager, TTextFieldProps>} The props to pass to the start and the end components.
 */
function useMultiInputRangeField(parameters) {
    var manager = parameters.manager, internalProps = parameters.internalProps, rootProps = parameters.rootProps, startTextFieldProps = parameters.startTextFieldProps, endTextFieldProps = parameters.endTextFieldProps;
    var internalPropsWithDefaults = (0, internals_1.useFieldInternalPropsWithDefaults)({
        manager: manager,
        internalProps: internalProps,
    });
    var valueProp = internalPropsWithDefaults.value, defaultValue = internalPropsWithDefaults.defaultValue, format = internalPropsWithDefaults.format, formatDensity = internalPropsWithDefaults.formatDensity, shouldRespectLeadingZeros = internalPropsWithDefaults.shouldRespectLeadingZeros, onChange = internalPropsWithDefaults.onChange, disabled = internalPropsWithDefaults.disabled, readOnly = internalPropsWithDefaults.readOnly, selectedSections = internalPropsWithDefaults.selectedSections, onSelectedSectionsChange = internalPropsWithDefaults.onSelectedSectionsChange, timezoneProp = internalPropsWithDefaults.timezone, enableAccessibleFieldDOMStructure = internalPropsWithDefaults.enableAccessibleFieldDOMStructure, autoFocus = internalPropsWithDefaults.autoFocus, referenceDate = internalPropsWithDefaults.referenceDate, unstableStartFieldRef = internalPropsWithDefaults.unstableStartFieldRef, unstableEndFieldRef = internalPropsWithDefaults.unstableEndFieldRef;
    var _a = (0, internals_1.useControlledValue)({
        name: 'useMultiInputRangeField',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDate,
        onChange: onChange,
        valueManager: manager.internal_valueManager,
    }), value = _a.value, handleValueChange = _a.handleValueChange, timezone = _a.timezone;
    var validation = (0, validation_1.useValidation)({
        props: internalPropsWithDefaults,
        value: value,
        timezone: timezone,
        validator: manager.validator,
        onError: internalPropsWithDefaults.onError,
    });
    var selectedSectionsResponse = (0, useMultiInputRangeFieldSelectedSections_1.useMultiInputRangeFieldSelectedSections)({
        selectedSections: selectedSections,
        onSelectedSectionsChange: onSelectedSectionsChange,
        unstableStartFieldRef: unstableStartFieldRef,
        unstableEndFieldRef: unstableEndFieldRef,
    });
    var sharedInternalProps = {
        disabled: disabled,
        readOnly: readOnly,
        timezone: timezone,
        format: format,
        formatDensity: formatDensity,
        shouldRespectLeadingZeros: shouldRespectLeadingZeros,
        enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
    };
    var rootResponse = (0, useMultiInputRangeFieldRootProps_1.useMultiInputRangeFieldRootProps)(rootProps);
    var startTextFieldResponse = (0, useTextFieldProps_1.useTextFieldProps)({
        valueType: manager.valueType,
        position: 'start',
        value: value,
        onChange: handleValueChange,
        autoFocus: autoFocus,
        validation: validation,
        forwardedProps: startTextFieldProps,
        selectedSectionProps: selectedSectionsResponse.start,
        sharedInternalProps: sharedInternalProps,
    });
    var endTextFieldResponse = (0, useTextFieldProps_1.useTextFieldProps)({
        valueType: manager.valueType,
        position: 'end',
        value: value,
        onChange: handleValueChange,
        autoFocus: autoFocus,
        validation: validation,
        forwardedProps: endTextFieldProps,
        selectedSectionProps: selectedSectionsResponse.end,
        sharedInternalProps: sharedInternalProps,
    });
    return {
        root: rootResponse,
        startTextField: startTextFieldResponse,
        endTextField: endTextFieldResponse,
        enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
    };
}
