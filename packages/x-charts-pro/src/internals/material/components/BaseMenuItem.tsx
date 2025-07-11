import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ChartBaseMenuItemProps } from '@mui/x-charts/models';

export const BaseMenuItem = React.forwardRef<HTMLLIElement, ChartBaseMenuItemProps>(
  function BaseMenuItem(props, ref) {
    const { inert, iconStart, iconEnd, children, ...other } = props;

    return (
      <MenuItem {...other} disableRipple={inert ? true : (other as any).disableRipple} ref={ref}>
        {iconStart && <ListItemIcon key="1">{iconStart}</ListItemIcon>}
        <ListItemText key="2">{children}</ListItemText>
        {iconEnd && <ListItemIcon key="3">{iconEnd}</ListItemIcon>}
      </MenuItem>
    );
  },
);
