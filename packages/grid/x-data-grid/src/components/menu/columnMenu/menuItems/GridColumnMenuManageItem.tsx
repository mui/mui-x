import * as React from 'react';
import PropTypes from 'prop-types';
import { GridPreferencePanelsValue } from '../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

function GridColumnMenuManageItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event); // hide column menu
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (rootProps.disableColumnSelector) {
    return null;
  }

  return (
    <rootProps.slots.baseMenuItem onClick={showColumns} {...rootProps.slotProps?.baseMenuItem}>
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuManageColumnsIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        {apiRef.current.getLocaleText('columnMenuManageColumns')}
      </rootProps.slots.baseListItemText>
    </rootProps.slots.baseMenuItem>
  );
}

GridColumnMenuManageItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuManageItem };
