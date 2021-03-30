import * as React from 'react';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridBooleanCell(props: GridCellParams & CheckboxProps) {
  const {
    id,
    value,
    element,
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
    ...checkboxProps
  } = props;

  return (
    <Checkbox
      checked={Boolean(value)}
      size="small"
      aria-label={api.getLocaleText(value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel')}
      disabled
      {...checkboxProps}
    />
  );
}

export const renderBooleanCell = (params) => <GridBooleanCell {...params} />;
