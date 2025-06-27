import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { ChartsBaseSlotProps } from '../../../models/slots/chartsBaseSlots';

export const BaseIconButton = React.forwardRef<any, ChartsBaseSlotProps['baseIconButton']>(
  function BaseIconButton({ material, ...rest }, ref) {
    return <IconButton {...rest} {...material} ref={ref} />;
  },
);
