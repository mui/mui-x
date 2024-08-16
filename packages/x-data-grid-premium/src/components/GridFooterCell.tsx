import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, GridRenderCellParams } from '@mui/x-data-grid';
import { styled } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

const GridFooterCellRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'FooterCell',
  overridesResolver: (_, styles) => styles.footerCell,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  // @ts-ignore `@mui/material` theme.typography does not exist
  fontWeight: theme.typography.fontWeightMedium,
  // @ts-ignore `@mui/material` theme.vars does not exist
  color: (theme.vars || theme).palette.primary.dark,
}));

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
    // @ts-ignore `@mui/material` system styled() doesn't have a compatible sx prop
    <GridFooterCellRoot ownerState={ownerState} className={classes.root} {...other}>
      {formattedValue}
    </GridFooterCellRoot>
  );
}

export { GridFooterCell };
