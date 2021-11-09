import * as React from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Select, { SelectProps } from '@mui/material/Select';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { TAXCODE_OPTIONS } from '../services/static-data';

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
        minWidth: 36,
      },
      optionText: {
        overflow: 'hidden',
      },
    }),
  { defaultTheme },
);

function EditTaxCode(props: GridRenderCellParams) {
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
      {TAXCODE_OPTIONS.map((option) => {
        return (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderEditTaxCode(params: GridRenderCellParams) {
  return <EditTaxCode {...params} />;
}
