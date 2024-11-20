'use client';
import * as React from 'react';
import clsx from 'clsx';
import Stack, { StackProps } from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerAnyRangeManager,
  PickerManagerError,
  PickerRangeValue,
  PickerValue,
  useControlledValueWithTimezone,
  useFieldInternalPropsWithDefaults,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import { useValidation } from '@mui/x-date-pickers/validation';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { RangePosition } from '../../../models';
import {
  MultiInputRangeFieldProps,
  MultiInputRangeFieldSlotProps,
} from './MultiInputRangeField.types';
import {
  getMultiInputRangeFieldUtilityClass,
  MultiInputRangeFieldClasses,
} from './multiInputRangeFieldClasses';
import { useMultiInputRangeFieldSelectedSections } from './useMultiInputRangeFieldSelectedSections';
import { useMultiInputRangeFieldTextFieldProps } from './useMultiInputRangeFieldTextFieldProps';

const useUtilityClasses = (classes: Partial<MultiInputRangeFieldClasses> | undefined) => {
  const slots = {
    root: ['root'],
    separator: ['separator'],
  };

  return composeClasses(slots, getMultiInputRangeFieldUtilityClass, classes);
};

const MultiInputRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} spacing={2} direction="row" alignItems="center" {...props} />
  )),
  {
    name: 'MuiMultiInputRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputRangeFieldSeparator = styled(Typography, {
  name: 'MultiInputRangeField',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({
  lineHeight: '1.4375em', // 23px
});

type MultiInputRangeFieldComponent = (<TManager extends PickerAnyRangeManager>(
  props: MultiInputRangeFieldProps<TManager> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const MultiInputRangeField = React.forwardRef(function MultiInputRangeField<
  TManager extends PickerAnyRangeManager,
>(inProps: MultiInputRangeFieldProps<TManager>, ref: React.Ref<HTMLDivElement>) {
  type TError = PickerManagerError<TManager>;

  const { manager, ...props } = inProps;
  const themeProps = useThemeProps({
    props,
    name: 'MuiMultiInputRangeField',
  });

  const { internalProps, forwardedProps } = useSplitFieldProps(themeProps, manager.valueType);

  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
  });

  const {
    value: valueProp,
    defaultValue,
    format,
    formatDensity,
    shouldRespectLeadingZeros,
    onChange,
    disabled,
    readOnly,
    selectedSections,
    onSelectedSectionsChange,
    timezone: timezoneProp,
    enableAccessibleFieldDOMStructure,
    autoFocus,
  } = internalPropsWithDefaults;

  const {
    slots,
    slotProps,
    unstableStartFieldRef,
    unstableEndFieldRef,
    className,
    classes: classesProp,
    ...otherForwardedProps
  } = forwardedProps;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'useMultiInputDateRangeField',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: manager.internal_valueManager,
  });

  const { validationError, getValidationErrorForNewValue } = useValidation({
    props: internalPropsWithDefaults,
    value,
    timezone,
    validator: manager.validator,
    onError: internalPropsWithDefaults.onError,
  });

  // TODO: Maybe export utility from `useField` instead of copy/pasting the logic
  const buildChangeHandler = (index: 0 | 1): FieldChangeHandler<PickerValue, unknown> => {
    return (newDate, rawContext) => {
      const newDateRange: PickerRangeValue =
        index === 0 ? [newDate, value[1]] : [value[0], newDate];

      const context: FieldChangeHandlerContext<TError> = {
        ...rawContext,
        validationError: getValidationErrorForNewValue(newDateRange),
      };

      handleValueChange(newDateRange, context);
    };
  };

  const handleStartDateChange = useEventCallback(buildChangeHandler(0));
  const handleEndDateChange = useEventCallback(buildChangeHandler(1));

  const selectedSectionsResponse = useMultiInputRangeFieldSelectedSections({
    selectedSections,
    onSelectedSectionsChange,
    unstableStartFieldRef,
    unstableEndFieldRef,
  });

  const { ownerState } = usePickerPrivateContext();
  const classes = useUtilityClasses(classesProp);

  const Root = slots?.root ?? MultiInputRangeFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherForwardedProps,
    additionalProps: {
      ref,
    },
    ownerState,
    className: clsx(className, classes.root),
  });

  const TextField =
    slots?.textField ??
    (inProps.enableAccessibleFieldDOMStructure === false ? MuiTextField : PickersTextField);
  const startTextFieldProps = useSlotProps<
    typeof TextField,
    MultiInputRangeFieldSlotProps['textField'],
    {},
    PickerOwnerState & {
      position: RangePosition;
    }
  >({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'start' },
  });
  const endTextFieldProps = useSlotProps<
    typeof TextField,
    MultiInputRangeFieldSlotProps['textField'],
    {},
    PickerOwnerState & {
      position: RangePosition;
    }
  >({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'end' },
  });

  const Separator = slots?.separator ?? MultiInputRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: slotProps?.separator,
    additionalProps: {
      children: ` ${internalProps.dateSeparator ?? '–'} `,
    },
    ownerState,
    className: classes.separator,
  });

  const startDateProps = useMultiInputRangeFieldTextFieldProps({
    valueType: manager.valueType,
    fieldProps: {
      error: !!validationError[0],
      ...startTextFieldProps,
      ...selectedSectionsResponse.start,
      disabled,
      readOnly,
      format,
      formatDensity,
      shouldRespectLeadingZeros,
      timezone,
      value: valueProp === undefined ? undefined : valueProp[0],
      defaultValue: defaultValue === undefined ? undefined : defaultValue[0],
      onChange: handleStartDateChange,
      enableAccessibleFieldDOMStructure,
      autoFocus, // Do not add on end field.
    },
  });

  const endDateProps = useMultiInputRangeFieldTextFieldProps({
    valueType: manager.valueType,
    fieldProps: {
      error: !!validationError[1],
      ...endTextFieldProps,
      ...selectedSectionsResponse.end,
      format,
      formatDensity,
      shouldRespectLeadingZeros,
      disabled,
      readOnly,
      timezone,
      value: valueProp === undefined ? undefined : valueProp[1],
      defaultValue: defaultValue === undefined ? undefined : defaultValue[1],
      onChange: handleEndDateChange,
      enableAccessibleFieldDOMStructure,
    },
  });

  return (
    <Root {...rootProps}>
      <TextField fullWidth {...startDateProps} />
      <Separator {...separatorProps} />
      <TextField fullWidth {...endDateProps} />
    </Root>
  );
}) as MultiInputRangeFieldComponent;
