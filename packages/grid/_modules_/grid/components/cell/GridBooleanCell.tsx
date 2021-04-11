import * as React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridBooleanCell(props: GridCellParams & SvgIconProps) {
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
    ...other
  } = props;

  const Icon = value ? api.components.BooleanCellTrueIcon : api.components.BooleanCellFalseIcon;

  return (
    <Icon
      fontSize="small"
      className="MuiDataGrid-booleanCell"
      titleAccess={api.getLocaleText(value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel')}
      data-value={Boolean(value)}
      {...other}
    />
  );
}

export const renderBooleanCell = (params) => <GridBooleanCell {...params} />;
