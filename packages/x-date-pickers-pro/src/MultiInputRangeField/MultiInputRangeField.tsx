'use client';
import * as React from 'react';
import clsx from 'clsx';
import Stack, { StackProps } from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  convertFieldResponseIntoMuiTextFieldProps,
  useFieldOwnerState,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { MultiInputRangeFieldProps } from './MultiInputRangeField.types';
import {
  getMultiInputRangeFieldUtilityClass,
  MultiInputRangeFieldClasses,
} from './multiInputRangeFieldClasses';
import { useMultiInputRangeField } from './useMultiInputRangeField';
import { PickerAnyRangeManager } from '../internals/models/managers';

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

/**
 * @ignore - do not document.
 */
export const MultiInputRangeField = React.forwardRef(function MultiInputRangeField<
  TManager extends PickerAnyRangeManager,
>(inProps: MultiInputRangeFieldProps<TManager>, ref: React.Ref<HTMLDivElement>) {
  const { manager, ...props } = inProps;
  const themeProps = useThemeProps({
    props,
    name: 'MuiMultiInputRangeField',
  });

  const { internalProps, forwardedProps } = useSplitFieldProps(themeProps, manager.valueType);

  const {
    slots,
    slotProps,
    className,
    classes: classesProp,
    ...otherForwardedProps
  } = forwardedProps;

  const classes = useUtilityClasses(classesProp);
  const ownerState = useFieldOwnerState(internalProps as any);

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
  const startTextFieldProps = useSlotProps({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'start' },
  });
  const endTextFieldProps = useSlotProps({
    elementType: TextField,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...ownerState, position: 'end' },
  });

  const { startDate, endDate } = useMultiInputRangeField({
    manager,
    internalProps,
    startForwardedProps: startTextFieldProps,
    endForwardedProps: endTextFieldProps,
  });

  const Separator = slots?.separator ?? MultiInputRangeFieldSeparator;
  const separatorProps = useSlotProps({
    elementType: Separator,
    externalSlotProps: slotProps?.separator,
    additionalProps: {
      children: (internalProps as any).dateSeparator ?? '–',
    },
    ownerState,
    className: classes.separator,
  });

  const cleanStartDate = convertFieldResponseIntoMuiTextFieldProps(startDate);
  const cleanEndDate = convertFieldResponseIntoMuiTextFieldProps(endDate);

  return (
    <Root {...rootProps}>
      <TextField fullWidth {...cleanStartDate} />
      <Separator {...separatorProps} />
      <TextField fullWidth {...cleanEndDate} />
    </Root>
  );
} as any) as MultiInputRangeFieldComponent;
