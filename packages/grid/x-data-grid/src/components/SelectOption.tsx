import * as React from 'react';
import MUIMenuItem from '@mui/material/MenuItem';

// TODO: type props as soon as we type slotProps
export default function SelectOption({ native, ...props }: any) {
  if (native) {
    return <option {...props} />;
  }
  return <MUIMenuItem {...props} />;
}
