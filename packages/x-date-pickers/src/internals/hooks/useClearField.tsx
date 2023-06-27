import * as React from 'react';

import { useSlotProps } from '@mui/base';
import IconButton from '@mui/material/IconButton';
import { SxProps } from '@mui/system';
import { ClearIcon } from '../../icons';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from './useField/useField.types';
import { FieldsTextFieldProps } from '../models';

const excludeClearableProps = <TProps extends {}>(props: TProps, excludedProps: string[]): TProps =>
  Object.keys(props).reduce((prev, key) => {
    if (!excludedProps.includes(key)) {
      return {
        ...prev,
        [key as keyof TProps]: props[key as keyof TProps],
      };
    }
    return prev;
  }, {}) as TProps;

type UseClearFieldProps<
  TFieldProps extends FieldsTextFieldProps & { inputHasFocus?: boolean },
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

export const useClearField = <
  TFieldProps extends FieldsTextFieldProps & {
    inputHasFocus?: boolean;
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
    ...excludeClearableProps<TFieldProps | {}>(forwardedFieldProps, ['inputHasFocus']),
    sx: {
      '& .clearButton': {
        visibility: 'visible',
      },
      '@media (pointer: fine)': {
        '& .clearButton': {
          visibility: forwardedFieldProps?.inputHasFocus ? 'visible' : 'hidden',
        },

        '&:hover .clearButton': {
          visibility: 'visible',
        },
      },
      ...forwardedFieldProps?.sx,
    } as SxProps,
  } as TFieldProps;

  return { InputProps, fieldProps };
};
