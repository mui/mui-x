import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { MultiInputDateRangeFieldProps } from './MultiInputDateRangeField.types';
import { useMultiInputDateRangeField } from './useMultiInputDateRangeField';

const MultiInputDateRangeFieldRoot = styled(
  React.forwardRef((props, ref) => (
    <Stack ref={ref} {...props} spacing={2} direction="row" alignItems="center" />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputDateRangeFieldSeparator = styled(Typography, {
  name: 'MuiMultiInputDateRangeField',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({});

type MultiInputDateRangeFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: MultiInputDateRangeFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const MultiInputDateRangeField = React.forwardRef(function MultiInputDateRangeField<
  TInputDate,
  TDate = TInputDate,
>(inProps: MultiInputDateRangeFieldProps<TInputDate, TDate>, ref: React.Ref<HTMLInputElement>) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiMultiInputDateRangeField',
  });

  const {
    components,
    componentsProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    ...other
  } = themeProps;

  const ownerState = themeProps;

  const Root = components?.Root ?? MultiInputDateRangeFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: componentsProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
    },
    ownerState,
  });

  const Input = components?.Input ?? TextField;
  const startInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'start' },
  });
  const endInputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    ownerState: { ...ownerState, position: 'end' },
  });

  const Separator = components?.Separator ?? MultiInputDateRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: componentsProps?.separator,
    ownerState,
  });

  const {
    startDate: { onKeyDown: onStartInputKeyDown, ref: startInputRef, ...startDateProps },
    endDate: { onKeyDown: onEndInputKeyDown, ref: endInputRef, ...endDateProps },
  } = useMultiInputDateRangeField({
    props: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
    },
    startInputRef: startInputProps.ref,
    endInputRef: endInputProps.ref,
  });

  return (
    <Root {...rootProps}>
      <Input
        {...startDateProps}
        inputProps={{
          // ...startDateProps.inputProps,
          ref: startInputRef,
          onKeyDown: onStartInputKeyDown,
        }}
      />
      <Separator {...separatorProps} />
      <Input
        {...endDateProps}
        inputProps={{
          // ...endDateProps.inputProps,
          ref: endInputRef,
          onKeyDown: onEndInputKeyDown,
        }}
      />
    </Root>
  );
}) as MultiInputDateRangeFieldComponent;
