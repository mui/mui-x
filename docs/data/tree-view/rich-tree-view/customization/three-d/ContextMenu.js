import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export function TreeItemContextMenu(props) {
  const { positionSeed, onClose, onClick, menuItems } = props;

  const open = Boolean(positionSeed);

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        positionSeed == null
          ? undefined
          : { top: positionSeed.y, left: positionSeed.x }
      }
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            onClick(item);
          }}
        >
          {item}
        </MenuItem>
      ))}
    </Menu>
  );
}
