import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditDateCell(props: GridCellParams & InputBaseProps) {
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
    tabIndex,
    hasFocus,
    getValue,
    ...other
  } = props;

  const inputRef = React.useRef<HTMLInputElement>();
  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);

      if (newValue === '') {
        api.setEditCellValue({ id, field, value: null }, event);
        return;
      }

      const [date, time] = newValue.split('T');
      const [year, month, day] = date.split('-');
      const dateObj = new Date();
      dateObj.setFullYear(Number(year));
      dateObj.setMonth(Number(month) - 1);
      dateObj.setDate(Number(day));
      dateObj.setHours(0, 0, 0, 0);

      if (time) {
        const [hours, minutes] = time.split(':');
        dateObj.setHours(Number(hours), Number(minutes), 0, 0);
      }

      api.setEditCellValue({ id, field, value: dateObj }, event);
    },
    [api, field, id],
  );

  const isDateTime = colDef.type === 'dateTime';

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  React.useLayoutEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  let valueToDisplay = valueState || '';
  if (valueState instanceof Date) {
    const offset = valueState.getTimezoneOffset();
    const localDate = new Date(valueState.getTime() - offset * 60 * 1000);
    valueToDisplay = localDate.toISOString().substr(0, isDateTime ? 16 : 10);
  }

  return (
    <InputBase
      inputRef={inputRef}
      fullWidth
      className="MuiDataGrid-editInputCell"
      type={isDateTime ? 'datetime-local' : 'date'}
      value={valueToDisplay}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditDateCell = (params) => <GridEditDateCell {...params} />;
