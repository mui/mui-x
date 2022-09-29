import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { DateTimeFieldProps } from './DateTimeField.types';
import { useDateTimeField } from './useDateTimeField';

type DateTimeFieldComponent = (<TDate>(
  props: DateTimeFieldProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DateTimeField = React.forwardRef(function DateTimeField<TDate>(
  inProps: DateTimeFieldProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiDateTimeField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const { inputRef: externalInputRef, ...inputProps } = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    externalForwardedProps: other,
    ownerState,
  }) as Omit<DateTimeFieldProps<TDate>, 'components' | 'componentsProps'>;

  const {
    ref: inputRef,
    onPaste,
    inputMode,
    ...fieldProps
  } = useDateTimeField<TDate, typeof inputProps>({
    props: inputProps,
    inputRef: externalInputRef,
  });

  return (
    <Input
      ref={ref}
      {...fieldProps}
      inputProps={{ ...fieldProps.inputProps, ref: inputRef, onPaste, inputMode }}
    />
  );
}) as DateTimeFieldComponent;
