import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { ChartsBaseSlotPropsPro } from '../../slots/chartsBaseSlots';

export const BaseTooltip = React.forwardRef<any, ChartsBaseSlotPropsPro['baseTooltip']>(
  function BaseTooltip({ material, ...rest }, ref) {
    return <Tooltip {...rest} {...material} ref={ref} />;
  },
);
