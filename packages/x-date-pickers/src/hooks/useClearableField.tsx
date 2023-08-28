import * as React from 'react';

import { useSlotProps } from '@mui/base/utils';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { ClearIcon } from '../icons';
import {
  FieldSlotsComponents,
  FieldSlotsComponentsProps,
  FieldsTextFieldProps,
} from '../internals';

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
}: UseClearableFieldProps<
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
        <InputAdornment
          position="end"
          sx={{ marginRight: ForwardedInputProps?.endAdornment ? -1 : -1.5 }}
        >
          <IconButton className="clearButton" onClick={onClear}>
            <EndClearIcon fontSize="small" {...endClearIconProps} />
          </IconButton>
        </InputAdornment>
        {ForwardedInputProps?.endAdornment}
      </React.Fragment>
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
