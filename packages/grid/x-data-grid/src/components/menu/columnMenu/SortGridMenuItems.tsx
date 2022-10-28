import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridSortModelSelector } from '../../../hooks/features/sorting/gridSortingSelector';
import { GridSortDirection } from '../../../models/gridSortModel';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';

const SortGridMenuItems = (props: GridFilterItemProps) => {
  const { column, onClick, condensed } = props;
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
      if (!condensed) {
        // Menu shouldn't be closed in condensed view?
        onClick(event);
      }
      const direction = event.currentTarget.getAttribute('data-value') || null;
      apiRef.current.sortColumn(
        column!,
        (direction === sortDirection ? null : direction) as GridSortDirection,
      );
    },
    [apiRef, column, onClick, sortDirection, condensed],
  );

  if (!column || !column.sortable) {
    return null;
  }

  if (condensed) {
    return (
      <Stack px={1.5} pb={1}>
        <Typography color="text.secondary" fontSize="12px">
          Sort by
        </Typography>
        <Stack
          direction="row"
          sx={{
            '& .MuiButton-root': {
              fontSize: '16px',
              fontWeight: '400',
            },
          }}
        >
          <Button
            onClick={onSortMenuItemClick}
            data-value="asc"
            startIcon={<ArrowUpwardIcon fontSize="small" />}
            color={sortDirection === 'asc' ? 'primary' : 'inherit'}
          >
            {apiRef.current.getLocaleText('columnMenuSortCondensedAsc')}
          </Button>
          <Button
            onClick={onSortMenuItemClick}
            data-value="desc"
            startIcon={<ArrowDownwardIcon />}
            color={sortDirection === 'desc' ? 'primary' : 'inherit'}
          >
            {apiRef.current.getLocaleText('columnMenuSortCondensedDesc')}
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <React.Fragment>
      <MenuItem onClick={onSortMenuItemClick} disabled={sortDirection == null}>
        {apiRef.current.getLocaleText('columnMenuUnsort')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="asc" disabled={sortDirection === 'asc'}>
        {apiRef.current.getLocaleText('columnMenuSortAsc')}
      </MenuItem>
      <MenuItem onClick={onSortMenuItemClick} data-value="desc" disabled={sortDirection === 'desc'}>
        {apiRef.current.getLocaleText('columnMenuSortDesc')}
      </MenuItem>
    </React.Fragment>
  );
};

SortGridMenuItems.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  condensed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
} as any;

export { SortGridMenuItems };
