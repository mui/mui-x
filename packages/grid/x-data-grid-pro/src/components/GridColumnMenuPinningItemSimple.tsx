import * as React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { GridColumnMenuItemProps } from '@mui/x-data-grid';
import { GridPinnedPosition } from '../hooks/features/columnPinning';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';

function GridColumnMenuPinningItemSimple(props: GridColumnMenuItemProps) {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();

  const pinColumn = (side: GridPinnedPosition) => (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.pinColumn(column.field, side);
    onClick(event);
  };

  const unpinColumn = (event: React.MouseEvent<HTMLElement>) => {
    apiRef.current.unpinColumn(column.field);
    onClick(event);
  };

  if (!column) {
    return null;
  }

  const side = apiRef.current.isColumnPinned(column.field);

  if (side) {
    const otherSide =
      side === GridPinnedPosition.right ? GridPinnedPosition.left : GridPinnedPosition.right;
    const label = otherSide === GridPinnedPosition.right ? 'pinToRight' : 'pinToLeft';

    return (
      <React.Fragment>
        <MenuItem onClick={pinColumn(otherSide)}>{apiRef.current.getLocaleText(label)}</MenuItem>
        <MenuItem onClick={unpinColumn}>{apiRef.current.getLocaleText('unpin')}</MenuItem>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <MenuItem onClick={pinColumn(GridPinnedPosition.left)}>
        {apiRef.current.getLocaleText('pinToLeft')}
      </MenuItem>
      <MenuItem onClick={pinColumn(GridPinnedPosition.right)}>
        {apiRef.current.getLocaleText('pinToRight')}
      </MenuItem>
    </React.Fragment>
  );
}

GridColumnMenuPinningItemSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuPinningItemSimple };
