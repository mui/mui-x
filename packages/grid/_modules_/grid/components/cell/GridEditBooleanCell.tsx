import * as React from 'react';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { GRID_CELL_EDIT_PROPS_CHANGE } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditBooleanCell(props: GridCellParams & CheckboxProps) {
  const {
    id,
    value,
    element,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    getValue,
    rowIndex,
    colIndex,
    isEditable,
    ...checkboxProps
  } = props;

  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.checked;
      const editProps = { value: newValue };
      setValueState(newValue);
      api.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, { id, field, props: editProps }, event);
    },
    [api, field, id],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <Checkbox
      autoFocus
      className="MuiDataGrid-editCellBoolean"
      checked={Boolean(valueState)}
      onChange={handleChange}
      size="small"
      {...checkboxProps}
    />
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
