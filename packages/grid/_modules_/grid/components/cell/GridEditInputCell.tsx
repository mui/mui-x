import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GRID_CELL_EDIT_PROPS_CHANGE } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { formatDateToLocalInputDate, isDate, isDateValid, mapColDefTypeToInputType } from '../../utils/utils';

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
    ...other
  } = props;

  const [valueState, setValueState] = React.useState(value);
  const inputType = mapColDefTypeToInputType(colDef.type);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      let isValid = false;
      setValueState(prevState => {
        isValid = !isDate(prevState) || !!newValue; //if the input date is invalid, it triggers on change ''
        return isValid ? newValue : prevState;
      });

      if(!isValid) {
        return;
      }

      const editProps = {
        value: colDef.type === 'date' || colDef.type === 'dateTime' ? new Date(newValue) : newValue,
      };
      api.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, { id, field, props: editProps }, event);
    },
    [api, colDef.type, field, id],
  );

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
      onChange={handleChange}

      {...other}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
