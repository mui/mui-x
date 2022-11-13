import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
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

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 1, 1.5),
  flexDirection: 'row',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  textTransform: 'none',
}));

const GridColumnMenuRowUngroupItem: React.FC<GridColumnMenuItemProps> = (props) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  if (!column.groupable) {
    return null;
  }

  const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.removeRowGroupingCriteria(column.field);
    onClick(event);
  };

  const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.addRowGroupingCriteria(column.field);
    onClick(event);
  };

  const name = columnsLookup[column.field].headerName ?? column.field;

  if (rowGroupingModel.includes(column.field)) {
    return (
      <StyledStack>
        <StyledButton
          onClick={ungroupColumn}
          key={column.field}
          startIcon={<rootProps.components.ColumnMenuUngroupIcon />}
          color="inherit"
        >
          {apiRef.current.getLocaleText('unGroupColumn')(name)}
        </StyledButton>
      </StyledStack>
    );
  }

  return (
    <Stack px={1.5} py={1} direction="row">
      <StyledButton
        onClick={groupColumn}
        key={column.field}
        startIcon={<rootProps.components.ColumnMenuGroupIcon />}
        color="inherit"
      >
        {apiRef.current.getLocaleText('groupColumn')(name)}
      </StyledButton>
    </Stack>
  );
};

GridColumnMenuRowUngroupItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuRowUngroupItem };
