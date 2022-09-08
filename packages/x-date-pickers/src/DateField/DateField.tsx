import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { DateFieldProps } from './DateField.types';
import { useDateField } from './useDateField';

type DateFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: DateFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const DateField = React.forwardRef(function DateField<TInputDate, TDate = TInputDate>(
  inProps: DateFieldProps<TInputDate, TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiDateField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const { inputRef: externalInputRef, ...inputProps } = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    externalForwardedProps: other,
    ownerState,
  }) as Omit<DateFieldProps<TInputDate, TDate>, 'components' | 'componentsProps'>;

  const {
    onKeyDown,
    ref: inputRef,
    ...fieldProps
  } = useDateField<TInputDate, TDate, typeof inputProps>({
    props: inputProps,
    inputRef: externalInputRef,
  });

  return (
    <Input {...fieldProps} inputProps={{ ...fieldProps.inputProps, ref: inputRef, onKeyDown }} />
  );
}) as DateFieldComponent;
