import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { ClearIcon } from '../icons';
import {
  FieldSlotsComponents,
  FieldSlotsComponentsProps,
  FieldsTextFieldProps,
  useLocaleText,
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
  components?: TFieldSlots;
  componentsProps?: TFieldSlotsComponentsProps;
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
  components,
  componentsProps,
}: UseClearableFieldProps<
  TFieldProps,
  TInputProps,
  TFieldSlotsComponents,
  TFieldSlotsComponentsProps
>) => {
  const localeText = useLocaleText();

  const IconButton = slots?.clearButton ?? components?.ClearButton ?? MuiIconButton;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState, ...iconButtonProps } = useSlotProps({
    elementType: IconButton,
    externalSlotProps: slotProps?.clearButton ?? componentsProps?.clearButton,
    ownerState: {},
    className: 'clearButton',
    additionalProps: {
      title: localeText.fieldClearLabel,
    },
  });
  const EndClearIcon = slots?.clearIcon ?? components?.ClearIcon ?? ClearIcon;
  const endClearIconProps = useSlotProps({
    elementType: EndClearIcon,
    externalSlotProps: slotProps?.clearIcon ?? componentsProps?.clearIcon,
    ownerState: {},
  });

  const InputProps = {
    ...ForwardedInputProps,
    endAdornment: (
      <React.Fragment>
        {clearable && (
          <InputAdornment
            position="end"
            sx={{ marginRight: ForwardedInputProps?.endAdornment ? -1 : -1.5 }}
          >
            <IconButton {...iconButtonProps} onClick={onClear}>
              <EndClearIcon fontSize="small" {...endClearIconProps} />
            </IconButton>
          </InputAdornment>
        )}
        {ForwardedInputProps?.endAdornment}
      </React.Fragment>
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
