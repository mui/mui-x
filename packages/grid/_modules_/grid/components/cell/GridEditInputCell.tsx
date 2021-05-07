import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GRID_CELL_EDIT_PROPS_CHANGE } from '../../constants/eventsConstants';
import { GridCellParams } from '../../models/params/gridCellParams';
import { formatDateToLocalInputDate, mapColDefTypeToInputType } from '../../utils/utils';

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
  const isDateColumn = colDef.type === 'date' || colDef.type === 'dateTime';

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const editProps = {
        value: newValue,
      };

      if (isDateColumn) {
        editProps.value = newValue === '' ? null : new Date(newValue); // TODO fix parsing, this is plain wrong.
      }

      setValueState(newValue);
      api.publishEvent(GRID_CELL_EDIT_PROPS_CHANGE, { id, field, props: editProps }, event);
    },
    [api, field, id, isDateColumn],
  );

  React.useEffect(() => {
    if (value instanceof Date) {
      setValueState(formatDateToLocalInputDate({ value, withTime: colDef.type === 'dateTime' }));
    } else {
      setValueState(value || '');
    }
  }, [value, colDef.type]);

  return (
    <InputBase
      autoFocus
      className="MuiDataGrid-editCellInputBase"
      fullWidth
      type={inputType}
      value={valueState}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
