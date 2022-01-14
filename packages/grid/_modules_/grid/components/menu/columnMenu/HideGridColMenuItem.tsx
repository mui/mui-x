import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { GridFilterItemProps } from './GridFilterItemProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { visibleGridColumnsSelector } from '../../../hooks/features/columns';

const HideGridColMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const timeoutRef = React.useRef<any>();

  const visibleColumns = visibleGridColumnsSelector(apiRef.current.state);
  const columnsWithMenu = visibleColumns.filter((col) => col.disableColumnMenu !== true);

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        apiRef.current.setColumnVisibility(column?.field, false);
      }, 100);
    },
    [apiRef, column?.field, onClick],
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

  return (
    <MenuItem
      onClick={toggleColumn}
      // do not allow to hide the last column with menu
      disabled={columnsWithMenu.length === 1}
    >
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
  onClick: PropTypes.func.isRequired,
} as any;

export { HideGridColMenuItem };
