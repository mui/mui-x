import * as React from 'react';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { composeClasses, useEnhancedEffect } from '../../utils/material-ui-utils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { GridCellValue } from '../../models/gridCell';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editInputCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const parseDate = (value: GridCellValue, isDateTime: boolean) => {
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else {
    date = new Date((value ?? '').toString());
  }

  date.setMilliseconds(0);
  date.setSeconds(0);

  if (!isDateTime) {
    date.setMinutes(0);
    date.setHours(0);
  }

  return date;
};

const stringifyDate = (date: Date, isDateTime: boolean) => {
  const localeDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localeDate.toISOString().substr(0, isDateTime ? 16 : 10);
};

export function GridEditDateCell(props: GridRenderEditCellParams & InputBaseProps) {
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

  const isDateTime = colDef.type === 'dateTime';
  const inputRef = React.useRef<HTMLInputElement>();
  const [valueState, setValueState] = React.useState(() =>
    stringifyDate(parseDate(value, isDateTime), isDateTime),
  );
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleChange: InputBaseProps['onChange'] = (event) => {
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
  };

  React.useEffect(() => {
    const parsedPropValue = parseDate(value, isDateTime);
    const parsedStateValue = new Date(valueState);

    const propTimestamp = parsedPropValue.getTime();
    const stateTimestamp = parsedStateValue.getTime();

    if (propTimestamp !== stateTimestamp && !Number.isNaN(propTimestamp)) {
      setValueState(stringifyDate(parsedPropValue, isDateTime));
    }
  }, [value, isDateTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  return (
    <InputBase
      inputRef={inputRef}
      fullWidth
      className={classes.root}
      type={isDateTime ? 'datetime-local' : 'date'}
      value={valueState}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditDateCell = (params) => <GridEditDateCell {...params} />;
