import * as React from 'react';

import { useSlotProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import MuiInputAdornment from '@mui/material/InputAdornment';
import { SxProps } from '@mui/system';
import { ClearIcon } from '../../icons';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from './useField/useField.types';
import { FieldsTextFieldProps } from '../models';

type UseClearableFieldProps<
  TFieldProps extends FieldsTextFieldProps,
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlots extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
> = {
  clearable: boolean;
  fieldProps: TFieldProps;
  InputProps: TInputProps;
  onClear: React.MouseEventHandler<HTMLButtonElement>;
  slots?: { [K in keyof TFieldSlots as Uncapitalize<K & string>]: TFieldSlots[K] };
  slotProps?: TFieldSlotsComponentsProps;
};

export const useClearableField = <
  TFieldProps extends FieldsTextFieldProps,
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

  const InputAdornment = slots?.inputAdornment ?? MuiInputAdornment;
  const inputAdornmentProps = useSlotProps({
    elementType: MuiInputAdornment,
    externalSlotProps: slotProps?.inputAdornment,
    ownerState: {},
  });

  const InputProps = {
    ...ForwardedInputProps,
    endAdornment: clearable ? (
      <InputAdornment {...inputAdornmentProps} position="end">
        <IconButton className="clearButton" onClick={onClear}>
          <EndClearIcon fontSize="small" {...endClearIconProps} />
        </IconButton>
        {ForwardedInputProps?.endAdornment}
      </InputAdornment>
    ) : (
      ForwardedInputProps?.endAdornment
    ),
  };

  const fieldProps: TFieldProps = {
    ...forwardedFieldProps,
    sx: {
      '& .clearButton': {
        visibility: 'visible',
      },
      '@media (pointer: fine)': {
        '& .clearButton': {
          visibility: 'hidden',
        },
        '&:hover, &:focus-within': {
          '.clearButton': {
            visibility: 'visible',
          },
        },
      },
      ...forwardedFieldProps.sx,
    },
  };

  return { InputProps, fieldProps };
};
