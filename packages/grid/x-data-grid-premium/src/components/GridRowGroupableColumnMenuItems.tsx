import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { gridColumnLookupSelector, useGridSelector, GridColDef } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';

interface GridRowGroupableColumnMenuItemsProps {
  column?: GridColDef;
  onClick?: (event: React.MouseEvent<any>) => void;
}

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 1, 1.5),
  flexDirection: 'row',
}));

const StyledButton = styled(Button)(() => ({
  fontSize: '16px',
  fontWeight: '400',
  textTransform: 'none',
}));

const GridRowGroupableColumnMenuItems = (props: GridRowGroupableColumnMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  if (!column?.groupable) {
    return null;
  }

  const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.removeRowGroupingCriteria(column.field);
    if (onClick) {
      onClick(event);
    }
  };

  const groupColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.addRowGroupingCriteria(column.field);
    if (onClick) {
      onClick(event);
    }
  };

  const name = columnsLookup[column.field].headerName ?? column.field;

  const UngroupIcon = rootProps.components?.ColumnMenuUngroupIcon;
  const GroupIcon = rootProps.components?.ColumnMenuGroupIcon;

  if (rowGroupingModel.includes(column.field)) {
    return (
      <StyledStack>
        <StyledButton
          onClick={ungroupColumn}
          key={column.field}
          startIcon={UngroupIcon ? <UngroupIcon /> : null}
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
        startIcon={GroupIcon ? <GroupIcon /> : null}
        color="inherit"
      >
        {apiRef.current.getLocaleText('groupColumn')(name)}
      </StyledButton>
    </Stack>
  );
};

GridRowGroupableColumnMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridRowGroupableColumnMenuItems };
