import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { GridPinnedColumnPosition, GridColumnMenuItemProps } from '@mui/x-data-grid';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

function GridColumnMenuPinningItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const theme = useTheme();

  const pinColumn = React.useCallback(
    (side: GridPinnedColumnPosition) => (event: React.MouseEvent<HTMLElement>) => {
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
    <MenuItem onClick={pinColumn(GridPinnedColumnPosition.LEFT)}>
      <ListItemIcon>
        <rootProps.slots.columnMenuPinLeftIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{apiRef.current.getLocaleText('pinToLeft')}</ListItemText>
    </MenuItem>
  );

  const pinToRightMenuItem = (
    <MenuItem onClick={pinColumn(GridPinnedColumnPosition.RIGHT)}>
      <ListItemIcon>
        <rootProps.slots.columnMenuPinRightIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{apiRef.current.getLocaleText('pinToRight')}</ListItemText>
    </MenuItem>
  );

  if (!colDef) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(colDef.field);

  if (side) {
    const otherSide =
      side === GridPinnedColumnPosition.RIGHT
        ? GridPinnedColumnPosition.LEFT
        : GridPinnedColumnPosition.RIGHT;
    const label = otherSide === GridPinnedColumnPosition.RIGHT ? 'pinToRight' : 'pinToLeft';
    const Icon =
      side === GridPinnedColumnPosition.RIGHT
        ? rootProps.slots.columnMenuPinLeftIcon
        : rootProps.slots.columnMenuPinRightIcon;
    return (
      <React.Fragment>
        <MenuItem onClick={pinColumn(otherSide)}>
          <ListItemIcon>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{apiRef.current.getLocaleText(label)}</ListItemText>
        </MenuItem>
        <MenuItem onClick={unpinColumn}>
          <ListItemIcon />
          <ListItemText>{apiRef.current.getLocaleText('unpin')}</ListItemText>
        </MenuItem>
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
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuPinningItem };
