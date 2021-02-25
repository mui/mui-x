import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';
import { formatDateToLocalInputDate, isDate, mapColDefTypeToInputType } from '../../utils/utils';
import { GridEditRowUpdate } from '../../models/gridEditRowModel';
import { GridEditRowApi } from '../../models/api/gridEditRowApi';

export function EditInputCell(props: GridCellParams & InputBaseProps) {
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
    ...inputBaseProps
  } = props;

  const editRowApi = api as GridEditRowApi;
  const caretRafRef = React.useRef(0);
  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(caretRafRef.current);
    };
  }, []);

  const keepCaretPosition = React.useCallback((event) => {
    // Fix caret from jumping to the end of the input
    const caret = event.target.selectionStart;
    const element = event.target;
    caretRafRef.current = window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });
  }, []);

  const onValueChange = React.useCallback(
    (event) => {
      if (colDef.type === 'string') {
        keepCaretPosition(event);
      }
      const newValue = event.target.value;
      const update: GridEditRowUpdate = {};
      update[field] = {
        value: colDef.type === 'date' || colDef.type === 'dateTime' ? new Date(newValue) : newValue,
      };
      editRowApi.setEditCellProps(row.id, update);
    },
    [editRowApi, colDef.type, field, keepCaretPosition, row.id],
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
  const formattedValue =
    value && isDate(value)
      ? formatDateToLocalInputDate({ value, withTime: colDef.type === 'dateTime' })
      : value;

  return (
    <InputBase
      autoFocus
      onKeyDown={onKeyDown}
      value={formattedValue}
      onChange={onValueChange}
      type={inputType}
      style={{ width: '100%' }}
      {...inputBaseProps}
    />
  );
}
export const renderEditInputCell = (params) => <EditInputCell {...params} />;
