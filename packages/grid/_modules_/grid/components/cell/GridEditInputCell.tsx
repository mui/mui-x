import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GRID_CELL_EDIT_BLUR } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isCellEditCommitKeys } from '../../utils/keyboardUtils';
import { formatDateToLocalInputDate, isDate, mapColDefTypeToInputType } from '../../utils/utils';

export function GridEditInputCell(props: GridCellParams & InputBaseProps) {
  const {
    id,
    value,
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
    ...inputBaseProps
  } = props;

  const [valueState, setValueState] = React.useState(value);

  const handleBlur = React.useCallback(
    (event: React.SyntheticEvent) => {
      const params = api.getCellParams(id, field);
      api.publishEvent(GRID_CELL_EDIT_BLUR, params, event);
    },
    [api, field, id],
  );

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const editProps = {
        value: colDef.type === 'date' || colDef.type === 'dateTime' ? new Date(newValue) : newValue,
      };
      setValueState(newValue);
      api.setEditCellProps({ id, field, props: editProps });
    },
    [api, colDef.type, field, id],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (inputBaseProps.error && isCellEditCommitKeys(event.key)) {
        // Account for when tab/enter is pressed
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
      className="MuiDataGrid-editCellInputBase"
      fullWidth
      type={inputType}
      value={inputFormattedValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...inputBaseProps}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
