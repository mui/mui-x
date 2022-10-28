import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../models/gridSortModel';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
}));

const StyledButton = styled(Button)(() => ({
  fontSize: '16px',
  fontWeight: '400',
}));

const SortGridMenuItems = (props: GridFilterItemProps) => {
  const { column } = props;
  const apiRef = useGridApiContext();
  const sortModel = useGridSelector(apiRef, gridSortModelSelector);

  const sortDirection = React.useMemo(() => {
    if (!column) {
      return null;
    }
    const sortItem = sortModel.find((item) => item.field === column.field);
    return sortItem?.sort;
  }, [column, sortModel]);

  const onSortMenuItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(
        column!,
        (direction === sortDirection ? null : direction) as GridSortDirection,
      );
    },
    [apiRef, column, sortDirection],
  );

  if (!column || !column.sortable) {
    return null;
  }

  return (
    <StyledStack>
      <Typography color="text.secondary" fontSize="12px">
        Sort by
      </Typography>
      <Stack direction="row">
        <StyledButton
          onClick={onSortMenuItemClick}
          data-value="asc"
          startIcon={<ArrowUpwardIcon fontSize="small" />}
          color={sortDirection === 'asc' ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('columnMenuSortCondensedAsc')}
        </StyledButton>
        <StyledButton
          onClick={onSortMenuItemClick}
          data-value="desc"
          startIcon={<ArrowDownwardIcon />}
          color={sortDirection === 'desc' ? 'primary' : 'inherit'}
        >
          {apiRef.current.getLocaleText('columnMenuSortCondensedDesc')}
        </StyledButton>
      </Stack>
    </StyledStack>
  );
};

SortGridMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { SortGridMenuItems };
