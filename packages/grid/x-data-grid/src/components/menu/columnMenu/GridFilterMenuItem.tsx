import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  if (rootProps.disableColumnFilter || !column?.filterable) {
    return null;
  }

  if (condensed) {
    return (
      <MenuItem
        onClick={showFilter}
        sx={{
          color: filterModel.items?.length > 0 ? 'primary.main' : 'common.black',
          '& .MuiSvgIcon-root': {
            color: filterModel.items?.length > 0 ? 'primary.main' : 'grey.700',
          },
          '& .MuiListItemIcon-root': {
            minWidth: '29px',
          },
          '& .MuiTypography-root': {
            fontSize: '16px',
          },
        }}
      >
        <ListItemIcon>
          <FilterAltIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{apiRef.current.getLocaleText('columnMenuFilter')}</ListItemText>
      </MenuItem>
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
  onClick: PropTypes.func.isRequired,
} as any;

export { GridFilterMenuItem };
