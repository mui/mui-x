import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../hooks/features/columns';

const HideGridColMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick, condensed } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const timeoutRef = React.useRef<any>();

  const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
  const columnsWithMenu = visibleColumns.filter((col) => col.disableColumnMenu !== true);
  // do not allow to hide the last column with menu
  const disabled = columnsWithMenu.length === 1;

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      /**
       * Disabled `MenuItem` would trigger `click` event
       * after imperative `.click()` call on HTML element.
       * Also, click is triggered in testing environment as well.
       */
      if (disabled) {
        return;
      }
      onClick(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        apiRef.current.setColumnVisibility(column?.field, false);
      }, 100);
    },
    [apiRef, column?.field, onClick, disabled],
  );

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (rootProps.disableColumnSelector) {
    return null;
  }

  if (column.hideable === false) {
    return null;
  }

  if (condensed) {
    return (
      <Stack
        px={1.5}
        py={1}
        direction="row"
        sx={{
          '& .MuiButton-root': {
            fontSize: '16px',
            fontWeight: '400',
            textTransform: 'none',
          },
        }}
      >
        <Button
          onClick={toggleColumn}
          disabled={disabled}
          startIcon={<VisibilityOffIcon fontSize="small" />}
          color="inherit"
        >
          {apiRef.current.getLocaleText('columnMenuHideColumnCondensed')}
        </Button>
      </Stack>
    );
  }

  return (
    <MenuItem onClick={toggleColumn} disabled={disabled}>
      {apiRef.current.getLocaleText('columnMenuHideColumn')}
    </MenuItem>
  );
};

HideGridColMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  condensed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
} as any;

export { HideGridColMenuItem };
