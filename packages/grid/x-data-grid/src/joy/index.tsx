import * as React from 'react';
import JoyCheckbox from '@mui/joy/Checkbox';
import type { UncapitalizeObjectKeys } from '../internals/utils';
import type { GridSlotsComponent } from '../models';

// @ts-ignore TODO: fix types
const Checkbox = React.forwardRef<HTMLDivElement, any>(
  ({ touchRippleRef, inputProps, ...props }, ref) => {
    return (
      <JoyCheckbox {...props} variant="outlined" slotProps={{ input: inputProps }} ref={ref} />
    );
  },
);

const joySlots: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> = {
  baseCheckbox: Checkbox,
  // BaseTextField: MUITextField,
  // BaseFormControl: MUIFormControl,
  // BaseSelect: MUISelect,
  // BaseSwitch: MUISwitch,
  // BaseButton: MUIButton,
  // BaseIconButton: MUIIconButton,
  // BaseTooltip: MUITooltip,
  // BasePopper: MUIPopper,
};

export default joySlots;
