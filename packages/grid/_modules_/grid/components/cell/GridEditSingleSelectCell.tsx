import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import {
  GRID_CELL_EDIT_PROPS_CHANGE,
  GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
  GRID_CELL_EDIT_EXIT,
} from '../../constants/eventsConstants';

const renderSingleSelectOptions = (option) =>
  typeof option === 'string' ? (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ) : (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  );

export function GridEditSingleSelectCell(props: GridCellParams & SelectProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    isEditable,
    className,
    getValue,
    hasFocus,
    ...other
  } = props;

  const handleChange = (event) => {
    const editProps = { value: event.target.value };

    if (event.key) {
      api.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, { id, field, props: editProps }, event);
    } else {
      api.publishEvent(
        GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
        { id, field, props: editProps },
        event,
      );
      api.publishEvent(GRID_CELL_EDIT_EXIT, { id, field }, event);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      api.publishEvent(GRID_CELL_EDIT_EXIT, { id, field }, event);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      autoFocus
      fullWidth
      open
      {...other}
    >
      {colDef.valueOptions.map(renderSingleSelectOptions)}
    </Select>
  );
}
export const renderEditSingleSelectCell = (params) => <GridEditSingleSelectCell {...params} />;
