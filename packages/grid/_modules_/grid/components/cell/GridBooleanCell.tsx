import * as React from 'react';
import clsx from 'clsx';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { gridClasses } from '../../gridClasses';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridBooleanCell = React.memo((props: GridRenderCellParams & SvgIconProps) => {
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
    hasFocus,
    tabIndex,
    getValue,
    ...other
  } = props;
  const rootProps = useGridRootProps();

  const Icon = React.useMemo(
    () =>
      value ? rootProps.components.BooleanCellTrueIcon : rootProps.components.BooleanCellFalseIcon,
    [rootProps.components.BooleanCellFalseIcon, rootProps.components.BooleanCellTrueIcon, value],
  );

  return (
    <Icon
      fontSize="small"
      className={clsx(gridClasses.booleanCell, rootProps.classes?.booleanCell)}
      titleAccess={api.getLocaleText(value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel')}
      data-value={Boolean(value)}
      {...other}
    />
  );
});

export const renderBooleanCell = (params) => <GridBooleanCell {...params} />;
