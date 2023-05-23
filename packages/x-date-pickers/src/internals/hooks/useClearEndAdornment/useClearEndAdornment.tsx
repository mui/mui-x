import * as React from 'react';

import { useSlotProps } from '@mui/base';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { SlotsAndSlotProps } from '../../utils/slots-migration';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '../useField/useField.types';

type UseClearEndAdornmentProps<
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlotsComponents extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
> = {
  clearable: boolean;
  InputProps: TInputProps;
  onClear: React.MouseEventHandler<HTMLButtonElement>;
} & SlotsAndSlotProps<TFieldSlotsComponents, TFieldSlotsComponentsProps>;

export const useClearEndAdornment = <
  TInputProps extends { endAdornment?: React.ReactNode } | undefined,
  TFieldSlotsComponents extends FieldSlotsComponents,
  TFieldSlotsComponentsProps extends FieldSlotsComponentsProps,
>({
  clearable,
  InputProps: ForwardedInputProps,
  onClear,
  slots,
  slotProps,
}: UseClearEndAdornmentProps<TInputProps, TFieldSlotsComponents, TFieldSlotsComponentsProps>) => {
  const EndClearIcon = slots?.clearIcon ?? ClearIcon;
  const endClearIconProps = useSlotProps({
    elementType: ClearIcon,
    externalSlotProps: slotProps?.clearIcon,
    externalForwardedProps: {},
    ownerState: {},
  });

  const InputProps = {
    ...ForwardedInputProps,
    endAdornment: clearable ? (
      <React.Fragment>
        {ForwardedInputProps?.endAdornment}
        <IconButton className="clearButton" onClick={onClear} tabIndex={-1}>
          <EndClearIcon {...endClearIconProps} />
        </IconButton>
      </React.Fragment>
    ) : (
      ForwardedInputProps?.endAdornment
    ),
  };

  return InputProps;
};
