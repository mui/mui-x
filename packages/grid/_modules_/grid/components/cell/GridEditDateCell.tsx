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

const parseDate = (value: GridCellValue) => {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date((value ?? '').toString());
};

const formatDate = (date: Date | null, isDateTime: boolean) => {
  if (date == null || Number.isNaN(date.getTime())) {
    return '';
  }

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

  const valueProp = React.useMemo(() => {
    const parsedDate = parseDate(value);

    return {
      parsed: parsedDate,
      formatted: formatDate(parsedDate, isDateTime),
    };
  }, [value, isDateTime]);

  const [valueState, setValueState] = React.useState(valueProp);
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleChange: InputBaseProps['onChange'] = (event) => {
    const newFormattedDate = event.target.value;
    let newParsedDate: Date | null;

    if (newFormattedDate === '') {
      newParsedDate = null;
    } else {
      const [date, time] = newFormattedDate.split('T');
      const [year, month, day] = date.split('-');
      newParsedDate = new Date();
      newParsedDate.setFullYear(Number(year));
      newParsedDate.setMonth(Number(month) - 1);
      newParsedDate.setDate(Number(day));
      newParsedDate.setHours(0, 0, 0, 0);

      if (time) {
        const [hours, minutes] = time.split(':');
        newParsedDate.setHours(Number(hours), Number(minutes), 0, 0);
      }
    }

    setValueState({ parsed: newParsedDate, formatted: newFormattedDate });
    api.setEditCellValue({ id, field, value: newParsedDate }, event);
  };

  React.useEffect(() => {
    if (valueProp.parsed?.getTime() !== valueState.parsed?.getTime()) {
      setValueState(valueProp);
    }
  }, [valueProp]); // eslint-disable-line react-hooks/exhaustive-deps

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
      value={valueState.formatted}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditDateCell = (params) => <GridEditDateCell {...params} />;
