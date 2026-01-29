'use client';
import * as React from 'react';
import type { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { INCOTERM_OPTIONS } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';

function EditIncoterm(props: GridRenderEditCellParams<any, string | null>) {
  const { id, value, field, hasFocus } = props;

  const {
    open,
    setOpen,
    inputRef,
    shouldAutoOpen,
    handleSelectKeyDown,
    handleSelectMenuClose,
    handleSelectMenuListKeyDown,
    createSelectChangeHandler,
  } = useEditDropdownState({ id, field, hasFocus });

  const handleChange = createSelectChangeHandler((event) => event.target.value);

  return (
    <Select
      value={value}
      onChange={handleChange}
      onKeyDown={handleSelectKeyDown}
      onOpen={() => setOpen(true)}
      inputRef={inputRef}
      MenuProps={{
        onClose: handleSelectMenuClose,
        MenuListProps: {
          onKeyDown: handleSelectMenuListKeyDown,
        },
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus={shouldAutoOpen}
      fullWidth
      open={open}
    >
      {INCOTERM_OPTIONS.map((option) => {
        const tooltip = option.slice(option.indexOf('(') + 1, option.indexOf(')'));
        const code = option.slice(0, option.indexOf('(')).trim();

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>{code}</ListItemIcon>
            <ListItemText primary={tooltip} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditIncoterm(params: GridRenderEditCellParams<any, string | null>) {
  return <EditIncoterm {...params} />;
}
