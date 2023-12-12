import * as React from 'react';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { SxProps } from '@mui/system';
import { ClearIcon } from '../icons';
import { useLocaleText } from '../internals/hooks/useUtils';

export interface ExportedUseClearableFieldProps {
  clearable?: boolean;
  onClear?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface UseClearableFieldSlots {
  /**
   * Icon to display inside the clear button.
   * @default ClearIcon
   */
  clearIcon?: React.ElementType;
  /**
   * Button to clear the value.
   * @default IconButton
   */
  clearButton?: React.ElementType;
}

export interface UseClearableFieldSlotProps {
  clearIcon?: SlotComponentProps<typeof ClearIcon, {}, {}>;
  clearButton?: SlotComponentProps<typeof MuiIconButton, {}, {}>;
}

interface UseClearableFieldProps extends ExportedUseClearableFieldProps {
  InputProps?: { endAdornment?: React.ReactNode };
  sx?: SxProps<any>;
  slots?: UseClearableFieldSlots;
  slotProps?: UseClearableFieldSlotProps;
}

export const useClearableField = <TFieldProps extends UseClearableFieldProps>(
  props: TFieldProps,
): Omit<TFieldProps, 'clearable' | 'onClear' | 'slots' | 'slotProps'> => {
  const localeText = useLocaleText();

  const { clearable, onClear, InputProps, sx, slots, slotProps, ...other } = props;

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
