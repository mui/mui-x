import * as React from 'react';
import PropTypes from 'prop-types';
import { GridPreferencePanelsValue } from '../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

function GridColumnMenuManageItem(props: GridColumnMenuItemProps) {
  const { onClick } = props;
  const apiRef = useGridApiContext();
  const { disableColumnSelector, slots } = useGridRootProps();

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event); // hide column menu
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (disableColumnSelector) {
    return null;
  }

  return (
    <slots.baseMenuItem
      onClick={showColumns}
      iconStart={<slots.columnMenuManageColumnsIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('columnMenuManageColumns')}
    </slots.baseMenuItem>
  );
}

GridColumnMenuManageItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuManageItem };
