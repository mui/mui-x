import * as React from 'react';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid-premium';
import Select, { SelectProps } from '@mui/material/Select';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { INCOTERM_OPTIONS } from '../services/static-data';

function EditIncoterm(props: GridRenderEditCellParams<string | null>) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange: SelectProps['onChange'] = (event) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.value as any }, event);
    apiRef.current.commitCellChange({ id, field });
    apiRef.current.setCellMode(id, field, 'view');

    if ((event as any).key) {
      // TODO v6: remove once we stop ignoring events fired from portals
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent(
        'cellNavigationKeyDown',
        params,
        event as any as React.KeyboardEvent<HTMLElement>,
      );
    }
  };

  const handleClose: MenuProps['onClose'] = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.setCellMode(id, field, 'view');
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
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

export function renderEditIncoterm(params: GridRenderEditCellParams<string | null>) {
  return <EditIncoterm {...params} />;
}
