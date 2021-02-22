import * as React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isDate } from '../../utils/utils';

// export interface StringEditCellProps extends CellParams {
//   isValid?: boolean;
// }
function mapColDefTypeToInputType(type: string) {
  switch (type) {
    case 'string':
      return 'text';
    case 'number':
    case 'date':
      return type;
    case 'dateTime':
      return 'datetime-local';
    default:
      return 'text';
  }
}
export function StringEditCell(props: GridCellParams & TextFieldProps) {
  const {
    value,
    api,
    field,
    row,
    colDef,
    getValue,
    rowIndex,
    colIndex,
    isEditable,
    ...textFieldProps
  } = props;
  const [inputValueState, setInputValueState] = React.useState(value || '');

  const onValueChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      //TODO consider removing local state, and just use gridState
      setInputValueState(newValue);

      const update = { id: row.id };
      update[field] = newValue;
      api.setEditCellValue(update);
    },
    [api, field, row.id],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!textFieldProps.error && event.key === 'Enter') {
        const update = { id: row.id };
        update[field] = inputValueState;
        api.commitCellValueChanges(update);
      }

      if (event.key === 'Escape') {
        api.setCellMode(row.id, field, 'view');
      }
    },
    [api, field, inputValueState, textFieldProps, row.id],
  );

  React.useEffect(() => {
    setInputValueState(value || '');
  }, [value]);

  const inputType = mapColDefTypeToInputType(colDef.type);
  let formattedValue = inputValueState;
  if (isDate(value)) {
    //TODO fix issue with local date as 00:00 time returns -1 day
    formattedValue = value.toISOString().substr(0, colDef.type === 'dateTime' ? 16 : 10);
  }

  return (
    <TextField
      onKeyDown={onKeyDown}
      label={field}
      placeholder={'Edit value'}
      value={formattedValue}
      onChange={onValueChange}
      type={inputType}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      {...textFieldProps}
    />
  );
}
export const renderEditStringCell = (params) => <StringEditCell {...params} />;
