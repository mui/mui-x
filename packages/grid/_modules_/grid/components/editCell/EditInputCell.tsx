import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isCellEditCommitKeys } from '../../utils/keyboardUtils';
import { formatDateToLocalInputDate, isDate, mapColDefTypeToInputType } from '../../utils/utils';
import { GridEditRowUpdate } from '../../models/gridEditRowModel';

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

  const [valueState, setValueState] = React.useState(value);

  const onValueChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const update: GridEditRowUpdate = {};
      update[field] = {
        value: colDef.type === 'date' || colDef.type === 'dateTime' ? new Date(newValue) : newValue,
      };
      setValueState(newValue);
      api.setEditCellProps(row.id, update);
    },
    [api, colDef.type, field, row.id],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (inputBaseProps.error && isCellEditCommitKeys(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [inputBaseProps.error],
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
