import * as React from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridRenderCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { composeClasses } from '../../utils/material-ui-utils';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['booleanCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridBooleanCell = React.memo((props: GridRenderCellParams & SvgIconProps) => {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    hasFocus,
    tabIndex,
    getValue,
    ...other
  } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const Icon = React.useMemo(
    () =>
      value ? rootProps.components.BooleanCellTrueIcon : rootProps.components.BooleanCellFalseIcon,
    [rootProps.components.BooleanCellFalseIcon, rootProps.components.BooleanCellTrueIcon, value],
  );

  return (
    <Icon
      fontSize="small"
      className={classes.root}
      titleAccess={api.getLocaleText(value ? 'booleanCellTrueLabel' : 'booleanCellFalseLabel')}
      data-value={Boolean(value)}
      {...other}
    />
  );
});

export const renderBooleanCell = (params) => <GridBooleanCell {...params} />;
