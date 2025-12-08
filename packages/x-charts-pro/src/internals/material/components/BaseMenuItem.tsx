import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { type ChartBaseMenuItemProps } from '../../slots/chartBaseSlotProps';

export function BaseMenuItem(props: ChartBaseMenuItemProps) {
  const { inert, iconStart, iconEnd, children, ...other } = props;

  return (
    <MenuItem {...other} disableRipple={inert ? true : (other as any).disableRipple}>
      {iconStart && <ListItemIcon key="1">{iconStart}</ListItemIcon>}
      <ListItemText key="2">{children}</ListItemText>
      {iconEnd && <ListItemIcon key="3">{iconEnd}</ListItemIcon>}
    </MenuItem>
  );
}
