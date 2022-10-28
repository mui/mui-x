import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ViewWeekIcon from '@mui/icons-material/ViewColumn';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
      <Stack px={1.5} pt={1} direction="row">
        <Button onClick={showColumns} startIcon={<ViewWeekIcon fontSize="small" />}>
          {apiRef.current.getLocaleText('columnMenuShowColumns')}
        </Button>
      </Stack>
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
