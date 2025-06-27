import * as React from 'react';
import Button from '@mui/material/Button';
import { ChartsBaseSlotProps } from '../../../models/slots/chartsBaseSlots';

export const BaseButton = React.forwardRef<any, ChartsBaseSlotProps['baseButton']>(
  function BaseButton({ material, ...rest }, ref) {
    return <Button {...rest} {...material} ref={ref} />;
  },
);
