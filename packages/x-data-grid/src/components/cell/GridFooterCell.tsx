'use client';
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { vars } from '../../constants/cssVariables';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridRenderCellParams } from '../../models/params/gridCellParams';

const GridFooterCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FooterCell',
})<{ ownerState: OwnerState }>({
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.colors.foreground.accent,
});

interface GridFooterCellProps extends GridRenderCellParams {
  sx?: SxProps<Theme>;
}

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['footerCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridFooterCellRaw(props: GridFooterCellProps) {
  const {
    formattedValue,
    colDef,
    cellMode,
    row,
    api,
    id,
    value,
    rowNode,
    field,
    hasFocus,
    tabIndex,
    isEditable,
    ...other
  } = props;
  const { classes: classesRootProps } = useGridRootProps();

  const ownerState = { classes: classesRootProps };
  const classes = useUtilityClasses(ownerState);

  return (
    <GridFooterCellRoot ownerState={ownerState} className={classes.root} {...other}>
      {formattedValue}
    </GridFooterCellRoot>
  );
}

const GridFooterCell = React.memo(GridFooterCellRaw);

export { GridFooterCell };
