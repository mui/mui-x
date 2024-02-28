import * as React from 'react';
import MUIMenuItem from '@mui/material/MenuItem';
import type { GridSlotsComponentsProps } from '../../models/gridSlotsComponentsProps';

export default function MUISelectOption({
  native,
  ...props
}: NonNullable<GridSlotsComponentsProps['baseSelectOption']>) {
  if (native) {
    return <option {...props} />;
  }
  return <MUIMenuItem {...props} />;
}
