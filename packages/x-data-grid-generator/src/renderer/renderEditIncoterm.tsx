import {
  GridCellEditStopReasons,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import Select, { SelectProps } from '@mui/material/Select';
import { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { INCOTERM_OPTIONS } from '../services/static-data';

function EditIncoterm(props: GridRenderEditCellParams<any, string | null>) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange: SelectProps['onChange'] = async (event) => {
    const isValid = await apiRef.current.setEditCellValue(
      { id, field, value: event.target.value },
      event,
    );

    if (isValid) {
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent('cellEditStop', {
        ...params,
        reason: GridCellEditStopReasons.enterKeyDown,
      });
    }
  };

  const handleClose: MenuProps['onClose'] = (event, reason) => {
    if (reason === 'backdropClick') {
      const params = apiRef.current.getCellParams(id, field);
      apiRef.current.publishEvent('cellEditStop', {
        ...params,
        reason: GridCellEditStopReasons.cellFocusOut,
      });
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

export function renderEditIncoterm(params: GridRenderEditCellParams<any, string | null>) {
  return <EditIncoterm {...params} />;
}
