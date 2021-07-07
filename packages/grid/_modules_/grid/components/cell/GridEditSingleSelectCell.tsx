import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';

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
    api.changeCellEditProps({ id, field, props: editProps }, event);
    if (!event.key) {
      api.commitCellChange({ id, field }, event);
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
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
