import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ContextMenuProps {
  positionSeed: { x: number; y: number } | null;
  onClose: () => void;
  onClick: (menuItem: string) => void;
  menuItems: string[]; //you may want to have another type for
}

export default function CustomTreeItemContextMenu(props: ContextMenuProps) {
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
