import * as React from 'react';
import JoyCheckbox from '@mui/joy/Checkbox';
import JoyInput from '@mui/joy/Input';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridSlotsComponent } from '../models';

// TODO: fix types
const Checkbox = React.forwardRef<HTMLDivElement, any>(
  ({ touchRippleRef, inputProps, ...props }, ref) => {
    return (
      <JoyCheckbox {...props} variant="outlined" slotProps={{ input: inputProps }} ref={ref} />
    );
  },
);

// TODO: fix types
const TextField = React.forwardRef<HTMLDivElement, any>(
  ({ onChange, label, placeholder, value, inputRef, type }, ref) => {
    return (
      <JoyFormControl ref={ref}>
        <JoyFormLabel sx={{ fontSize: 12 }}>{label}</JoyFormLabel>
        <JoyInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          size="sm"
          slotProps={{ input: { ref: inputRef } }}
        />
      </JoyFormControl>
    );
  },
);

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
