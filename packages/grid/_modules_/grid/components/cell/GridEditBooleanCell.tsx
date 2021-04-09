import * as React from 'react';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { GRID_CELL_EDIT_PROPS_CHANGE } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditBooleanCell(props: GridCellParams & CheckboxProps) {
  const {
    id: idProp,
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
      api.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, { id: idProp, field, props: editProps }, event);
    },
    [api, field, idProp],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  const id = `MuiDataGrid-cell-${idProp}-${field}`;

  return (
    <label htmlFor={id} className="MuiDataGrid-editCellBoolean">
      <Checkbox
        autoFocus
        id={id}
        checked={Boolean(valueState)}
        onChange={handleChange}
        size="small"
        {...checkboxProps}
      />
    </label>
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
