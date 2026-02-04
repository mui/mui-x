'use client';
import * as React from 'react';
import type { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';

function EditStatus(props: GridRenderEditCellParams<any, string>) {
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
      {STATUS_OPTIONS.map((option) => {
        let IconComponent: any = null;
        if (option === 'Rejected') {
          IconComponent = ReportProblemIcon;
        } else if (option === 'Open') {
          IconComponent = InfoIcon;
        } else if (option === 'Partially Filled') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Filled') {
          IconComponent = DoneIcon;
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={option} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditStatus(params: GridRenderEditCellParams<any, string>) {
  return <EditStatus {...params} />;
}
