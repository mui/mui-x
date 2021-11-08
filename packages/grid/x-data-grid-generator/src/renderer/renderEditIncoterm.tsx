import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import Select, { SelectProps } from '@mui/material/Select';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { INCOTERM_OPTIONS } from '../services/static-data';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      select: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
      },
      optionIcon: {
        minWidth: 40,
      },
      optionText: {
        overflow: 'hidden',
      },
    }),
  { defaultTheme },
);

function EditIncoterm(props: GridRenderEditCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;

  const handleChange: SelectProps['onChange'] = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    if (!(event as any).key) {
      api.commitCellChange({ id, field });
      api.setCellMode(id, field, 'view');
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
      classes={{ select: classes.select }}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
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
            <ListItemIcon className={classes.optionIcon}>
              <span>{code}</span>
            </ListItemIcon>
            <ListItemText className={classes.optionText} primary={tooltip} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditIncoterm(params: GridRenderEditCellParams) {
  return <EditIncoterm {...params} />;
}
