import * as React from 'react';
import { getDataGridUtilityClass, GridRenderCellParams } from '@mui/x-data-grid';
import { vars } from '@mui/x-data-grid/internals';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

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

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['footerCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridFooterCell(props: GridFooterCellProps) {
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
    focusElementRef,
    hasFocus,
    tabIndex,
    isEditable,
    ...other
  } = props;
  const rootProps = useGridRootProps();

  const ownerState = rootProps;
  const classes = useUtilityClasses(ownerState);

  return (
    <GridFooterCellRoot ownerState={ownerState} className={classes.root} {...other}>
      {formattedValue}
    </GridFooterCellRoot>
  );
}

export { GridFooterCell };
