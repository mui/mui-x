import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import { ChartsBaseSlotPropsPro } from '../../slots/chartsBaseSlots';

export const BaseMenuList = React.forwardRef<any, ChartsBaseSlotPropsPro['baseMenuList']>(
  function BaseMenuList({ material, ...rest }, ref) {
    return <MenuList {...rest} {...material} ref={ref} />;
  },
);
