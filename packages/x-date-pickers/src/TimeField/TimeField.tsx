import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { TimeFieldProps } from './TimeField.types';
import { useTimeField } from './useTimeField';

type TimeFieldComponent = (<TDate>(
  props: TimeFieldProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const TimeField = React.forwardRef(function TimeField<TDate>(
  inProps: TimeFieldProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiTimeField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const { inputRef: externalInputRef, ...inputProps } = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    externalForwardedProps: other,
    ownerState,
  }) as Omit<TimeFieldProps<TDate>, 'components' | 'componentsProps'>;

  const {
    ref: inputRef,
    onPaste,
    inputMode,
    ...fieldProps
  } = useTimeField<TDate, typeof inputProps>({
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
}) as TimeFieldComponent;
