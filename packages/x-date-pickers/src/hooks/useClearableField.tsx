import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import useSlotProps from '@mui/utils/useSlotProps';
import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { SxProps } from '@mui/system';
import { ClearIcon } from '../icons';
import { usePickersTranslations } from './usePickersTranslations';

export interface ExportedUseClearableFieldProps {
  /**
   * If `true`, a clear button will be shown in the field allowing value clearing.
   * @default false
   */
  clearable?: boolean;
  /**
   * Callback fired when the clear button is clicked.
   */
  onClear?: React.MouseEventHandler;
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

export type UseClearableFieldResponse<TFieldProps extends UseClearableFieldProps> = Omit<
  TFieldProps,
  'clearable' | 'onClear' | 'slots' | 'slotProps'
>;

export const useClearableField = <TFieldProps extends UseClearableFieldProps>(
  props: TFieldProps,
): UseClearableFieldResponse<TFieldProps> => {
  const translations = usePickersTranslations();

  const { clearable, onClear, InputProps, sx, slots, slotProps, ...other } = props;

  const IconButton = slots?.clearButton ?? MuiIconButton;
  // The spread is here to avoid this bug mui/material-ui#34056
  const { ownerState, ...iconButtonProps } = useSlotProps({
    elementType: IconButton,
    externalSlotProps: slotProps?.clearButton,
    ownerState: {},
    className: 'clearButton',
    additionalProps: {
      title: translations.fieldClearLabel,
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
      endAdornment: (
        <React.Fragment>
          {clearable && (
            <InputAdornment
              position="end"
              sx={{ marginRight: InputProps?.endAdornment ? -1 : -1.5 }}
            >
              <IconButton {...iconButtonProps} onClick={onClear}>
                <EndClearIcon fontSize="small" {...endClearIconProps} />
              </IconButton>
            </InputAdornment>
          )}

          {InputProps?.endAdornment}
        </React.Fragment>
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
