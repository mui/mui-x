import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterModelSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

const GridFilterMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick, condensed } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);

  const isColumnFiltered = React.useMemo(() => {
    if (filterModel.items.length <= 0) {
      return false;
    }
    return filterModel.items.some((item) => item.columnField === column.field);
  }, [column.field, filterModel.items]);

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  const clearFilters = React.useCallback(() => {
    if (isColumnFiltered) {
      apiRef.current.upsertFilterItems(
        filterModel.items.filter((item) => item.columnField !== column.field),
      );
    }
  }, [apiRef, column.field, filterModel.items, isColumnFiltered]);

  if (rootProps.disableColumnFilter || !column?.filterable) {
    return null;
  }

  if (condensed) {
    return (
      <Stack
        px={1.5}
        py={0.5}
        direction="row"
        justifyContent="space-between"
        sx={{
          '& .MuiButton-root': {
            fontSize: '16px',
            fontWeight: '400',
            textTransform: 'none',
          },
        }}
      >
        <Button
          onClick={showFilter}
          startIcon={<FilterAltIcon fontSize="small" />}
          sx={{
            color: isColumnFiltered ? 'primary.main' : 'common.black',
            '& .MuiSvgIcon-root': {
              color: isColumnFiltered ? 'primary.main' : 'grey.700',
            },
          }}
        >
          {apiRef.current.getLocaleText('columnMenuFilter')}
        </Button>
        {isColumnFiltered && (
          <IconButton
            aria-label="clear aggregate"
            onClick={clearFilters}
            sx={{ color: 'grey.700' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    );
  }

  return (
    <MenuItem onClick={showFilter}>{apiRef.current.getLocaleText('columnMenuFilter')}</MenuItem>
  );
};

GridFilterMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  condensed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridFilterMenuItem };
