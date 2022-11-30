import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../../hooks/features/columns';

function GridColumnMenuHideItemSimple(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
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
        apiRef.current.setColumnVisibility(colDef.field, false);
      }, 100);
    },
    [apiRef, colDef.field, onClick, disabled],
  );

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (rootProps.disableColumnSelector) {
    return null;
  }

  if (colDef.hideable === false) {
    return null;
  }

  return (
    <MenuItem onClick={toggleColumn} disabled={disabled}>
      {apiRef.current.getLocaleText('columnMenuHideColumn')}
    </MenuItem>
  );
}

GridColumnMenuHideItemSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuHideItemSimple };
