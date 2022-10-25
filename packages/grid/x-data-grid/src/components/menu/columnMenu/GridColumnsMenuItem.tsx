import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

const GridColumnsMenuItem = (props: GridFilterItemProps) => {
  const { onClick, condensed } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (rootProps.disableColumnSelector) {
    return null;
  }

  if (condensed) {
    return (
      <MenuItem
        onClick={showColumns}
        sx={{
          py: 0,
          color: 'common.black',
          display: 'flex',
          justifyContent: 'center',
          '& .MuiSvgIcon-root': {
            color: 'grey.700',
          },
          '& .MuiListItemIcon-root': {
            minWidth: '29px',
          },
          '& .MuiListItemText-root': {
            flex: 'none',
          },
          '& .MuiTypography-root': {
            fontSize: '16px',
          },
        }}
      >
        <ListItemIcon>
          <ViewWeekIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{apiRef.current.getLocaleText('columnMenuShowColumns')}</ListItemText>
      </MenuItem>
    );
  }

  return (
    <MenuItem onClick={showColumns}>
      {apiRef.current.getLocaleText('columnMenuShowColumns')}
    </MenuItem>
  );
};

GridColumnsMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  condensed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnsMenuItem };
