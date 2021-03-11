import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';
import { formatDateToLocalInputDate, isDate, mapColDefTypeToInputType } from '../../utils/utils';
import { GridEditRowUpdate } from '../../models/gridEditRowModel';
import { GridEditRowApi } from '../../models/api/gridEditRowApi';

export function EditInputCell(props: GridCellParams & InputBaseProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    getValue,
    rowIndex,
    colIndex,
    isEditable,
    ...inputBaseProps
  } = props;

  const editRowApi = api as GridEditRowApi;
  const [valueState, setValueState] = React.useState(value);

  const onValueChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const update: GridEditRowUpdate = {};
      update[field] = {
        value: colDef.type === 'date' || colDef.type === 'dateTime' ? new Date(newValue) : newValue,
      };
      setValueState(newValue);
      editRowApi.setEditCellProps(row.id, update);
    },
    [editRowApi, colDef.type, field, row.id],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!inputBaseProps.error && event.key === 'Enter') {
        const update: GridEditRowUpdate = {};
        update[field] = { value };
        editRowApi.commitCellChange(row.id, update);
      }

      if (event.key === 'Escape') {
        editRowApi.setCellMode(row.id, field, 'view');
      }
    },
    [inputBaseProps.error, row.id, field, value, editRowApi],
  );

  const inputType = mapColDefTypeToInputType(colDef.type);
  const inputFormattedValue =
    valueState && isDate(valueState)
      ? formatDateToLocalInputDate({ value: valueState, withTime: colDef.type === 'dateTime' })
      : valueState;

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <InputBase
      autoFocus
      fullWidth
      className="MuiDataGrid-editCellInputBase"
      onKeyDown={onKeyDown}
      value={inputFormattedValue}
      onChange={onValueChange}
      type={inputType}
      {...inputBaseProps}
    />
  );
}
export const renderEditInputCell = (params) => <EditInputCell {...params} />;
