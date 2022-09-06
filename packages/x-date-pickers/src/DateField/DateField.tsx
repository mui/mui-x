import * as React from 'react';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import DefaultInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import { useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/base/composeClasses';
import { useSlotProps } from '@mui/base/utils';

import { DateFieldProps, DateFieldOwnerState } from './DateField.types';
import { useDateField } from './useDateField';
import { getDateFieldUtilityClass } from './DateField.classes';

type DateFieldComponent = (<TInputDate, TDate = TInputDate>(
  props: DateFieldProps<TInputDate, TDate> & React.RefAttributes<HTMLInputElement>,
) => JSX.Element) & { propTypes?: any };

const DateFieldRoot = styled(FormControl, {
  name: 'MuiDateField',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({});

const DateFieldInput = styled(DefaultInput, {
  name: 'MuiDateField',
  slot: 'Input',
  overridesResolver: (props, styles) => styles.input,
})({});

const useUtilityClasses = <TInputDate, TDate>(
  ownerState: DateFieldOwnerState<TInputDate, TDate>,
) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    input: ['input'],
  };

  return composeClasses(slots, getDateFieldUtilityClass, classes);
};

export const DateField = React.forwardRef(function DateField<TInputDate, TDate = TInputDate>(
  inProps: DateFieldProps<TInputDate, TDate>,
  ref: React.Ref<HTMLInputElement>,
) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiDateField',
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
  const classes = useUtilityClasses(ownerState);

  const Root = components?.Root ?? DateFieldRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: componentsProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
    },
    className: classes.root,
    ownerState,
  });

  const Input = components?.Input ?? DateFieldInput;
  const inputProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps?.input,
    additionalProps: {
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
    className: classes.input,
    ownerState,
  });

  const {
    inputProps: { ref: inputRef, onClick, ...enrichedInputProps },
  } = useDateField<TInputDate, TDate, any>(inputProps);

  return (
    <Root {...rootProps}>
      <Input {...enrichedInputProps} inputProps={{ ref: inputRef, onClick }} />
    </Root>
  );
}) as DateFieldComponent;
