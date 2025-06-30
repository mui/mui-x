import * as React from 'react';
import Divider from '@mui/material/Divider';
import type { ChartsBaseSlotProps } from '@mui/x-charts/models';

export const BaseDivider = React.forwardRef<any, ChartsBaseSlotProps['baseDivider']>(
  function BaseDivider({ material, ...rest }, ref) {
    return <Divider {...rest} {...material} ref={ref} />;
  },
);
