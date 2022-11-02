import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useGridSelector, gridColumnLookupSelector, GridColDef } from '@mui/x-data-grid-pro';
import { styled } from '@mui/system';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridRowGroupingSanitizedModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';
import {
  getRowGroupingCriteriaFromGroupingField,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  isGroupingColumn,
} from '../hooks/features/rowGrouping/gridRowGroupingUtils';

interface GridRowGroupingColumnMenuItemsProps {
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

const GridRowGroupingColumnMenuItems = (props: GridRowGroupingColumnMenuItemsProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const rowGroupingModel = useGridSelector(apiRef, gridRowGroupingSanitizedModelSelector);
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const renderUnGroupingMenuItem = (field: string) => {
    const ungroupColumn = (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.removeRowGroupingCriteria(field);
      if (onClick) {
        onClick(event);
      }
    };

    const name = columnsLookup[field].headerName ?? field;

    return (
      <StyledStack>
        <StyledButton
          onClick={ungroupColumn}
          key={field}
          startIcon={<rootProps.components.ColumnMenuUngroupIcon />}
          color="inherit"
        >
          {apiRef.current.getLocaleText('unGroupColumn')(name)}
        </StyledButton>
      </StyledStack>
    );
  };

  if (!column || !isGroupingColumn(column.field)) {
    return null;
  }

  if (column.field === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
    return <React.Fragment>{rowGroupingModel.map(renderUnGroupingMenuItem)}</React.Fragment>;
  }

  return renderUnGroupingMenuItem(getRowGroupingCriteriaFromGroupingField(column.field)!);
};

GridRowGroupingColumnMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridRowGroupingColumnMenuItems };
