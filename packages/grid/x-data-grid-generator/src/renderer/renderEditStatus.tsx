import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MenuProps } from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS } from '../services/static-data';

function EditStatus(props: GridRenderEditCellParams<string>) {
  const { id, value, api, field } = props;

  const handleChange: SelectProps['onChange'] = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value as any }, event);
    api.commitCellChange({ id, field });
    api.setCellMode(id, field, 'view');

    if ((event as any).key) {
      // TODO v6: remove once we stop ignoring events fired from portals
      const params = api.getCellParams(id, field);
      api.publishEvent(
        'cellNavigationKeyDown',
        params,
        event as any as React.KeyboardEvent<HTMLElement>,
      );
    }
  };

  const handleClose: MenuProps['onClose'] = (event, reason) => {
    if (reason === 'backdropClick') {
      api.setCellMode(id, field, 'view');
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
      {STATUS_OPTIONS.map((option) => {
        let IconComponent: any = null;
        if (option === 'Rejected') {
          IconComponent = ReportProblemIcon;
        } else if (option === 'Open') {
          IconComponent = InfoIcon;
        } else if (option === 'PartiallyFilled') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Filled') {
          IconComponent = DoneIcon;
        }

        let label = option;
        if (option === 'PartiallyFilled') {
          label = 'Partially Filled';
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditStatus(params: GridRenderEditCellParams<string>) {
  return <EditStatus {...params} />;
}
