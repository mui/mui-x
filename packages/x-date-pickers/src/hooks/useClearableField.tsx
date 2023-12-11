import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { ClearIcon } from '../icons';
import { FieldSlots, FieldSlotProps } from '../internals/hooks/useField/useField.types';
import { useLocaleText } from '../internals/hooks/useUtils';
import { FieldsTextFieldProps } from '../internals/models';

type UseClearableFieldProps<
  TFieldProps extends FieldsTextFieldProps,
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlots extends FieldSlots,
  TFieldSlotProps extends FieldSlotProps,
> = {
  clearable: boolean;
  fieldProps: TFieldProps;
  InputProps: TInputProps;
  onClear: React.MouseEventHandler<HTMLButtonElement>;
  slots?: { [K in keyof TFieldSlots as Uncapitalize<K & string>]: TFieldSlots[K] };
  slotProps?: TFieldSlotProps;
};

export const useClearableField = <
  TFieldProps extends FieldsTextFieldProps,
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlots extends FieldSlots,
  TFieldSlotProps extends FieldSlotProps,
>({
  clearable,
  fieldProps: forwardedFieldProps,
  InputProps: ForwardedInputProps,
  onClear,
  slots,
  slotProps,
}: UseClearableFieldProps<TFieldProps, TInputProps, TFieldSlots, TFieldSlotProps>) => {
  const localeText = useLocaleText();

  const IconButton = slots?.clearButton ?? MuiIconButton;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState, ...iconButtonProps } = useSlotProps({
    elementType: IconButton,
    externalSlotProps: slotProps?.clearButton,
    ownerState: {},
    className: 'clearButton',
    additionalProps: {
      title: localeText.fieldClearLabel,
    },
  });
  const EndClearIcon = slots?.clearIcon ?? ClearIcon;
  const endClearIconProps = useSlotProps({
    elementType: EndClearIcon,
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
          <IconButton {...iconButtonProps} onClick={onClear}>
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
    sx: [
      {
        '& .clearButton': {
          opacity: 1,
        },
        '@media (pointer: fine)': {
          '& .clearButton': {
            opacity: 0,
          },
          '&:hover, &:focus-within': {
            '.clearButton': {
              opacity: 1,
            },
          },
        },
      },
      ...(Array.isArray(forwardedFieldProps.sx)
        ? forwardedFieldProps.sx
        : [forwardedFieldProps.sx]),
    ],
  };

  return { InputProps, fieldProps };
};
