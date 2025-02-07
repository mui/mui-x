'use client';
import * as React from 'react';
import clsx from 'clsx';
import Stack, { StackProps } from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import {
  cleanFieldResponse,
  useFieldOwnerState,
  useNullablePickerContext,
} from '@mui/x-date-pickers/internals';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import {
  CreateMultiInputRangeFieldParameters,
  CreateMultiInputRangeFieldReturnValue,
  MultiInputRangeFieldProps,
} from './createMultiInputRangeField.types';
import { useMultiInputRangeField } from '../../../hooks/useMultiInputRangeField';
import { PickerAnyRangeManager } from '../../models/managers';

export function createMultiInputRangeField<TManager extends PickerAnyRangeManager>({
  useManager,
  name,
  getUtilityClass,
}: CreateMultiInputRangeFieldParameters<TManager>): CreateMultiInputRangeFieldReturnValue<TManager> {
  const useUtilityClasses = (classes: MultiInputRangeFieldProps<TManager>['classes']) => {
    const slots = {
      root: ['root'],
      separator: ['separator'],
    };

    return composeClasses(slots, getUtilityClass, classes);
  };

  const MultiInputRangeFieldRoot = styled(
    React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
      <Stack ref={ref} spacing={2} direction="row" alignItems="baseline" {...props} />
    )),
    {
      name,
      slot: 'Root',
      overridesResolver: (props, styles) => styles.root,
    },
  )({});

  const MultiInputRangeFieldSeparator = styled(Typography, {
    name,
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  })({
    lineHeight: '1.4375em', // 23px
  });

  const MultiInputRangeField = React.forwardRef(function MultiInputRangeField(
    props: MultiInputRangeFieldProps<TManager>,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const themeProps = useThemeProps({
      props,
      // eslint-disable-next-line material-ui/mui-name-matches-component-name
      name,
    });

    const manager = useManager({
      enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
      dateSeparator: props.dateSeparator,
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
    const pickerContext = useNullablePickerContext();
    const handleRef = useForkRef(ref, pickerContext?.rootRef);

    const Root = slots?.root ?? MultiInputRangeFieldRoot;
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps?.root,
      externalForwardedProps: otherForwardedProps,
      additionalProps: { ref: handleRef },
      ownerState,
      className: clsx(className, classes.root),
    });

    const startTextFieldProps = useSlotProps({
      elementType: PickersTextField,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...ownerState, position: 'start' },
    });
    const endTextFieldProps = useSlotProps({
      elementType: PickersTextField,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...ownerState, position: 'end' },
    });

    const { startDate, endDate, enableAccessibleFieldDOMStructure } = useMultiInputRangeField({
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
        children: internalProps.dateSeparator ?? '–',
      },
      ownerState,
      className: classes.separator,
    });

    const { textFieldProps: startDateProps } = cleanFieldResponse(startDate);
    const { textFieldProps: endDateProps } = cleanFieldResponse(endDate);

    const TextField =
      slots?.textField ??
      (enableAccessibleFieldDOMStructure === false ? MuiTextField : PickersTextField);

    return (
      <Root {...rootProps}>
        <TextField fullWidth {...startDateProps} />
        <Separator {...separatorProps} />
        <TextField fullWidth {...endDateProps} />
      </Root>
    );
  } as any) as any;

  MultiInputRangeField.fieldType = 'multi-input';

  return MultiInputRangeField;
}
