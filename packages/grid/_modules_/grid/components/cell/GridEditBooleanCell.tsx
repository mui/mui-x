import * as React from 'react';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import { GRID_CELL_EDIT_PROPS_CHANGE } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditBooleanCell(
  props: GridCellParams &
    React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
  const {
    id: idProp,
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
    ...other
  } = props;

  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <label htmlFor={id} className={clsx('MuiDataGrid-editCellBoolean', className)} {...other}>
      <Checkbox
        autoFocus
        id={id}
        checked={Boolean(valueState)}
        onChange={handleChange}
        size="small"
      />
    </label>
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
