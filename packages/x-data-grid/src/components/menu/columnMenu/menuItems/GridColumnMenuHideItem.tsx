import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../../hooks/features/columns';

function GridColumnMenuHideItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

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
      apiRef.current.setColumnVisibility(colDef.field, false);
      onClick(event);
    },
    [apiRef, colDef.field, onClick, disabled],
  );

  if (rootProps.disableColumnSelector) {
    return null;
  }

  if (colDef.hideable === false) {
    return null;
  }

  return (
    <rootProps.slots.baseMenuItem
      onClick={toggleColumn}
      disabled={disabled}
      iconStart={<rootProps.slots.columnMenuHideIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('columnMenuHideColumn')}
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuHideItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuHideItem };
