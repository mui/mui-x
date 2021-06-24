import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import { GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED } from '../../constants/eventsConstants';

export function GridEditSelectCell(props: GridCellParams & SelectProps) {
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

  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const editProps = { value: newValue };

      setValueState(newValue);
      api.publishEvent(
        GRID_CELL_EDIT_PROPS_CHANGE_COMMITTED,
        { id, field, props: editProps },
        event,
      );
      api.setCellMode(id, field, 'view');
    },
    [api, field, id],
  );

  const handleClose = React.useCallback(
    (event, reason) => {
      if (reason === 'backdropClick') {
        api.setCellMode(id, field, 'view');
      }
    },
    [api, field, id],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <Select
      value={valueState}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      autoFocus
      fullWidth
      open
      {...other}
    >
      {colDef.valueOptions.map((option) => {
        return (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        );
      })}
    </Select>
  );
}
export const renderEditSelectCell = (params) => <GridEditSelectCell {...params} />;
