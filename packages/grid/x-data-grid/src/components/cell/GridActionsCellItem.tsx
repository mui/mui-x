import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

export type GridActionsCellItemProps = {
  label: string;
  icon?: React.ReactElement;
} & (
  | ({ showInMenu?: false; icon: React.ReactElement } & IconButtonProps)
  | ({ showInMenu: true } & MenuItemProps)
);

const GridActionsCellItem = React.forwardRef<HTMLButtonElement, GridActionsCellItemProps>(
  (props, ref) => {
    const { label, icon, showInMenu, onClick, ...other } = props;

    const handleClick = (event: any) => {
      if (onClick) {
        onClick(event);
      }
    };

    if (!showInMenu) {
      return (
        <IconButton
          ref={ref}
          size="small"
          role="menuitem"
          aria-label={label}
          {...(other as any)}
          onClick={handleClick}
        >
          {React.cloneElement(icon!, { fontSize: 'small' })}
        </IconButton>
      );
    }

    return (
      <MenuItem ref={ref} {...(other as any)} onClick={onClick}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </MenuItem>
    );
  },
);

GridActionsCellItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  showInMenu: PropTypes.bool,
} as any;

export { GridActionsCellItem };
