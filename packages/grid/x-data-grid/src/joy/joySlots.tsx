import * as React from 'react';
import JoyCheckbox from '@mui/joy/Checkbox';
import JoyInput from '@mui/joy/Input';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridSlotsComponent, GridSlotsComponentsProps } from '../models';

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

const joySlots: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> = {
  baseCheckbox: Checkbox,
  baseTextField: TextField,
  // BaseFormControl: MUIFormControl,
  // BaseSelect: MUISelect,
  // BaseSwitch: MUISwitch,
  // BaseButton: MUIButton,
  // BaseIconButton: MUIIconButton,
  // BaseTooltip: MUITooltip,
  // BasePopper: MUIPopper,
};

export default joySlots;
