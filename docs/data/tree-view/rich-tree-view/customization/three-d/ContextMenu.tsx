import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface ContextMenuProps {
  positionSeed: { x: number; y: number } | null;
  onClose: () => void;
  onClick: (menuItem: string) => void;
  menuItems: string[]; // you may want to have another type for
}

export function TreeItemContextMenu(props: ContextMenuProps) {
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
