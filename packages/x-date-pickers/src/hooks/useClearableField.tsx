import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { ClearIcon } from '../icons';
import { FieldSlotsComponents, FieldSlotsComponentsProps, useLocaleText } from '../internals';

interface UseClearableFieldProps {
  clearable: boolean;
  onClear: React.MouseEventHandler<HTMLButtonElement>;
  InputProps?: { endAdornment?: React.ReactNode };
  sx?: SxProps<Theme>;
}

type UseClearableFieldParams<
  TFieldProps extends UseClearableFieldProps,
  TFieldSlots extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
> = {
  props: TFieldProps;
  slots?: { [K in keyof TFieldSlots as Uncapitalize<K & string>]: TFieldSlots[K] };
  slotProps?: TFieldSlotsComponentsProps;
};

export const useClearableField = <
  TFieldProps extends UseClearableFieldProps,
  TFieldSlotsComponents extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
>({
  props,
  slots,
  slotProps,
}: UseClearableFieldParams<TFieldProps, TFieldSlotsComponents, TFieldSlotsComponentsProps>): Omit<
  TFieldProps,
  'clearable' | 'onClear'
> => {
  const localeText = useLocaleText();

  const { clearable, onClear, InputProps, sx, ...other } = props;

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

  return {
    ...other,
    InputProps: {
      ...InputProps,
      endAdornment: clearable ? (
        <React.Fragment>
          <InputAdornment position="end" sx={{ marginRight: InputProps?.endAdornment ? -1 : -1.5 }}>
            <IconButton {...iconButtonProps} onClick={onClear}>
              <EndClearIcon fontSize="small" {...endClearIconProps} />
            </IconButton>
          </InputAdornment>
          {InputProps?.endAdornment}
        </React.Fragment>
      ) : (
        InputProps?.endAdornment
      ),
    },
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
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
  } as unknown as TFieldProps;
};
