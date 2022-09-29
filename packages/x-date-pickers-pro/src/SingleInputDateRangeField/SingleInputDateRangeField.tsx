import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useThemeProps } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { SingleInputDateRangeFieldProps } from './SingleInputDateRangeField.types';
import { useSingleInputDateRangeField } from './useSingleInputDateRangeField';

type DateRangeFieldComponent = (<TDate>(
  props: SingleInputDateRangeFieldProps<TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

export const SingleInputDateRangeField = React.forwardRef(function SingleInputDateRangeField<TDate>(
  inProps: SingleInputDateRangeFieldProps<TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiSingleInputDateRangeField',
  });

  const { components, componentsProps, ...other } = themeProps;

  const ownerState = themeProps;

  const Input = components?.Input ?? TextField;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    externalForwardedProps: other,
    ownerState,
  }) as Omit<SingleInputDateRangeFieldProps<TDate>, 'components' | 'componentsProps'>;

  const {
    onKeyDown,
    ref: inputRef,
    ...fieldProps
  } = useSingleInputDateRangeField<TDate, typeof inputProps>({
    props: inputProps,
    inputRef: inputProps.inputRef,
  });

  return (
    <Input
      ref={ref}
      {...fieldProps}
      inputProps={{ ...fieldProps.inputProps, ref: inputRef, onKeyDown }}
    />
  );
}) as DateRangeFieldComponent;
