import * as React from 'react';
import Divider from '@mui/material/Divider';
import { ChartsBaseSlotPropsPro } from '../../slots/chartsBaseSlots';

export const BaseDivider = React.forwardRef<any, ChartsBaseSlotPropsPro['baseDivider']>(
  function BaseDivider({ material, ...rest }, ref) {
    return <Divider {...rest} {...material} ref={ref} />;
  },
);
