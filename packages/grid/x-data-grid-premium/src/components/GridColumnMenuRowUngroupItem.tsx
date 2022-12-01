import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import {
  gridColumnLookupSelector,
  useGridSelector,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  textTransform: 'none',
}));

function GridColumnMenuRowUngroupItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  if (!colDef.groupable) {
    return null;
  }

  const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.removeRowGroupingCriteria(colDef.field);
    onClick(event);
  };

  const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.addRowGroupingCriteria(colDef.field);
    onClick(event);
  };

  const name = columnsLookup[colDef.field].headerName ?? colDef.field;

  if (rowGroupingModel.includes(colDef.field)) {
    return (
      <StyledButton
        onClick={ungroupColumn}
        key={colDef.field}
        startIcon={<rootProps.components.ColumnMenuUngroupIcon />}
        color="inherit"
      >
        {apiRef.current.getLocaleText('unGroupColumn')(name)}
      </StyledButton>
    );
  }

  return (
    <StyledButton
      onClick={groupColumn}
      key={colDef.field}
      startIcon={<rootProps.components.ColumnMenuGroupIcon />}
      color="inherit"
    >
      {apiRef.current.getLocaleText('groupColumn')(name)}
    </StyledButton>
  );
}

GridColumnMenuRowUngroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuRowUngroupItem };
