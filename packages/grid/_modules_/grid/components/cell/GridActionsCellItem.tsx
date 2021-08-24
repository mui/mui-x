import * as React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export type GridActionsCellItemProps = {
  label: string;
  icon?: React.ReactElement;
} & (
  | ({ showInMenu?: false; icon: React.ReactElement } & IconButtonProps)
  | ({ showInMenu: true } & MenuItemProps)
);

export const GridActionsCellItem = (props: GridActionsCellItemProps) => {
  const { label, icon, showInMenu, ...other } = props;

  if (!showInMenu) {
    return (
      <IconButton size="small" aria-label={label} {...(other as any)}>
        {React.cloneElement(icon!, { fontSize: 'small' })}
      </IconButton>
    );
  }

  return (
    <MenuItem {...(other as any)}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {label}
    </MenuItem>
  );
};
