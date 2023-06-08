import * as React from 'react';

import { useSlotProps } from '@mui/base';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from './useField/useField.types';
import { FieldsTextFieldProps } from '../models';

type UseClearFieldProps<
  TFieldProps extends FieldsTextFieldProps & { focus?: boolean },
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlots extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
> = {
  clearable: boolean;
  fieldProps?: TFieldProps;
  InputProps: TInputProps;
  onClear: React.MouseEventHandler<HTMLButtonElement>;
  slots?: { [K in keyof TFieldSlots as Uncapitalize<K & string>]: TFieldSlots[K] };
  slotProps?: TFieldSlotsComponentsProps;
};

export const useClearField = <
  TFieldProps extends FieldsTextFieldProps & {
    focus?: boolean;
  },
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlotsComponents extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
>({
  clearable,
  fieldProps: forwardedFieldProps,
  InputProps: ForwardedInputProps,
  onClear,
  slots,
  slotProps,
}: UseClearFieldProps<
  TFieldProps,
  TInputProps,
  TFieldSlotsComponents,
  TFieldSlotsComponentsProps
>) => {
  const EndClearIcon = slots?.clearIcon ?? ClearIcon;
  const endClearIconProps = useSlotProps({
    elementType: ClearIcon,
    externalSlotProps: slotProps?.clearIcon,
    ownerState: {},
  });

  const InputProps = {
    ...ForwardedInputProps,
    endAdornment: clearable ? (
      <React.Fragment>
        <IconButton className="clearButton" onClick={onClear} tabIndex={-1}>
          <EndClearIcon fontSize="small" {...endClearIconProps} />
        </IconButton>
        {ForwardedInputProps?.endAdornment}
      </React.Fragment>
    ) : (
      ForwardedInputProps?.endAdornment
    ),
  };

  const fieldProps = {
    ...forwardedFieldProps,
    sx: {
      '& .clearButton': {
        visibility: forwardedFieldProps?.focused ? 'visible' : 'hidden',
      },

      '&:hover .clearButton': {
        visibility: 'visible',
      },
      ...forwardedFieldProps?.sx,
    },
  };

  return { InputProps, fieldProps };
};
