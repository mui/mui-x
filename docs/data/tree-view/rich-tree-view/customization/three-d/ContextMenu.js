import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function CustomTreeItemContextMenu(props) {
  const { positionSeed, onClose, onClick, menuItems } = props;

  const open = Boolean(positionSeed);

  const { x, y } = positionSeed ? positionSeed : { x: null, y: null };
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={positionSeed !== null ? { top: y, left: x } : undefined}
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
