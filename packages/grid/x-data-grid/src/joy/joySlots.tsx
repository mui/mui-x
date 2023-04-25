import * as React from 'react';
import { SxProps } from '@mui/system';
import { ColorPaletteProp, Theme, VariantProp } from '@mui/joy/styles';
import JoyCheckbox from '@mui/joy/Checkbox';
import JoyInput from '@mui/joy/Input';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoyButton from '@mui/joy/Button';
import JoyIconButton from '@mui/joy/IconButton';
import JoySwitch, { SwitchProps as JoySwitchProps } from '@mui/joy/Switch';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridSlotsComponent, GridSlotsComponentsProps } from '../models';

function convertColor<
  T extends
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit'
    | 'default',
>(color: T | undefined) {
  if (color === 'secondary') {
    return 'primary';
  }
  if (color === 'error') {
    return 'danger';
  }
  if (color === 'default' || color === 'inherit') {
    return 'neutral';
  }
  return color as ColorPaletteProp;
}

function convertSize<T extends 'small' | 'medium' | 'large'>(size: T | undefined) {
  return (size ? { small: 'sm', medium: 'md', large: 'lg' }[size] : size) as
    | 'sm'
    | 'md'
    | 'lg'
    | undefined;
}

function convertVariant<T extends 'outlined' | 'contained' | 'text' | 'standard' | 'filled'>(
  variant: T | undefined,
) {
  return (
    variant
      ? {
          outlined: 'outlined',
          contained: 'solid',
          text: 'plain',
          standard: 'plain',
          filled: 'soft',
        }[variant]
      : variant
  ) as VariantProp;
}

const Checkbox = React.forwardRef<
  HTMLElement,
  NonNullable<GridSlotsComponentsProps['baseCheckbox']>
>(
  (
    { touchRippleRef, inputProps, onChange, color, size, checked, sx, value, inputRef, ...props },
    ref,
  ) => {
    return (
      <JoyCheckbox
        {...props}
        slotProps={{ input: { ...(inputProps as any), ref: inputRef } }}
        ref={ref}
        checked={checked}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      />
    );
  },
);

const TextField = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['baseTextField']>
>(({ onChange, label, placeholder, value, inputRef, type }, ref) => {
  return (
    <JoyFormControl ref={ref}>
      <JoyFormLabel sx={{ fontSize: 12 }}>{label}</JoyFormLabel>
      <JoyInput
        type={type}
        value={value as any}
        onChange={onChange}
        placeholder={placeholder}
        size="sm"
        slotProps={{ input: { ref: inputRef } }}
      />
    </JoyFormControl>
  );
});

const Button = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseButton']>
>(function Button({ startIcon, color, endIcon, size, sx, variant, ...props }, ref) {
  return (
    <JoyButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color)}
      variant={convertVariant(variant) ?? 'plain'}
      ref={ref}
      startDecorator={startIcon}
      endDecorator={endIcon}
      sx={sx as SxProps<Theme>}
    />
  );
});

const IconButton = React.forwardRef<
  HTMLButtonElement,
  NonNullable<GridSlotsComponentsProps['baseIconButton']>
>(function IconButton({ color, size, sx, ...props }, ref) {
  return (
    <JoyIconButton
      {...props}
      size={convertSize(size)}
      color={convertColor(color) ?? 'neutral'}
      variant="plain"
      ref={ref}
      sx={sx as SxProps<Theme>}
    />
  );
});

const Switch = React.forwardRef<
  HTMLDivElement,
  NonNullable<GridSlotsComponentsProps['baseSwitch']>
>(function Switch(
  {
    name,
    checkedIcon,
    color: colorProp,
    disableRipple,
    disableFocusRipple,
    disableTouchRipple,
    edge,
    icon,
    inputProps,
    inputRef,
    size,
    sx,
    onChange,
    onClick,
    ...props
  },
  ref,
) {
  return (
    <JoySwitch
      {...(props as JoySwitchProps)}
      onChange={onChange as JoySwitchProps['onChange']}
      size={convertSize(size)}
      color={convertColor(colorProp)}
      ref={ref}
      slotProps={{
        input: {
          ...inputProps,
          name,
          onClick: onClick as JSX.IntrinsicElements['input']['onClick'],
          ref: inputRef,
        },
        thumb: {
          children: icon,
        },
      }}
      sx={
        [
          {
            ...(edge === 'start' && { ml: '-8px' }),
            ...(edge === 'end' && { mr: '-8px' }),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ] as SxProps<Theme>
      }
    />
  );
});

const joySlots: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> = {
  baseCheckbox: Checkbox,
  baseTextField: TextField,
  baseButton: Button,
  baseIconButton: IconButton,
  baseSwitch: Switch,
  // BaseFormControl: MUIFormControl,
  // baseSelect: Select,
  // baseSelectOption: Option,
  // BaseTooltip: MUITooltip,
  // BasePopper: MUIPopper,
};

export default joySlots;
