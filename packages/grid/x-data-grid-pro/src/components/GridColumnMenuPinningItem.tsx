import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { GridColumnMenuItemProps } from '@mui/x-data-grid';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuPinningItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const theme = useTheme();

  const pinColumn = React.useCallback(
    (side: GridPinnedPosition) => (event: React.MouseEvent<HTMLElement>) => {
      apiRef.current.pinColumn(colDef.field, side);
      onClick(event);
    },
    [apiRef, colDef.field, onClick],
  );

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(colDef.field);
    onClick(event);
  };
  const pinToLeftMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedPosition.left)}
      {...rootProps.slotProps?.baseMenuItem}
    >
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuPinLeftIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        {apiRef.current.getLocaleText('pinToLeft')}
      </rootProps.slots.baseListItemText>
    </rootProps.slots.baseMenuItem>
  );

  const pinToRightMenuItem = (
    <rootProps.slots.baseMenuItem
      onClick={pinColumn(GridPinnedPosition.right)}
      {...rootProps.slotProps?.baseMenuItem}
    >
      <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
        <rootProps.slots.columnMenuPinRightIcon fontSize="small" />
      </rootProps.slots.baseListItemIcon>
      <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
        {apiRef.current.getLocaleText('pinToRight')}
      </rootProps.slots.baseListItemText>
    </rootProps.slots.baseMenuItem>
  );

  if (!colDef) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(colDef.field);

  if (side) {
    const otherSide =
      side === GridPinnedPosition.right ? GridPinnedPosition.left : GridPinnedPosition.right;
    const label = otherSide === GridPinnedPosition.right ? 'pinToRight' : 'pinToLeft';
    const Icon =
      side === GridPinnedPosition.right
        ? rootProps.slots.columnMenuPinLeftIcon
        : rootProps.slots.columnMenuPinRightIcon;
    return (
      <React.Fragment>
        <rootProps.slots.baseMenuItem
          onClick={pinColumn(otherSide)}
          {...rootProps.slotProps?.baseMenuItem}
        >
          <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon}>
            <Icon fontSize="small" />
          </rootProps.slots.baseListItemIcon>
          <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
            {apiRef.current.getLocaleText(label)}
          </rootProps.slots.baseListItemText>
        </rootProps.slots.baseMenuItem>
        <rootProps.slots.baseMenuItem onClick={unpinColumn} {...rootProps.slotProps?.baseMenuItem}>
          <rootProps.slots.baseListItemIcon {...rootProps.slotProps?.baseListItemIcon} />
          <rootProps.slots.baseListItemText {...rootProps.slotProps?.baseListItemText}>
            {apiRef.current.getLocaleText('unpin')}
          </rootProps.slots.baseListItemText>
        </rootProps.slots.baseMenuItem>
      </React.Fragment>
    );
  }

  if (theme.direction === 'rtl') {
    return (
      <React.Fragment>
        {pinToRightMenuItem}
        {pinToLeftMenuItem}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {pinToLeftMenuItem}
      {pinToRightMenuItem}
    </React.Fragment>
  );
}

GridColumnMenuPinningItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuPinningItem };
